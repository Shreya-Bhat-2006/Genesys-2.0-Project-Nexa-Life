from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from schemas import UserCreate, UserResponse, TokenResponse
from models import users
from auth import hash_password, verify_password, create_access_token

router = APIRouter()


@router.post("/register", response_model=UserResponse)
def register(user: UserCreate):

    for u in users:
        if u["email"] == user.email:
            raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(user.password)

    new_user = {
        "company_name": user.company_name,
        "email": user.email,
        "password": hashed_password,
        "role": user.role
    }

    users.append(new_user)

    return {
        "company_name": user.company_name,
        "email": user.email,
        "role": user.role
    }


@router.post("/login", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends()):

    for user in users:
        if user["email"] == form_data.username and verify_password(form_data.password, user["password"]):

            access_token = create_access_token(data={"sub": user["email"]})

            return {
                "access_token": access_token,
                "token_type": "bearer"
            }

    raise HTTPException(status_code=401, detail="Invalid credentials")
