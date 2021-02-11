from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, SecurityScopes
from sqlalchemy.orm import Session
from jose import JWTError, jwt
import requests


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


ACCESS_TOKEN = 'bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJibHVwaHlzaXN0ZW1hc0BnbWFpbC' \
               '5jb20iLCJzY29wZSI6WyJhbGwiXSwiZXhwIjoxNjEzMDc0NjUyLCJqdGkiOiJ0UWltT2J4SVdEWnpPZ1MzZ' \
               'DlybDItR3c3QVkiLCJjbGllbnRfaWQiOiJ5MzIwMUVvZGRQRVJ5bkZjIn0.VX_evzYeMZ_q2ZO60LUN0Oqj' \
               'lceHas1qvEBhDCCB_9jt_CL2FFWRo_exIdjhG0NwSqZShfnRk-5XVAwyM4OIQ_1mUPTXtsmGMVevEiUz4YW' \
               'c6j0_7RpmQGjxSndpey7L_kyh_HQDj1EEo-kH6DXZAJ_kYntQjM0WIZ9Cm-X5qPkWBiIqjOqFcmX4vBcpm5' \
               'mYcS0tgDHeVsNEocvlNLzFRkCuWu99PH16hg6lKsZ5SlqRhwcrIHfLeFvxImUk0Aq06fnfVFfolxNdGsgcX' \
               'LilhAba3mSvF1huoJyxb0lQlSe0bBMg786RmLqlSHiWlBkDbVkEaiFHaGaXcJdDo7SvUA'


def is_access_token_valid():
    """
    Verifica se o ACCESS_TOKEN ainda é válido.
    """
    headers = {
        'X-Api-Version': '2',
        'X-Resource-Token': settings.x_resource_token,
        'Authorization': ACCESS_TOKEN
    }

    r = requests.get(
        'https://sandbox.boletobancario.com/api-integration/digital-accounts',
        headers=headers
    )

    return r.status_code == 200


def get_access_token():
    """
    Retorna o ACCESS_TOKEN
    """
    global ACCESS_TOKEN

    if ACCESS_TOKEN and is_access_token_valid():
        return ACCESS_TOKEN

    r = requests.post(
        'https://sandbox.boletobancario.com/authorization-server/oauth/token',
        auth=(settings.username_juno, settings.password_juno),
        data={'grant_type': 'client_credentials'}
    )

    ACCESS_TOKEN = r.json()['access_token']

    return f'bearer {ACCESS_TOKEN}'


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
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

