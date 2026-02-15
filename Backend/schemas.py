from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


# ============================
# USER SCHEMAS
# ============================

class UserCreate(BaseModel):
    company_name: str
    email: str
    password: str
    # 🚨 role REMOVED (cannot register as admin)


class UserResponse(BaseModel):
    id: int
    company_name: str
    email: str
    role: str
    applied_as: Optional[str]
    approval_status: str

    class Config:
        from_attributes = True


# ============================
# AUTH SCHEMA
# ============================

class TokenResponse(BaseModel):
    access_token: str
    token_type: str


# ============================
# GREEN PROJECT SCHEMAS
# ============================

class GreenProjectCreate(BaseModel):
    project_name: str
    project_type: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    company_reg_number: Optional[str] = None
    estimated_annual_reduction: Optional[float] = None
    project_start_date: Optional[str] = None
    project_end_date: Optional[str] = None
    certification_type: Optional[str] = None
    budget: Optional[float] = None
    expected_credits_per_year: Optional[int] = None
    contact_person: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None


class GreenProjectResponse(BaseModel):
    id: int
    project_name: str
    project_type: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    owner_id: int
    company_reg_number: Optional[str] = None
    estimated_annual_reduction: Optional[float] = None
    certification_type: Optional[str] = None
    status: str
    rejection_reason: Optional[str] = None
    credits_count: int
    expected_credits_per_year: Optional[int] = None
    created_at: datetime
    approval_date: Optional[datetime]

    class Config:
        from_attributes = True


class GreenProjectDetail(GreenProjectResponse):
    owner: Optional[UserResponse] = None


# ============================
# CREDIT HISTORY SCHEMAS
# ============================

class CreditHistoryResponse(BaseModel):
    id: int
    action: str
    from_owner: Optional[str]
    to_owner: Optional[str]
    details: Optional[str]
    timestamp: datetime

    class Config:
        from_attributes = True


# ============================
# CREDIT SCHEMAS
# ============================

class CreateCreditRequest(BaseModel):
    credit_id: str
    owner_email: str


class CreditResponse(BaseModel):
    id: int
    credit_id: str
    status: str
    owner_id: int
    project_id: Optional[int]
    price: Optional[float]
    listed_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True


class CreditDetailResponse(CreditResponse):
    owner: UserResponse
    history: List[CreditHistoryResponse] = []


class TransferRequest(BaseModel):
    credit_id: str
    new_owner_email: str


class UseCreditRequest(BaseModel):
    credit_id: str


class ListCreditRequest(BaseModel):
    credit_id: str
    price: float


class BuyCreditRequest(BaseModel):
    credit_id: str


class PublicVerifyResponse(BaseModel):
    credit_id: str
    status: str
    owner: str
    created_at: datetime
    history: List[CreditHistoryResponse]

    class Config:
        from_attributes = True
