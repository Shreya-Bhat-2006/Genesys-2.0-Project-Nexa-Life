from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from Backend.schemas import ListCreditRequest, BuyCreditRequest, CreditDetailResponse
from Backend.models import Credit, User, CreditHistory
from Backend.database import get_db
from Backend.auth import get_current_user

router = APIRouter()


# -------------------------------------------------
# GET AVAILABLE CREDITS (Public - Marketplace)
# -------------------------------------------------
@router.get("/available-credits", response_model=List[CreditDetailResponse])
def get_available_credits(db: Session = Depends(get_db)):
    """Get all credits available in marketplace (PUBLIC)"""
    
    credits = db.query(Credit).filter(
        Credit.status == "Available",
        Credit.price.isnot(None),
        Credit.listed_at.isnot(None)
    ).all()
    
    return credits


# -------------------------------------------------
# LIST CREDIT FOR SALE (Owner Only)
# -------------------------------------------------
@router.post("/list-credit", response_model=CreditDetailResponse)
def list_credit_for_sale(
    data: ListCreditRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List own credit in marketplace with a price"""
    
    credit = db.query(Credit).filter(
        Credit.credit_id == data.credit_id
    ).first()
    
    if not credit:
        raise HTTPException(status_code=404, detail="Credit not found")
    
    # Only owner can list
    if credit.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only owner can list")
    
    # Cannot list used or already sold credits
    if credit.status in ["Used", "Sold"]:
        raise HTTPException(status_code=400, detail=f"Cannot list {credit.status} credits")
    
    # Update credit
    credit.price = data.price
    credit.listed_at = datetime.utcnow()
    credit.status = "Available"
    
    # Add history
    history = CreditHistory(
        credit_id=credit.id,
        action="Listed",
        from_owner=current_user.company_name,
        to_owner="Marketplace",
        details=f"Listed at price: {data.price}"
    )
    credit.history.append(history)
    
    db.commit()
    db.refresh(credit)
    
    return credit


# -------------------------------------------------
# BUY CREDIT (Buyer - transfers ownership)
# -------------------------------------------------
@router.post("/buy-credit", response_model=CreditDetailResponse)
def buy_credit(
    data: BuyCreditRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Buy a credit from marketplace (transfers ownership)"""
    
    credit = db.query(Credit).filter(
        Credit.credit_id == data.credit_id
    ).first()
    
    if not credit:
        raise HTTPException(status_code=404, detail="Credit not found")
    
    # Credit must be available and listed
    if credit.status != "Available" or credit.price is None:
        raise HTTPException(status_code=400, detail="Credit not available for purchase")
    
    # Cannot buy own credit
    if credit.owner_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot buy your own credit")
    
    # Get seller info
    seller = db.query(User).filter(User.id == credit.owner_id).first()
    
    # Update credit ownership
    old_owner = seller.company_name
    credit.owner_id = current_user.id
    credit.sold_to = current_user.id
    credit.status = "Sold"
    
    # Add history record
    history = CreditHistory(
        credit_id=credit.id,
        action="Purchased",
        from_owner=old_owner,
        to_owner=current_user.company_name,
        details=f"Purchased at price: {credit.price}"
    )
    credit.history.append(history)
    
    db.commit()
    db.refresh(credit)
    
    return credit
