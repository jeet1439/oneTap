from sqlalchemy import Column, Integer, String, ForeignKey
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    full_name = Column(String)
    is_active = Column(Integer, default=1)
    avatar_url = Column(String, nullable=True)

