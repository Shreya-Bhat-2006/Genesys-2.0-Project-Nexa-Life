from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from Backend.schemas import UserCreate, UserResponse, TokenResponse
from Backend.models import User
from Backend.auth import hash_password, verify_password, create_access_token
from Backend.database import get_db

router = APIRouter()


# =========================================
# REGISTER (ONLY COMPANY CAN REGISTER)
# =========================================
@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):

    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # 🔒 FORCE ROLE TO COMPANY
    new_user = User(
        company_name=user.company_name,
        email=user.email,
        password=hash_password(user.password),
        role="company",           # 🚨 HARD-CODED
        approval_status="pending"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# =========================================
# LOGIN
# =========================================
@router.post("/login", response_model=TokenResponse)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(User.email == form_data.username).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": user.email})

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
