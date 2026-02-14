from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from Backend.schemas import (
    CreateCreditRequest,
    CreditResponse,
    TransferRequest,
    UseCreditRequest
)
from Backend.models import Credit, User
from Backend.database import get_db
from Backend.dependencies import require_role
from Backend.auth import get_current_user

router = APIRouter()


# ----------------------------
# CREATE CREDIT (Admin Only)
# ----------------------------
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
        status="Active"
    )

    db.add(new_credit)
    db.commit()
    db.refresh(new_credit)

    return {
        "credit_id": new_credit.credit_id,
        "owner_email": owner.email,
        "status": new_credit.status,
        "history": []
    }


# ----------------------------
# GET ALL CREDITS
# ----------------------------
@router.get("/credits", response_model=List[CreditResponse])
def get_credits(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    credits = db.query(Credit).all()

    result = []
    for credit in credits:
        result.append({
            "credit_id": credit.credit_id,
            "owner_email": credit.owner.email,
            "status": credit.status,
            "history": []
        })

    return result


# ----------------------------
# TRANSFER CREDIT
# ----------------------------
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

    if credit.owner.email != current_user.email:
        raise HTTPException(status_code=403, detail="Only owner can transfer")

    new_owner = db.query(User).filter(User.email == data.new_owner_email).first()

    if not new_owner:
        raise HTTPException(status_code=404, detail="New owner not found")

    credit.owner_id = new_owner.id

    db.commit()
    db.refresh(credit)

    return {
        "credit_id": credit.credit_id,
        "owner_email": new_owner.email,
        "status": credit.status,
        "history": []
    }


# ----------------------------
# USE CREDIT (RETIRE)
# ----------------------------
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

    if credit.owner.email != current_user.email:
        raise HTTPException(status_code=403, detail="Only owner can use credit")

    credit.status = "Used"

    db.commit()
    db.refresh(credit)

    return {
        "credit_id": credit.credit_id,
        "owner_email": credit.owner.email,
        "status": credit.status,
        "history": []
    }
