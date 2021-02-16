from random import randint
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib

from fastapi import APIRouter, Body, Depends, HTTPException, Security
from sqlalchemy.orm import Session

from ..config import settings
from .. import crud
from ..dependencies import get_db, get_current_user
from .. import schemas
from ..utils import document_validator

router = APIRouter(
    prefix="/users",
    tags=["users"],
)


@router.post('/', response_model=schemas.User)
async def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if crud.get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="E-mail já foi cadastrado")

    if crud.get_user_by_document(db, user.document):
        raise HTTPException(status_code=400, detail="Documento já foi cadastrado")

    if not document_validator(user.document):
        raise HTTPException(status_code=400, detail="Documento Inválido")

    return crud.create_user(db, user)


@router.get('/balance')
async def get_balance(
        user: schemas.User = Security(get_current_user, scopes=["user"])
):
    return {'balance': user.balance}


@router.get('/', response_model=schemas.User)
async def get_user(
    user: schemas.User = Security(get_current_user, scopes=["user"])
):
    return user;


@router.get('/send-verification-code/{email}')
async def send_verification_code(email: str, db: Session = Depends(get_db)):
    if not crud.get_user_by_email(db, email):
        raise HTTPException(404, detail="E-mail não está cadastrado")

    verification_code = str(randint(1000, 9999))

    requisition = crud.get_password_redefine_requisition(db, email)

    if requisition:
        crud.delete_password_redefine_requisition(db, email)

    crud.create_password_redefine_requisition(db, email, verification_code)

    email_msg = MIMEMultipart()
    email_msg['From'] = settings.admin_email
    email_msg['To'] = email
    email_msg['Subject'] = 'Bluphy - Area Azul | Código de verificação'
    msg = f'Seu código de verificação é: {verification_code}'
    email_msg.attach(MIMEText(msg))

    with smtplib.SMTP(host='smtp.gmail.com', port=587) as server:
        server.ehlo()
        server.starttls()
        server.login(settings.admin_email, settings.admin_email_password)
        server.send_message(email_msg)

    return {"message": 'E-mail enviado'}


@router.post('/check-verification-code/{email}')
async def check_verification_code(
    email: str,
    verification_code: str = Body(..., embed=True),
    db: Session = Depends(get_db)
):
    print(verification_code, email)

    requisition = crud.get_password_redefine_requisition(db, email)
    
    if not requisition:
        raise HTTPException(404, detail="Nenhuma requisição de código de verificação registrada")

    if requisition.verification_code != verification_code:
        raise HTTPException(400, detail="Código de verificação incorreto")
    
    return {'message': 'Código de verificação validado'}


@router.put('/change-password/{email}')
async def change_password(
        email: str,
        body: schemas.ChangePassword,
        db: Session = Depends(get_db)
):
    if not crud.get_user_by_email(db, email):
        raise HTTPException(status_code=404, detail="E-mail não cadastrado")

    requisition = crud.get_password_redefine_requisition(db, email)

    if not requisition:
        raise HTTPException(404, detail="Nenhuma requisição de código de verificação registrada")

    if requisition.verification_code != body.verification_code:
        raise HTTPException(400, detail="Código de verificação incorreto")

    crud.update_user_password(db, email, body.new_password)
    crud.delete_password_redefine_requisition(db, email)

    return {'message': 'Senha alterada com sucesso!'}


@router.put('/', response_model=schemas.User)
async def update_user(
        user: schemas.UserUpdate,
        db: Session = Depends(get_db),
        current_user: schemas.User = Security(get_current_user, scopes=["user"])
):    
    if not document_validator(user.document):
        raise HTTPException(status_code=400, detail="Documento Inválido")

    crud.update_user(db, user, current_user.user_id)    
    return crud.get_user_by_email(db, current_user.email)



