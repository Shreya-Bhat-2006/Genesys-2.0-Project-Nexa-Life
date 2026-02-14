from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from Backend.schemas import CreateCreditRequest, CreditResponse
from Backend.models import Credit, User
from Backend.database import get_db

from Backend.dependencies import require_role
from Backend.auth import get_current_user

router = APIRouter()





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
