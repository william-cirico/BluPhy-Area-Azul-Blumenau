from typing import List
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Security
from sqlalchemy.orm import Session

from .. import schemas
from ..dependencies import get_db, get_current_user
from .. import crud

router = APIRouter(
    prefix="/vehicles",
    tags=["vehicles"],
)


@router.get(
    '/parking-time/{vehicle_id}',
    dependencies=[Security(get_current_user, scopes=["user"])]
)
def get_parking_time(
    vehicle_id: int,
    db: Session = Depends(get_db)
):
    vehicle: schemas.Vehicle = crud.get_vehicle_by_id(db, vehicle_id)

    if not vehicle:
        raise HTTPException(status_code=404, detail="Veículo não está cadastrado!")

    if not vehicle.is_parked:
        raise HTTPException(status_code=400, detail="Veículo não está estacionado!")

    parking_ticket: schemas.ParkingTicket = crud.get_last_parked_ticket_from_vehicle(db, vehicle.vehicle_id)
    converted_time = datetime.fromtimestamp(parking_ticket.end_time.timestamp(), tz=timezone.utc)

    return {'end_time': converted_time}


@router.get(
    '/{license_plate}',    
    tags=["traffic wardens"],
    dependencies=[Security(get_current_user, scopes=["traffic_warden"])]
)
def get_parked_vehicle_by_license_plate(
    license_plate: str,
    db: Session = Depends(get_db)
):
    vehicle: schemas.Vehicle = crud.get_parked_vehicle_by_license_plate(db, license_plate)

    if not vehicle:
        raise HTTPException(status_code=404, detail="Veículo não está estacionado!")

    parking_ticket = crud.get_last_parked_ticket_from_vehicle(db, vehicle.vehicle_id)

    converted_time = datetime.fromtimestamp(parking_ticket.end_time.timestamp(), tz=timezone.utc)

    return {'license_plate': vehicle.license_plate, 'model': vehicle.model, 'vehicle_type': vehicle.vehicle_type, 'end_time': converted_time}


@router.get('/', response_model=List[schemas.Vehicle])
def get_vehicles(
    user: schemas.User = Security(get_current_user, scopes=["user"]),
    db: Session = Depends(get_db)
):
    if not user.vehicles:
        raise HTTPException(status_code=404, detail="Usuário não possui veículos cadastrados.")

    return crud.get_vehicles_by_user_id(db, user.user_id)


@router.post('/', response_model=schemas.Vehicle)
def create_vehicle(
    vehicle_create: schemas.VehicleCreate,
    db: Session = Depends(get_db),
    user: schemas.User = Security(get_current_user, scopes=["user"])
):
    is_active = True

    if user.vehicles:
        for vehicle in user.vehicles:
            if vehicle.license_plate == vehicle_create.license_plate:
                raise HTTPException(400, detail="Você já possui um veículo com essa placa")
            if vehicle.is_parked:
                is_active = False

    return crud.create_vehicle(db, vehicle_create, is_active, user.user_id)


@router.put('/{vehicle_id}', response_model=schemas.Vehicle)
def update_vehicle(
    vehicle_id: int,
    vehicle_update: schemas.VehicleUpdate,
    db: Session = Depends(get_db),
    user: schemas.User = Security(get_current_user, scopes=["user"])
):
    if user.vehicles:
        for vehicle in user.vehicles:
            if vehicle.vehicle_id == vehicle_id:
                crud.update_vehicle(db, vehicle_update, vehicle_id)
                return crud.get_vehicle_by_id(db, vehicle_id)
    raise HTTPException(status_code=404, detail="O usuário não possui esse veículo")


@router.delete('/{vehicle_id}')
def delete_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    user: schemas.User = Security(get_current_user, scopes=["user"])
):
    if user.vehicles:
        for vehicle in user.vehicles:
            if vehicle.vehicle_id == vehicle_id:
                crud.delete_vehicle(db, vehicle_id)
                return {'message': 'Veículo deletado com sucesso!'}

    raise HTTPException(status_code=404, detail="O usuário não possui esse veículo")




