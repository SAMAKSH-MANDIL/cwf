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
    """Initializes tables in database and applies automatic schema column migrations."""
    Base.metadata.create_all(bind=engine)

    try:
        from sqlalchemy import inspect, text
        inspector = inspect(engine)
        with engine.connect() as conn:
            for table in Base.metadata.sorted_tables:
                if inspector.has_table(table.name):
                    existing_cols = {c["name"] for c in inspector.get_columns(table.name)}
                    for col in table.columns:
                        if col.name not in existing_cols:
                            col_type = col.type.compile(engine.dialect)
                            conn.execute(text(f"ALTER TABLE {table.name} ADD COLUMN {col.name} {col_type}"))
            conn.commit()
    except Exception:
        pass


def get_db():
    """FastAPI dependency for database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
