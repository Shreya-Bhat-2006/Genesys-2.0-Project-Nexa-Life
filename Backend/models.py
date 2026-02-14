from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from Backend.database import Base




class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    password = Column(String, nullable=False)
    role = Column(String, default="company")

    credits = relationship("Credit", back_populates="owner")


class Credit(Base):
    __tablename__ = "credits"

    id = Column(Integer, primary_key=True, index=True)
    credit_id = Column(String, unique=True, index=True)
    status = Column(String, default="Active")

    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="credits")

    created_at = Column(DateTime, default=datetime.utcnow)
