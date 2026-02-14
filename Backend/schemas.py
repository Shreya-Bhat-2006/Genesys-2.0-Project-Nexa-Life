from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


# ----------------------------
# USER SCHEMAS
# ----------------------------

class UserCreate(BaseModel):
    company_name: str
    email: str
    password: str
    role: str


class UserResponse(BaseModel):
    company_name: str
    email: str
    role: str

    class Config:
        from_attributes = True


# ----------------------------
# AUTH SCHEMA
# ----------------------------

class TokenResponse(BaseModel):
    access_token: str
    token_type: str


# ----------------------------
# CREDIT SCHEMAS
# ----------------------------

class CreateCreditRequest(BaseModel):
    credit_id: str
    owner_email: str


class CreditResponse(BaseModel):
    credit_id: str
    owner_email: str
    status: str
    history: List = []

    class Config:
        from_attributes = True


class TransferRequest(BaseModel):
    credit_id: str
    new_owner_email: str


class UseCreditRequest(BaseModel):
    credit_id: str
