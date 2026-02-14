from sqlalchemy import create_engine, Column, Integer, String, JSON, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "postgresql+psycopg2://carbon_user:StrongPassword123@localhost/carbon_credits"

engine = create_engine(DATABASE_URL, echo=True)  # echo=True helps debug SQL
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class Ledger(Base):
    __tablename__ = "ledger"
    id = Column(Integer, primary_key=True, index=True)
    previous_hash = Column(String(64))
    transaction_data = Column(JSON)
    timestamp = Column(TIMESTAMP(timezone=True), server_default=func.now())
    hash = Column(String(64), unique=True)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    password_hash = Column(String(128), nullable=False)
    role = Column(String(20), nullable=False)

Base.metadata.create_all(bind=engine)
