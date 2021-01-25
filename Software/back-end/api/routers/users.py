from random import randint
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..config import settings
from .. import crud
from ..dependencies import get_db, get_current_user
from .. import schemas
from ..utils import get_password_hash

router = APIRouter(
    prefix="/users",
    tags=["users"],
)


@router.post('/', response_model=schemas.User)
async def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if crud.get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="E-mail já foi cadastrado")

    if crud.get_user_by_cpf(db, user.document_number):
        raise HTTPException(status_code=400, detail="CPF/CNPJ já foi cadastrado")

    return crud.create_user(db, user)


@router.get('/balance')
async def get_balance(
        user: schemas.User = Depends(get_current_user)
):
    return {'balance': user.balance}


@router.get('/send-verification-code/{email}')
async def send_verification_code(email: str, db: Session = Depends(get_db)):
    if not crud.get_user_by_email(db, email):
        raise HTTPException(status_code=404, detail="E-mail não cadastrado")

    email_msg = MIMEMultipart()
    email_msg['From'] = settings.admin_email
    email_msg['To'] = email
    email_msg['Subject'] = 'Bluphy - Area Azul | Código de verificação'

    verification_code = str(randint(1000, 9999))

    msg = f'Seu código de verificação é: {verification_code}'
    email_msg.attach(MIMEText(msg))

    with smtplib.SMTP(host='smtp.gmail.com', port=587) as server:
        server.ehlo()
        server.starttls()
        server.login(settings.admin_email, settings.admin_email_password)
        server.send_message(email_msg)

    return {"verification_code": verification_code}


@router.put('/change-password/{email}')
async def change_password(email: str, body: schemas.ChangePassword, db: Session = Depends(get_db)):
    if not crud.get_user_by_email(db, email):
        raise HTTPException(status_code=404, detail="E-mail não cadastrado")

    new_password_hashed = get_password_hash(body.new_password)
    crud.update_user_password(db, email, new_password_hashed)

    return {'message': 'Senha alterada com sucesso!'}


@router.put('/', response_model=schemas.User)
async def update_user(
        user: schemas.UserUpdate,
        db: Session = Depends(get_db),
        current_user: schemas.User = Depends(get_current_user)
):
    crud.update_user(db, user, current_user.user_id)
    return crud.get_user_by_email(db, current_user.email)



