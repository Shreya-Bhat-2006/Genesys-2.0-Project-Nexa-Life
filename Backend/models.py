from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from Backend.database import Base


# ==========================================================
# USER TABLE
# ==========================================================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, default="company")
    applied_as = Column(String, nullable=True)
    approval_status = Column(String, default="pending")
    approval_date = Column(DateTime, nullable=True)
    approved_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    # Relationships
    credits = relationship("Credit", back_populates="owner")


# ==========================================================
# GREEN PROJECT TABLE
# ==========================================================
class GreenProject(Base):
    __tablename__ = "green_projects"

    id = Column(Integer, primary_key=True, index=True)
    project_name = Column(String, nullable=False)
    project_type = Column(String, nullable=True)
    description = Column(String, nullable=True)
    location = Column(String, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    company_reg_number = Column(String, nullable=True)
    estimated_annual_reduction = Column(Float, nullable=True)
    project_start_date = Column(DateTime, nullable=True)
    project_end_date = Column(DateTime, nullable=True)
    certification_type = Column(String, nullable=True)
    budget = Column(Float, nullable=True)
    expected_credits_per_year = Column(Integer, nullable=True)
    contact_person = Column(String, nullable=True)
    contact_email = Column(String, nullable=True)
    contact_phone = Column(String, nullable=True)
    status = Column(String, default="pending")
    rejection_reason = Column(String, nullable=True)
    credits_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    approval_date = Column(DateTime, nullable=True)
    approved_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    # Relationships
    credits = relationship("Credit", back_populates="project")


# ==========================================================
# CREDIT TABLE
# ==========================================================
class Credit(Base):
    __tablename__ = "credits"

    id = Column(Integer, primary_key=True, index=True)
    credit_id = Column(String, unique=True, index=True, nullable=False)
    status = Column(String, default="Active")

    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    project_id = Column(Integer, ForeignKey("green_projects.id"), nullable=True)

    price = Column(Float, nullable=True)
    listed_at = Column(DateTime, nullable=True)
    sold_to = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    owner = relationship("User", back_populates="credits")
    project = relationship("GreenProject", back_populates="credits")
    history = relationship(
        "CreditHistory",
        back_populates="credit",
        cascade="all, delete-orphan",
        order_by="CreditHistory.id"
    )


# ==========================================================
# CREDIT HISTORY (BLOCKCHAIN LEDGER TABLE)
# ==========================================================
class CreditHistory(Base):
    __tablename__ = "credit_history"

    id = Column(Integer, primary_key=True, index=True)

    credit_id = Column(Integer, ForeignKey("credits.id"), nullable=False)

    action = Column(String, nullable=False)  # Created / Transferred / Used
    from_owner = Column(String, nullable=True)
    to_owner = Column(String, nullable=True)
    details = Column(String, nullable=True)

    timestamp = Column(DateTime, default=datetime.utcnow)

    # 🔐 Blockchain Fields
    previous_hash = Column(String, nullable=False)
    current_hash = Column(String, nullable=False)

    # Relationship
    credit = relationship("Credit", back_populates="history")
