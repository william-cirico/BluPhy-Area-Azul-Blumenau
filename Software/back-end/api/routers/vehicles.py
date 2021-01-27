from typing import List
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
    '/{license_plate}',
    response_model=schemas.ParkingInformation,
    tags=["traffic wardens"],
    dependencies=[Security(get_current_user, scopes=["traffic_warden"])]
)
def get_parked_vehicle_by_license_plate(
    license_plate: str,
    db: Session = Depends(get_db)
):
    vehicle: schemas.Vehicle = crud.get_vehicle_by_license_plate(db, license_plate)

    if not vehicle:
        raise HTTPException(status_code=404, detail="Veículo não está cadastrado!")

    if not vehicle.is_parked:
        raise HTTPException(status_code=400, detail="Veículo não está estacionado!")

    parking_ticket = crud.get_last_parked_ticket_from_vehicle(db, vehicle.vehicle_id)

    parking_information = schemas.ParkingInformation(parking_ticket=parking_ticket, vehicle=vehicle)

    return parking_information


@router.get('/', response_model=List[schemas.Vehicle])
def get_vehicles(
    user: schemas.User = Security(get_current_user, scopes=["user"])
):
    return user.vehicles


@router.post('/', response_model=schemas.Vehicle)
def create_vehicle(
    vehicle: schemas.VehicleCreate,
    db: Session = Depends(get_db),
    user: schemas.User = Security(get_current_user, scopes=["user"])
):
    return crud.create_vehicle(db, vehicle, user.user_id)


@router.put('/{vehicle_id}')
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
                return {'message': 'Veículo atualizado com sucesso!'}
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




