from fastapi import FastAPI
from routers import users, credits

app = FastAPI(title="Green Carbon Ledger API")

app.include_router(users.router)
app.include_router(credits.router)
