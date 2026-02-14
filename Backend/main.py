from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, Field
from datetime import datetime, timedelta
from typing import List, Optional
from jose import JWTError, jwt
from passlib.context import CryptContext

app = FastAPI(title="Green Carbon Ledger API")

# ======================
# SECURITY CONFIG
# ======================

SECRET_KEY = "supersecretkey123"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# ======================
# TEMP STORAGE (Replace with DB later)
# ======================

users = []
credits = []

# ======================
# MODELS
# ======================

# -------- USER MODELS --------

class UserCreate(BaseModel):
    company_name: str
    email: str
    password: str
    role: str  # "admin" or "company"


class UserResponse(BaseModel):
    company_name: str
    email: str
    role: str


# -------- AUTH MODELS --------

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


# ======================
# PASSWORD FUNCTIONS
# ======================

def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


# ======================
# JWT FUNCTIONS
# ======================

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(token: str = Depends(oauth2_scheme)):

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")

        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    for user in users:
        if user["email"] == email:
            return user

    raise HTTPException(status_code=404, detail="User not found")


# ======================
# RBAC DEPENDENCY
# ======================

def require_role(role: str):
    def role_checker(current_user: dict = Depends(get_current_user)):
        if current_user["role"] != role:
            raise HTTPException(status_code=403, detail="Access denied")
        return current_user
    return role_checker


# ======================
# ROUTES
# ======================

@app.get("/")
def home():
    return {"message": "Green Carbon Ledger Backend Running 🚀"}


# ----------------------
# REGISTER
# ----------------------
@app.post("/register", response_model=UserResponse)
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


# ----------------------
# LOGIN
# ----------------------
@app.post("/login", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends()):

    for user in users:
        if user["email"] == form_data.username and verify_password(form_data.password, user["password"]):

            access_token = create_access_token(data={"sub": user["email"]})

            return {
                "access_token": access_token,
                "token_type": "bearer"
            }

    raise HTTPException(status_code=401, detail="Invalid credentials")


# ----------------------
# CREATE CREDIT (Admin Only)
# ----------------------
@app.post("/create-credit", response_model=CreditResponse)
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


# ----------------------
# GET ALL CREDITS (Protected)
# ----------------------
@app.get("/credits", response_model=List[CreditResponse])
def get_credits(current_user: dict = Depends(get_current_user)):
    return credits


# ----------------------
# MARKETPLACE (Active Credits Only)
# ----------------------
@app.get("/marketplace", response_model=List[CreditResponse])
def marketplace():
    return [credit for credit in credits if credit.status == "Active"]


# ----------------------
# PUBLIC VERIFY
# ----------------------
@app.get("/verify/{credit_id}", response_model=CreditResponse)
def verify_credit(credit_id: str):

    for credit in credits:
        if credit.credit_id == credit_id:
            return credit

    raise HTTPException(status_code=404, detail="Credit not found")


# ----------------------
# TRANSFER CREDIT (Owner Only)
# ----------------------
@app.post("/transfer-credit", response_model=CreditResponse)
def transfer_credit(
    data: TransferRequest,
    current_user: dict = Depends(get_current_user)
):

    for credit in credits:

        if credit.credit_id == data.credit_id:

            if credit.status == "Used":
                raise HTTPException(status_code=400, detail="Cannot transfer used credit")

            if credit.owner_email != current_user["email"]:
                raise HTTPException(status_code=403, detail="Only owner can transfer")

            credit.history.append(
                HistoryEntry(
                    action="Transferred",
                    from_owner=credit.owner_email,
                    to_owner=data.new_owner_email,
                    timestamp=str(datetime.utcnow())
                )
            )

            credit.owner_email = data.new_owner_email

            return credit

    raise HTTPException(status_code=404, detail="Credit not found")


# ----------------------
# USE CREDIT (Owner Only)
# ----------------------
@app.post("/use-credit", response_model=CreditResponse)
def use_credit(
    data: UseCreditRequest,
    current_user: dict = Depends(get_current_user)
):

    for credit in credits:

        if credit.credit_id == data.credit_id:

            if credit.status == "Used":
                raise HTTPException(status_code=400, detail="Already used")

            if credit.owner_email != current_user["email"]:
                raise HTTPException(status_code=403, detail="Only owner can use")

            credit.history.append(
                HistoryEntry(
                    action="Used",
                    from_owner=credit.owner_email,
                    timestamp=str(datetime.utcnow())
                )
            )

            credit.status = "Used"

            return credit

    raise HTTPException(status_code=404, detail="Credit not found")
