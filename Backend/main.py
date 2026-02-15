from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from Backend.database import engine, Base
from Backend.routers import users, credits, projects, admin, marketplace, verify


# =====================================================
# CREATE FASTAPI APP
# =====================================================
app = FastAPI(
    title="Green Carbon Ledger API",
    version="1.0.0",
    description="Carbon Credit Registry with Blockchain-style Ledger"
)


# =====================================================
# DATABASE INITIALIZATION
# =====================================================
# Create tables ONLY if they do not exist
# (SAFE – does NOT delete data)
Base.metadata.create_all(bind=engine)


# =====================================================
# CORS CONFIGURATION
# =====================================================
# Allow frontend (Vite dev server)
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================================
# ROUTERS
# =====================================================
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(credits.router, prefix="/credits", tags=["Credits"])
app.include_router(projects.router, prefix="/projects", tags=["Green Projects"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(marketplace.router, prefix="/marketplace", tags=["Marketplace"])
app.include_router(verify.router, prefix="/verify", tags=["Public Verify"])


# =====================================================
# ROOT ENDPOINT
# =====================================================
@app.get("/")
def root():
    return {
        "status": "success",
        "message": "Green Carbon Ledger Backend Running 🚀",
        "version": "1.0.0"
    }
