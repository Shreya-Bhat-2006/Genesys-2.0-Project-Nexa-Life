from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
from typing import List

app = FastAPI()

users = []
credits = []

# ======================
# MODELS
# ======================

class User(BaseModel):
    company_name: str
    email: str
    password: str
    role: str


class HistoryEntry(BaseModel):
    action: str
    from_owner: str | None = None
    to_owner: str | None = None
    timestamp: str


class Credit(BaseModel):
    credit_id: str
    owner_email: str
    status: str
    history: List[HistoryEntry] = []


class CreateCreditRequest(BaseModel):
    credit_id: str
    owner_email: str
    admin_email: str


class TransferRequest(BaseModel):
    credit_id: str
    current_owner_email: str
    new_owner_email: str


class UseCreditRequest(BaseModel):
    credit_id: str
    owner_email: str


# ======================
# USER ROUTES
# ======================

@app.get("/")
def home():
    return {"message": "Green Carbon Ledger Backend Running"}


@app.post("/register")
def register(user: User):
    users.append(user)
    return {"message": "User registered successfully", "user": user}


@app.get("/users")
def get_users():
    return users


# ======================
# CREDIT ROUTES
# ======================

@app.post("/create-credit")
def create_credit(data: CreateCreditRequest):

    # Check if admin exists
    admin_user = None
    for user in users:
        if user.email == data.admin_email:
            admin_user = user
            break

    if not admin_user:
        raise HTTPException(status_code=404, detail="Admin user not found")

    # Check if role is admin
    if admin_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admin can create credits")

    # Prevent duplicate credit IDs
    for c in credits:
        if c.credit_id == data.credit_id:
            raise HTTPException(status_code=400, detail="Credit ID already exists")

    # Create credit
    new_credit = Credit(
        credit_id=data.credit_id,
        owner_email=data.owner_email,
        status="Active",
        history=[]
    )

    # Add creation history
    new_credit.history.append(
        HistoryEntry(
            action="Created",
            from_owner=None,
            to_owner=data.owner_email,
            timestamp=str(datetime.utcnow())
        )
    )

    credits.append(new_credit)

    return {
        "message": "Carbon credit created successfully by admin",
        "credit": new_credit
    }


@app.get("/credits")
def get_credits():
    return credits


@app.post("/transfer-credit")
def transfer_credit(data: TransferRequest):

    for credit in credits:

        if credit.credit_id == data.credit_id:

            if credit.status == "Used":
                raise HTTPException(status_code=400, detail="Cannot transfer a used credit")

            if credit.owner_email != data.current_owner_email:
                raise HTTPException(status_code=403, detail="Only current owner can transfer this credit")

            credit.history.append(
                HistoryEntry(
                    action="Transferred",
                    from_owner=credit.owner_email,
                    to_owner=data.new_owner_email,
                    timestamp=str(datetime.utcnow())
                )
            )

            credit.owner_email = data.new_owner_email

            return {"message": "Credit transferred successfully", "credit": credit}

    raise HTTPException(status_code=404, detail="Credit not found")


@app.post("/use-credit")
def use_credit(data: UseCreditRequest):

    for credit in credits:

        if credit.credit_id == data.credit_id:

            if credit.status == "Used":
                raise HTTPException(status_code=400, detail="Credit already used")

            if credit.owner_email != data.owner_email:
                raise HTTPException(status_code=403, detail="Only current owner can use this credit")

            credit.history.append(
                HistoryEntry(
                    action="Used",
                    from_owner=credit.owner_email,
                    to_owner=None,
                    timestamp=str(datetime.utcnow())
                )
            )

            credit.status = "Used"

            return {"message": "Credit marked as Used", "credit": credit}

    raise HTTPException(status_code=404, detail="Credit not found")
