from pydantic import BaseModel, Field
from typing import List, Optional

# -------- USER MODELS --------

class UserCreate(BaseModel):
    company_name: str
    email: str
    password: str
    role: str


class UserResponse(BaseModel):
    company_name: str
    email: str
    role: str


# -------- AUTH --------

class TokenResponse(BaseModel):
    access_token: str
    token_type: str


# -------- CREDIT MODELS --------

class HistoryEntry(BaseModel):
    action: str
    from_owner: Optional[str] = None
    to_owner: Optional[str] = None
    timestamp: str


class Credit(BaseModel):
    credit_id: str
    owner_email: str
    status: str
    history: List[HistoryEntry] = Field(default_factory=list)


class CreditResponse(BaseModel):
    credit_id: str
    owner_email: str
    status: str
    history: List[HistoryEntry]


class CreateCreditRequest(BaseModel):
    credit_id: str
    owner_email: str


class TransferRequest(BaseModel):
    credit_id: str
    new_owner_email: str


class UseCreditRequest(BaseModel):
    credit_id: str
