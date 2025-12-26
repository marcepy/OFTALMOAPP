from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_db
from app.core.security import verify_password, create_access_token, create_refresh_token, decode_token, is_token_type
from app.schemas.auth import LoginRequest, TokenPair
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=TokenPair)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not user.is_active or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return TokenPair(
        access_token=create_access_token(user.email),
        refresh_token=create_refresh_token(user.email),
    )

@router.post("/refresh", response_model=TokenPair)
def refresh(refresh_token: str, db: Session = Depends(get_db)):
    try:
        payload = decode_token(refresh_token)
        if not is_token_type(payload, "refresh"):
            raise HTTPException(status_code=401, detail="Invalid token type")
        email = payload.get("sub")
        user = db.query(User).filter(User.email == email).first()
        if not user or not user.is_active:
            raise HTTPException(status_code=401, detail="Invalid user")
        return TokenPair(
            access_token=create_access_token(user.email),
            refresh_token=create_refresh_token(user.email),
        )
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
