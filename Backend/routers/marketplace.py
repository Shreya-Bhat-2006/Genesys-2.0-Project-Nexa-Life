from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import hashlib

from Backend.schemas import ListCreditRequest, BuyCreditRequest, CreditDetailResponse
from Backend.models import Credit, User, CreditHistory
from Backend.database import get_db
from Backend.auth import get_current_user

router = APIRouter()


# =====================================================
# Helper: Generate Blockchain Hash
# =====================================================
def generate_hash(data: str):
    return hashlib.sha256(data.encode()).hexdigest()


# =====================================================
# GET AVAILABLE CREDITS (Public Marketplace)
# =====================================================
@router.get("/available-credits", response_model=List[CreditDetailResponse])
def get_available_credits(db: Session = Depends(get_db)):

    credits = db.query(Credit).filter(
        Credit.status == "Available",
        Credit.price.isnot(None),
        Credit.listed_at.isnot(None)
    ).all()

    return credits


# =====================================================
# LIST CREDIT FOR SALE
# =====================================================
@router.post("/list-credit", response_model=CreditDetailResponse)
def list_credit_for_sale(
    data: ListCreditRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    credit = db.query(Credit).filter(
        Credit.credit_id == data.credit_id
    ).first()

    if not credit:
        raise HTTPException(status_code=404, detail="Credit not found")

    if credit.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only owner can list")

    if credit.status in ["Used", "Sold"]:
        raise HTTPException(status_code=400, detail=f"Cannot list {credit.status} credits")

    # Update credit
    credit.price = data.price
    credit.listed_at = datetime.utcnow()
    credit.status = "Available"

    # ----------------------------
    # Blockchain History Logic
    # ----------------------------
    last_history = db.query(CreditHistory).order_by(
        CreditHistory.id.desc()
    ).first()

    previous_hash = last_history.current_hash if last_history else "GENESIS"

    data_to_hash = f"{credit.id}{current_user.company_name}Listed{datetime.utcnow()}{previous_hash}"
    current_hash = generate_hash(data_to_hash)

    history = CreditHistory(
        credit_id=credit.id,
        action="Listed",
        from_owner=current_user.company_name,
        to_owner="Marketplace",
        details=f"Listed at price: {data.price}",
        timestamp=datetime.utcnow(),
        previous_hash=previous_hash,
        current_hash=current_hash
    )

    db.add(history)

    db.commit()
    db.refresh(credit)

    return credit


# =====================================================
# BUY CREDIT
# =====================================================
@router.post("/buy-credit", response_model=CreditDetailResponse)
def buy_credit(
    data: BuyCreditRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    credit = db.query(Credit).filter(
        Credit.credit_id == data.credit_id
    ).first()

    if not credit:
        raise HTTPException(status_code=404, detail="Credit not found")

    if credit.status != "Available" or credit.price is None:
        raise HTTPException(status_code=400, detail="Credit not available for purchase")

    if credit.owner_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot buy your own credit")

    seller = db.query(User).filter(User.id == credit.owner_id).first()

    old_owner_name = seller.company_name if seller else "Unknown"

    # Update ownership
    credit.owner_id = current_user.id
    credit.sold_to = current_user.id
    credit.status = "Sold"

    # ----------------------------
    # Blockchain History Logic
    # ----------------------------
    last_history = db.query(CreditHistory).order_by(
        CreditHistory.id.desc()
    ).first()

    previous_hash = last_history.current_hash if last_history else "GENESIS"

    data_to_hash = f"{credit.id}{old_owner_name}Purchased{datetime.utcnow()}{previous_hash}"
    current_hash = generate_hash(data_to_hash)

    history = CreditHistory(
        credit_id=credit.id,
        action="Purchased",
        from_owner=old_owner_name,
        to_owner=current_user.company_name,
        details=f"Purchased at price: {credit.price}",
        timestamp=datetime.utcnow(),
        previous_hash=previous_hash,
        current_hash=current_hash
    )

    db.add(history)

    db.commit()
    db.refresh(credit)

    return credit
