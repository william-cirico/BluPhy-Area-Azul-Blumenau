from random import randint
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..config import settings
from ..crud import get_user_by_email
from ..dependencies import get_db

router = APIRouter(
    prefix="/users",
    tags=["users"],
)


@router.get('/send-password-verification-code/{email}')
async def recuperar_senha(email: str, db: Session = Depends(get_db)):
    if not get_user_by_email(db, email):
        raise HTTPException(status_code=404, detail="E-mail não cadastrado")

    email_msg = MIMEMultipart()
    email_msg['From'] = settings.admin_email
    email_msg['To'] = email
    email_msg['Subject'] = 'Bluphy - Area Azul | Código de verificação'

    verification_code = randint(10000, 99999)

    msg = f'Seu código de verificação é: {verification_code}'
    email_msg.attach(MIMEText(msg))

    with smtplib.SMTP(host='smtp.gmail.com', port=587) as server:
        server.ehlo()
        server.starttls()
        server.login(settings.admin_email, settings.admin_email_password)
        server.send_message(email_msg)

    return {"verification_code": verification_code}
