from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)

def create_token(sub: str, token_type: str, expires_delta: timedelta) -> str:
    now = datetime.utcnow()
    payload = {
        "sub": sub,
        "type": token_type,
        "iat": int(now.timestamp()),
        "exp": int((now + expires_delta).timestamp()),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALG)

def decode_token(token: str) -> dict:
    return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALG])

def create_access_token(sub: str) -> str:
    return create_token(sub, "access", timedelta(minutes=settings.ACCESS_TOKEN_MINUTES))

def create_refresh_token(sub: str) -> str:
    return create_token(sub, "refresh", timedelta(days=settings.REFRESH_TOKEN_DAYS))

def is_token_type(payload: dict, expected: str) -> bool:
    return payload.get("type") == expected
