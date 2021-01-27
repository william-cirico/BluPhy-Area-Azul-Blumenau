from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, SecurityScopes
from sqlalchemy.orm import Session
from jose import JWTError, jwt


from .database import SessionLocal
from .crud import get_user_by_email, get_traffic_warden_by_email, get_admin_by_email
from .config import settings
from . import schemas


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login",
    scopes={
        "user": "Operações do usuário",
        "traffic_warden": "Operações do guarda de trânsito",
        "admin": "Operações do admin"
    }
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_current_user(
        security_scopes: SecurityScopes,
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(get_db)
):
    roles_dict = {
        'user': get_user_by_email,
        'traffic_warden': get_traffic_warden_by_email,
        'admin': get_admin_by_email,
    }

    credentials_exception = HTTPException(
        status_code=401,
        detail="Credenciais não validadas",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if security_scopes.scopes:
        authenticate_value = f'Bearer scope="{security_scopes.scope_str}"'
    else:
        authenticate_value = f"Bearer"

    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.jwt_algorithm])
        email = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_scopes = payload.get("scopes", [])
        token_data = schemas.TokenData(scopes=token_scopes, email=email)
    except JWTError:
        raise credentials_exception

    current_user = None

    for role, get_function in roles_dict.items():
        if role in token_scopes:
            current_user = get_function(db, email)
            break

    if current_user is None:
        raise credentials_exception

    for scope in security_scopes.scopes:
        if scope not in token_data.scopes:
            raise HTTPException(
                status_code=401,
                detail="Sem permissões suficientes",
                headers={"WWW-Authenticate": authenticate_value}
            )

    return current_user

