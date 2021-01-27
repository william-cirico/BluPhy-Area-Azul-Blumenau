from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt


from .database import SessionLocal
from .crud import get_user_by_email, get_traffic_warden_by_email
from .config import settings


oauth2_scheme_user = OAuth2PasswordBearer(tokenUrl="/auth/user-login")
oauth2_scheme_traffic_warden = OAuth2PasswordBearer(tokenUrl="/auth/traffic-warden-login")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_current_user(
        token: str = Depends(oauth2_scheme_user),        
        db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Credenciais não validadas",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.jwt_algorithm])
        email = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_user_by_email(db, email)
    if user is None:
        raise credentials_exception
    return user


async def get_current_traffic_warden(
        token: str = Depends(oauth2_scheme_traffic_warden),        
        db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Credenciais não validadas",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.jwt_algorithm])
        email = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_traffic_warden_by_email(db, email)
    if user is None:
        raise credentials_exception
    return user

