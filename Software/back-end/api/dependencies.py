from fastapi import Depends, HTTPException
<<<<<<< HEAD
from fastapi.security import OAuth2PasswordBearer, SecurityScopes
=======
from fastapi.security import OAuth2PasswordBearer
>>>>>>> ffff7d25f1448e797d7f5cec993cbf0bcf51e352
from sqlalchemy.orm import Session
from jose import JWTError, jwt


from .database import SessionLocal
<<<<<<< HEAD
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
=======
from .crud import get_user_by_email, get_traffic_warden_by_email
from .config import settings


oauth2_scheme_user = OAuth2PasswordBearer(tokenUrl="/auth/user-login")
oauth2_scheme_traffic_warden = OAuth2PasswordBearer(tokenUrl="/auth/traffic-warden-login")
>>>>>>> ffff7d25f1448e797d7f5cec993cbf0bcf51e352


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_current_user(
<<<<<<< HEAD
        security_scopes: SecurityScopes,
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(get_db)
):
    roles_dict = {
        'user': get_user_by_email,
        'traffic_warden': get_traffic_warden_by_email,
        'admin': get_admin_by_email,
    }

=======
        token: str = Depends(oauth2_scheme_user),        
        db: Session = Depends(get_db)
):
>>>>>>> ffff7d25f1448e797d7f5cec993cbf0bcf51e352
    credentials_exception = HTTPException(
        status_code=401,
        detail="Credenciais não validadas",
        headers={"WWW-Authenticate": "Bearer"},
    )
<<<<<<< HEAD

    if security_scopes.scopes:
        authenticate_value = f'Bearer scope="{security_scopes.scope_str}"'
    else:
        authenticate_value = f"Bearer"

=======
>>>>>>> ffff7d25f1448e797d7f5cec993cbf0bcf51e352
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.jwt_algorithm])
        email = payload.get("sub")
        if email is None:
            raise credentials_exception
<<<<<<< HEAD
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
=======
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
>>>>>>> ffff7d25f1448e797d7f5cec993cbf0bcf51e352

