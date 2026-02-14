from fastapi import Depends, HTTPException
from Backend.auth import get_current_user   # use absolute import

def require_role(role: str):
    def role_checker(current_user = Depends(get_current_user)):
        if current_user.role != role:   # ✅ FIXED HERE
            raise HTTPException(status_code=403, detail="Access denied")
        return current_user
    return role_checker
