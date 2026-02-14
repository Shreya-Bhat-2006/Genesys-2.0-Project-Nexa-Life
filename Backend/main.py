from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users, credits

app = FastAPI(title="Green Carbon Ledger API")

# CORS (so frontend at localhost:5173 can connect)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(users.router)
app.include_router(credits.router)


@app.get("/")
def home():
    return {"message": "Green Carbon Ledger Backend Running"}
