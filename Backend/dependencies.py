from fastapi import Depends, HTTPException
from .auth import get_current_user   # ✅ relative import

def require_role(role: str):
    def role_checker(current_user: dict = Depends(get_current_user)):
        if current_user["role"] != role:
            raise HTTPException(status_code=403, detail="Access denied")
        return current_user
    return role_checker
