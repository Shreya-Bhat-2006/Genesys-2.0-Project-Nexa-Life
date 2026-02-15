from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import hashlib

from Backend.schemas import (
    CreateCreditRequest,
    CreditResponse,
    CreditDetailResponse,
    TransferRequest,
    UseCreditRequest
)
from Backend.models import Credit, User, CreditHistory
from Backend.database import get_db
from Backend.dependencies import require_role
from Backend.auth import get_current_user

router = APIRouter()


# -------------------------------------------------
# 🔐 BLOCKCHAIN HASH FUNCTION
# -------------------------------------------------
def generate_hash(data_string: str):
    return hashlib.sha256(data_string.encode()).hexdigest()


def add_history_block(db, credit, action, from_owner, to_owner, details=None):

    last_block = db.query(CreditHistory)\
        .order_by(CreditHistory.id.desc())\
        .first()

    previous_hash = last_block.current_hash if last_block else "GENESIS"

    timestamp = datetime.utcnow()

    data_string = f"{credit.id}{action}{from_owner}{to_owner}{previous_hash}{timestamp}"

    current_hash = generate_hash(data_string)

    history = CreditHistory(
        credit_id=credit.id,
        action=action,
        from_owner=from_owner,
        to_owner=to_owner,
        details=details,
        timestamp=timestamp,
        previous_hash=previous_hash,
        current_hash=current_hash
    )

    db.add(history)


# -------------------------------------------------
# CREATE CREDIT (Admin Only)
# -------------------------------------------------
@router.post("/create-credit", response_model=CreditResponse)
def create_credit(
    data: CreateCreditRequest,
    current_user=Depends(require_role("admin")),
    db: Session = Depends(get_db)
):

    existing = db.query(Credit).filter(Credit.credit_id == data.credit_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Credit ID already exists")

    owner = db.query(User).filter(User.email == data.owner_email).first()
    if not owner:
        raise HTTPException(status_code=404, detail="Owner not found")

    new_credit = Credit(
        credit_id=data.credit_id,
        owner_id=owner.id,
        status="Available"
    )

    db.add(new_credit)
    db.commit()
    db.refresh(new_credit)

    # 🔗 Add ledger block
    add_history_block(
        db,
        new_credit,
        action="Created",
        from_owner="Admin",
        to_owner=owner.company_name
    )

    db.commit()
    return new_credit


# -------------------------------------------------
# GET MY CREDITS
# -------------------------------------------------
@router.get("/my-credits", response_model=List[CreditDetailResponse])
def get_my_credits(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return db.query(Credit).filter(
        Credit.owner_id == current_user.id
    ).all()


# -------------------------------------------------
# GET ALL CREDITS
# -------------------------------------------------
@router.get("/credits", response_model=List[CreditResponse])
def get_credits(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return db.query(Credit).all()


# -------------------------------------------------
# GET CREDIT DETAIL
# -------------------------------------------------
@router.get("/{credit_id}", response_model=CreditDetailResponse)
def get_credit_detail(
    credit_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    credit = db.query(Credit).filter(
        Credit.credit_id == credit_id
    ).first()

    if not credit:
        raise HTTPException(status_code=404, detail="Credit not found")

    return credit


# -------------------------------------------------
# TRANSFER CREDIT
# -------------------------------------------------
@router.post("/transfer-credit", response_model=CreditResponse)
def transfer_credit(
    data: TransferRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    credit = db.query(Credit).filter(Credit.credit_id == data.credit_id).first()
    if not credit:
        raise HTTPException(status_code=404, detail="Credit not found")

    if credit.status == "Used":
        raise HTTPException(status_code=400, detail="Cannot transfer used credit")

    if credit.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only owner can transfer")

    new_owner = db.query(User).filter(User.email == data.new_owner_email).first()
    if not new_owner:
        raise HTTPException(status_code=404, detail="New owner not found")

    old_owner_name = current_user.company_name
    credit.owner_id = new_owner.id

    # 🔗 Add ledger block
    add_history_block(
        db,
        credit,
        action="Transferred",
        from_owner=old_owner_name,
        to_owner=new_owner.company_name
    )

    db.commit()
    db.refresh(credit)

    return credit


# -------------------------------------------------
# USE CREDIT (Retire)
# -------------------------------------------------
@router.post("/use-credit", response_model=CreditResponse)
def use_credit(
    data: UseCreditRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    credit = db.query(Credit).filter(Credit.credit_id == data.credit_id).first()
    if not credit:
        raise HTTPException(status_code=404, detail="Credit not found")

    if credit.status == "Used":
        raise HTTPException(status_code=400, detail="Credit already used")

    if credit.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only owner can use credit")

    credit.status = "Used"

    # 🔗 Add ledger block
    add_history_block(
        db,
        credit,
        action="Used",
        from_owner=current_user.company_name,
        to_owner=current_user.company_name,
        details="Credit permanently retired"
    )

    db.commit()
    db.refresh(credit)

    return credit


# -------------------------------------------------
# VERIFY LEDGER INTEGRITY
# -------------------------------------------------
@router.get("/verify-ledger")
def verify_ledger(db: Session = Depends(get_db)):

    blocks = db.query(CreditHistory)\
        .order_by(CreditHistory.id.asc())\
        .all()

    for i in range(1, len(blocks)):

        previous = blocks[i - 1]
        current = blocks[i]

        expected_hash = generate_hash(
            f"{current.credit_id}{current.action}{current.from_owner}{current.to_owner}{current.previous_hash}{current.timestamp}"
        )

        if current.previous_hash != previous.current_hash:
            return {"valid": False, "error": "Broken chain link detected"}

        if current.current_hash != expected_hash:
            return {"valid": False, "error": "Data tampering detected"}

    return {"valid": True, "message": "Ledger is secure"}
