"""
Rota de autenticação.
"""

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
    """
    Verifica se o usuário e a senha são válidos através do seu e-mail.

    Args:
        email: Email do usuário.
        password: Senha do usuário (Limpa).
        db: Sessão do BD.
    Returns:
        O registro do usuário.
    """
    user = crud.get_user_by_email(db, email)
    if not user:
        return False
    if not utils.verify_password(password, user.password):
        return False
    return user


def authenticate_traffic_warden(email: str, password: str, db: Session):
    """
    Verifica se o guarda de trânsito e a senha são válidos através do seu e-mail.

    Args:
        email: Email do guarda de trânsito.
        password: Senha do guarda de trânsito (Limpa).
        db: Sessão do BD.
    Returns:
        O registro do guarda de trânsito.
    """
    traffic_warden = crud.get_traffic_warden_by_email(db, email)
    if not traffic_warden:
        return False
    if not utils.verify_password(password, traffic_warden.password):
        return False
    return traffic_warden


def authenticate_admin(email: str, password: str, db: Session):
    """
    Verifica se o admin e a senha são válidos através do seu e-mail.

    Args:
        email: Email do admin.
        password: Senha do admin (Limpa).
        db: Sessão do BD.
    Returns:
        O registro do admin.
    """
    admin = crud.get_admin_by_email(db, email)
    if not admin:
        return False
    if not utils.verify_password(password, admin.password):
        return False
    return admin


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Cria o access_token (Token JWT de autenticação).

    Args:
        data: Dados do token.
        expires_delta: Tempo de expiração do token.
    Returns:
        Retorna o Token JWT.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.jwt_algorithm)
    return encoded_jwt


@router.post(
    "/login",
    response_model=schemas.Token,
    summary='Login'
)
async def login_for_access_token(
        form_data: OAuth2PasswordRequestForm = Depends(),
        db: Session = Depends(dependencies.get_db)
):
    """
    Endpoint de Login.

    Retorna o Token de acesso.
    """
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
        raise HTTPException(
            status_code=401,
            detail="Email ou senha inválidos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        data={"sub": current_user.email, "scopes": form_data.scopes},
        expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}
