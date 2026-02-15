from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import uuid
import hashlib

from Backend.schemas import GreenProjectDetail
from Backend.models import GreenProject, Credit, User, CreditHistory
from Backend.database import get_db
from Backend.dependencies import require_role

router = APIRouter()


# =====================================================
# Helper Function: Generate Blockchain Hash
# =====================================================
def generate_hash(data: str):
    return hashlib.sha256(data.encode()).hexdigest()


# =====================================================
# GET ALL PENDING PROJECTS (Admin Only)
# =====================================================
@router.get("/pending-projects", response_model=List[GreenProjectDetail])
def get_pending_projects(
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    projects = db.query(GreenProject).filter(
        GreenProject.status == "pending"
    ).all()

    return projects


# =====================================================
# APPROVE PROJECT & GENERATE CREDITS (Admin Only)
# =====================================================
@router.post("/approve-project/{project_id}")
def approve_project(
    project_id: int,
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):

    project = db.query(GreenProject).filter(
        GreenProject.id == project_id
    ).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if project.status != "pending":
        raise HTTPException(status_code=400, detail="Project is not pending")

    # -------------------------------------------------
    # Fetch Owner
    # -------------------------------------------------
    owner = db.query(User).filter(User.id == project.owner_id).first()

    if not owner:
        raise HTTPException(status_code=404, detail="Project owner not found")

    # -------------------------------------------------
    # Update Project Status
    # -------------------------------------------------
    project.status = "approved"
    project.approval_date = datetime.utcnow()
    project.approved_by = current_user.id

    # -------------------------------------------------
    # Decide How Many Credits To Generate
    # -------------------------------------------------
    credits_to_generate = (
        project.expected_credits_per_year
        if project.expected_credits_per_year and project.expected_credits_per_year > 0
        else 10   # fallback default
    )

    generated_count = 0

    # -------------------------------------------------
    # Generate Credits
    # -------------------------------------------------
    for i in range(credits_to_generate):

        credit_id = f"CREDIT-{project.id}-{i+1}-{uuid.uuid4().hex[:8].upper()}"

        new_credit = Credit(
            credit_id=credit_id,
            owner_id=owner.id,
            project_id=project.id,
            status="Available"
        )

        db.add(new_credit)
        db.flush()  # get new_credit.id before commit

        # -------------------------------------------------
        # Blockchain Hash Linking
        # -------------------------------------------------
        last_history = db.query(CreditHistory).order_by(
            CreditHistory.id.desc()
        ).first()

        previous_hash = last_history.current_hash if last_history else "GENESIS"

        data_to_hash = f"{new_credit.id}-{owner.company_name}-{datetime.utcnow()}-{previous_hash}"

        current_hash = generate_hash(data_to_hash)

        history = CreditHistory(
            credit_id=new_credit.id,
            action="Created",
            from_owner=owner.company_name,
            to_owner=owner.company_name,
            details="Credit generated on project approval",
            timestamp=datetime.utcnow(),
            previous_hash=previous_hash,
            current_hash=current_hash
        )

        db.add(history)

        generated_count += 1

    # -------------------------------------------------
    # Update User Approval Status
    # -------------------------------------------------
    owner.approval_status = "approved"
    owner.approval_date = datetime.utcnow()

    db.commit()

    return {
        "status": "success",
        "message": f"Project approved! Generated {generated_count} credits.",
        "project_id": project_id
    }


# =====================================================
# REJECT PROJECT (Admin Only)
# =====================================================
@router.post("/reject-project/{project_id}")
def reject_project(
    project_id: int,
    reason: str = "Not approved by admin",
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):

    project = db.query(GreenProject).filter(
        GreenProject.id == project_id
    ).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if project.status != "pending":
        raise HTTPException(status_code=400, detail="Project is not pending")

    owner = db.query(User).filter(User.id == project.owner_id).first()

    project.status = "rejected"
    project.approval_date = datetime.utcnow()
    project.approved_by = current_user.id

    if owner:
        owner.approval_status = "rejected"

    db.commit()

    return {
        "status": "rejected",
        "message": f"Project rejected. Reason: {reason}",
        "project_id": project_id
    }
