from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import uuid

from Backend.schemas import GreenProjectDetail
from Backend.models import GreenProject, Credit, User, CreditHistory
from Backend.database import get_db
from Backend.auth import get_current_user
from Backend.dependencies import require_role

router = APIRouter()


# -------------------------------------------------
# GET ALL PENDING PROJECTS (Admin Only)
# -------------------------------------------------
@router.get("/pending-projects", response_model=List[GreenProjectDetail])
def get_pending_projects(
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    """Get all projects waiting for admin approval"""
    
    projects = db.query(GreenProject).filter(
        GreenProject.status == "pending"
    ).all()
    
    return projects


# -------------------------------------------------
# APPROVE PROJECT & GENERATE CREDITS (Admin Only)
# -------------------------------------------------
@router.post("/approve-project/{project_id}")
def approve_project(
    project_id: int,
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    """Admin approves green project and generates credits"""
    
    project = db.query(GreenProject).filter(
        GreenProject.id == project_id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if project.status != "pending":
        raise HTTPException(status_code=400, detail="Project is not pending")
    
    # Update project status
    project.status = "approved"
    project.approval_date = datetime.utcnow()
    project.approved_by = current_user.id
    
    # Generate credits based on credits_count
    for i in range(project.credits_count):
        credit_id = f"CREDIT-{project.id}-{i+1}-{uuid.uuid4().hex[:8].upper()}"
        
        new_credit = Credit(
            credit_id=credit_id,
            owner_id=project.owner_id,
            project_id=project_id,
            status="Available"
        )
        
        # Create history record
        history = CreditHistory(
            action="Created",
            from_owner=project.owner.company_name,
            to_owner=project.owner.company_name
        )
        
        new_credit.history.append(history)
        db.add(new_credit)
    
    # Update user's approval status
    project.owner.approval_status = "approved"
    project.owner.approval_date = datetime.utcnow()
    
    db.commit()
    
    return {
        "status": "success",
        "message": f"Project approved! Generated {project.credits_count} credits.",
        "project_id": project_id
    }


# -------------------------------------------------
# REJECT PROJECT (Admin Only)
# -------------------------------------------------
@router.post("/reject-project/{project_id}")
def reject_project(
    project_id: int,
    reason: str = "Not approved by admin",
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    """Admin rejects green project"""
    
    project = db.query(GreenProject).filter(
        GreenProject.id == project_id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if project.status != "pending":
        raise HTTPException(status_code=400, detail="Project is not pending")
    
    # Update project status
    project.status = "rejected"
    project.approval_date = datetime.utcnow()
    project.approved_by = current_user.id
    
    # Update user's approval status
    project.owner.approval_status = "rejected"
    
    db.commit()
    
    return {
        "status": "rejected",
        "message": f"Project rejected. Reason: {reason}",
        "project_id": project_id
    }
