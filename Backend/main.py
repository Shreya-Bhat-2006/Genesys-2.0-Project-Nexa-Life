from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Green Carbon Ledger Backend Running"}
