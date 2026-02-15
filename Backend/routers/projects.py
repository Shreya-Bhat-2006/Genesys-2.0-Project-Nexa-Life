from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from Backend.schemas import GreenProjectCreate, GreenProjectResponse, GreenProjectDetail
from Backend.models import GreenProject, User
from Backend.database import get_db
from Backend.auth import get_current_user

router = APIRouter()


# -------------------------------------------------
# APPLY AS GREEN PROJECT
# -------------------------------------------------
@router.post("/apply", response_model=GreenProjectResponse)
def apply_as_green_project(
    data: GreenProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """User applies as a green project to generate credits"""
    
    # Create green project with all details
    new_project = GreenProject(
        project_name=data.project_name,
        project_type=data.project_type,
        description=data.description,
        location=data.location,
        owner_id=current_user.id,
        company_reg_number=data.company_reg_number,
        estimated_annual_reduction=data.estimated_annual_reduction,
        project_start_date=data.project_start_date,
        project_end_date=data.project_end_date,
        certification_type=data.certification_type,
        budget=data.budget,
        expected_credits_per_year=data.expected_credits_per_year,
        contact_person=data.contact_person,
        contact_email=data.contact_email,
        contact_phone=data.contact_phone,
        status="pending",
        credits_count=data.expected_credits_per_year or 0
    )
    
    # Update user's applied_as field
    current_user.applied_as = "green_project"
    
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    
    return new_project


# -------------------------------------------------
# GET MY PROJECTS (for green project owner)
# -------------------------------------------------
@router.get("/my-projects", response_model=List[GreenProjectDetail])
def get_my_projects(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all projects created by current user"""
    
    projects = db.query(GreenProject).filter(
        GreenProject.owner_id == current_user.id
    ).all()
    
    return projects


# -------------------------------------------------
# GET PROJECT DETAILS
# -------------------------------------------------
@router.get("/{project_id}", response_model=GreenProjectDetail)
def get_project_details(
    project_id: int,
    db: Session = Depends(get_db)
):
    """Get details of a specific green project (Public access)"""
    
    project = db.query(GreenProject).filter(
        GreenProject.id == project_id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return project
