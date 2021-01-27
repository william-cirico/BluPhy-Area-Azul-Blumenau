from fastapi import APIRouter, Depends, HTTPException, Security
from sqlalchemy.orm import Session

from .. import schemas
from .. import crud
from ..dependencies import get_db, get_current_user

router = APIRouter(
    prefix="/traffic-warden",
    tags=["traffic wardens"],
)


@router.post(
    '/',
    response_model=schemas.TrafficWarden,
    dependencies=[Security(get_current_user, scopes=["admin"])]
)
async def create_traffic_warden(
        traffic_warden: schemas.TrafficWardenCreate,
        db: Session = Depends(get_db)
):
    if crud.get_traffic_warden_by_email(db, traffic_warden.email):
        raise HTTPException(status_code=400, detail="E-mail já foi cadastrado")

    return crud.create_traffic_warden(db, traffic_warden)
