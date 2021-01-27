from typing import Optional
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import jwt

from .. import schemas
from .. import dependencies
from .. import crud
from .. import utils
from ..config import settings

router = APIRouter(
    prefix='/auth',
    tags=['auth'],
)


def authenticate_user(email: str, password: str, db: Session):
    user = crud.get_user_by_email(db, email)
    if not user:
        return False
    if not utils.verify_password(password, user.password):
        return False
    return user


def authenticate_traffic_warden(email: str, password: str, db: Session):
    traffic_warden = crud.get_traffic_warden_by_email(db, email)
    if not traffic_warden:
        return False
    if not utils.verify_password(password, traffic_warden.password):
        return False
    return traffic_warden


<<<<<<< HEAD
def authenticate_admin(email: str, password: str, db: Session):
    admin = crud.get_admin_by_email(db, email)
    if not admin:
        return False
    if not utils.verify_password(password, admin.password):
        return False
    return admin


=======
>>>>>>> ffff7d25f1448e797d7f5cec993cbf0bcf51e352
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.jwt_algorithm)
    return encoded_jwt


<<<<<<< HEAD
@router.post("/login", response_model=schemas.Token)
async def login_for_access_token(
        form_data: OAuth2PasswordRequestForm = Depends(),
        db: Session = Depends(dependencies.get_db)
):
    roles_dict = {
        'user': authenticate_user,
        'traffic_warden': authenticate_traffic_warden,
        'admin': authenticate_admin,
    }

    access_token_expires = timedelta(hours=settings.access_token_expire_hours)
    current_user = None

    for role, authenticate_function in roles_dict.items():
        if role in form_data.scopes:
            current_user = authenticate_function(form_data.username, form_data.password, db)
            break

    if not current_user:
=======
@router.post("/user-login", response_model=schemas.Token)
async def user_login(
        form_data: OAuth2PasswordRequestForm = Depends(),
        db: Session = Depends(dependencies.get_db)
):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Email ou senha inválidos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(hours=settings.access_token_expire_hours)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/traffic-warden-login", response_model=schemas.Token)
async def traffic_warden_login(
        form_data: OAuth2PasswordRequestForm = Depends(),
        db: Session = Depends(dependencies.get_db)
):
    traffic_warden = authenticate_traffic_warden(form_data.username, form_data.password, db)
    if not traffic_warden:
>>>>>>> ffff7d25f1448e797d7f5cec993cbf0bcf51e352
        raise HTTPException(
            status_code=401,
            detail="Email ou senha inválidos",
            headers={"WWW-Authenticate": "Bearer"},
        )
<<<<<<< HEAD

    access_token = create_access_token(
        data={"sub": current_user.email, "scopes": form_data.scopes},
        expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}
=======
    access_token_expires = timedelta(hours=settings.access_token_expire_hours)
    access_token = create_access_token(
        data={"sub": traffic_warden.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
    
>>>>>>> ffff7d25f1448e797d7f5cec993cbf0bcf51e352
