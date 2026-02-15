from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from Backend.database import engine, Base
from Backend.routers import users, credits, projects, admin, marketplace, verify

# -----------------------------------------
# Create DB Tables Automatically
# -----------------------------------------
# Drop all tables and recreate (for dev/testing)
Base.metadata.drop_all(bind=engine)
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
    allow_origins=["http://localhost:5173", "http://localhost:5174"],  # Allow both common dev ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------
# Include Routers
# -----------------------------------------
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(credits.router, prefix="/credits", tags=["Credits"])
app.include_router(projects.router, prefix="/projects", tags=["Green Projects"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(marketplace.router, prefix="/marketplace", tags=["Marketplace"])
app.include_router(verify.router, prefix="/verify", tags=["Public Verify"])

# -----------------------------------------
# Root Endpoint
# -----------------------------------------
@app.get("/")
def root():
    return {"message": "Green Carbon Ledger Backend Running 🚀"}
