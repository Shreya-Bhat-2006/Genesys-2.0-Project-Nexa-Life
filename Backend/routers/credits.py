from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime
from schemas import *
from models import credits
from auth import get_current_user
from dependencies import require_role

router = APIRouter()


@router.post("/create-credit", response_model=CreditResponse)
def create_credit(
    data: CreateCreditRequest,
    current_user: dict = Depends(require_role("admin"))
):

    for c in credits:
        if c.credit_id == data.credit_id:
            raise HTTPException(status_code=400, detail="Credit ID already exists")

    new_credit = Credit(
        credit_id=data.credit_id,
        owner_email=data.owner_email,
        status="Active"
    )

    new_credit.history.append(
        HistoryEntry(
            action="Created",
            to_owner=data.owner_email,
            timestamp=str(datetime.utcnow())
        )
    )

    credits.append(new_credit)

    return new_credit


@router.get("/credits", response_model=List[CreditResponse])
def get_credits(current_user: dict = Depends(get_current_user)):
    return credits


@router.get("/marketplace", response_model=List[CreditResponse])
def marketplace():
    return [credit for credit in credits if credit.status == "Active"]


@router.get("/verify/{credit_id}", response_model=CreditResponse)
def verify_credit(credit_id: str):

    for credit in credits:
        if credit.credit_id == credit_id:
            return credit

    raise HTTPException(status_code=404, detail="Credit not found")
