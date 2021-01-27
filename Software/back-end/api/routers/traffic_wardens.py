<<<<<<< HEAD
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
=======
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..dependencies import get_db, get_current_traffic_warden
from .. import schemas
from .. import crud

router = APIRouter(
    prefix='/traffic-warden',
    tags=['traffic wardens']
)


@router.post('/', response_model=schemas.TrafficWarden)
async def create_traffic_warden(
    traffic_warden: schemas.TrafficWardenCreate,
    db: Session = Depends(get_db)
>>>>>>> ffff7d25f1448e797d7f5cec993cbf0bcf51e352
):
    if crud.get_traffic_warden_by_email(db, traffic_warden.email):
        raise HTTPException(status_code=400, detail="E-mail já foi cadastrado")

    return crud.create_traffic_warden(db, traffic_warden)
<<<<<<< HEAD
=======


@router.get(
    '/license-plate-consult/{license_plate}', 
    dependencies=[Depends(get_current_traffic_warden)],
    response_model=schemas.Vehicle
)
async def license_plate_consult(
    license_plate: str,
    db: Session = Depends(get_db),    
):
    vehicle = crud.get_vehicle_by_license_plate(license_plate, db)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Veículo não cadastrado")
    if not vehicle.is_parked:
        raise HTTPException(status_code=400, detail="Veículo não possui um ticket de estacionamento")

    return vehicle
>>>>>>> ffff7d25f1448e797d7f5cec993cbf0bcf51e352
