"""
Decentralized Verifiable AI Network - Database Session & Connection Factory
Seamlessly switches between SQLite (for zero-dependency standalone execution)
and PostgreSQL (for production deployments).
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from backend.database.models import Base

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./network_state.db")

# SQLite requires connect_args check_same_thread=False
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db():
    """Initializes tables in database."""
    Base.metadata.create_all(bind=engine)


def get_db():
    """FastAPI dependency for database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
