from sqlalchemy.orm import Session

from . import models


def get_user_by_email(db: Session, email: str):
    return db.query(models.Usuario).filter(models.Usuario.email == email).first()
