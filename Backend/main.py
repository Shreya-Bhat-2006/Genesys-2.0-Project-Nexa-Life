from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from Backend.database import engine, Base
from Backend.routers import users, credits

# -----------------------------------------
# Create DB Tables Automatically
# -----------------------------------------
Base.metadata.create_all(bind=engine)

# -----------------------------------------
# App Initialization
# -----------------------------------------
app = FastAPI(title="Green Carbon Ledger API")

# -----------------------------------------
# CORS (Frontend running on Vite localhost)
# -----------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------
# Include Routers
# -----------------------------------------
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(credits.router, prefix="/credits", tags=["Credits"])

# -----------------------------------------
# Root Endpoint
# -----------------------------------------
@app.get("/")
def root():
    return {"message": "Green Carbon Ledger Backend Running 🚀"}
