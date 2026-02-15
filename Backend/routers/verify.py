from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from Backend.schemas import PublicVerifyResponse
from Backend.database import get_db

router = APIRouter()


# -------------------------------------------------
# PUBLIC VERIFY CREDIT (No Authentication Needed!)
# -------------------------------------------------
@router.get("/{credit_id}", response_model=PublicVerifyResponse)
def verify_credit_public(
    credit_id: str,
    db: Session = Depends(get_db)
):
    """
    Publicly verify a credit's status and history
    Anyone can call this without authentication
    """
    
    from Backend.models import Credit
    
    credit = db.query(Credit).filter(
        Credit.credit_id == credit_id
    ).first()
    
    if not credit:
        raise HTTPException(status_code=404, detail="Credit not found")
    
    # Return credit info with full history
    return {
        "credit_id": credit.credit_id,
        "status": credit.status,
        "owner": credit.owner.company_name,
        "created_at": credit.created_at,
        "history": credit.history
    }
