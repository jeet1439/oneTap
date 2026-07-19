from passlib.context import CryptContext

from jose import jwt
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import User
from app.schemas.schemas import RegisterUser, LoginUser, Token

SECRET_KEY = "yjbieubcuei"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password):
    return pwd_context.hash(password)

def verify_password(password ,hashed):
    return pwd_context.verify(password, hashed)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup")
def signup(user: RegisterUser, db: Session = Depends(get_db)):
   
    email_exists = db.query(User).filter(User.email == user.email).first()

    if email_exists:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_password = hash_password(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        password=hashed_password,
        full_name=user.full_name,
        is_active=user.is_active,
        avatar_url=user.avatar_url
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    token = create_access_token({"user_id": db_user.id})

    return {"message": "User registered successfully!", "access_token": token, "token_type": "bearer", "user": db_user}


@router.post("/login")
def Login(user: LoginUser, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        raise HTTPException(
            status_code=400,
            detail="Invalid email or password"
        )

    if not verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token({"user_id": db_user.id})

    return {"message": "Login successful!", "access_token": token, "token_type": "bearer", "user": db_user}