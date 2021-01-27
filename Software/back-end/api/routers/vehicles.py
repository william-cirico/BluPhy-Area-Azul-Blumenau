from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import schemas
from ..dependencies import get_db, get_current_user
from .. import crud

router = APIRouter(
    prefix="/vehicles",
    tags=["vehicles"],
)


@router.get('/', response_model=List[schemas.Vehicle])
def get_vehicles(
        user: schemas.User = Depends(get_current_user)
):
    return user.vehicles


@router.post('/', response_model=schemas.Vehicle)
def create_vehicle(
        vehicle: schemas.VehicleCreate,
        db: Session = Depends(get_db),
        user: schemas.User = Depends(get_current_user)
):
    return crud.create_vehicle(db, vehicle, user.user_id)


@router.put('/{vehicle_id}')
def update_vehicle(
        vehicle_id: int,
        vehicle_update: schemas.VehicleUpdate,
        db: Session = Depends(get_db),
        user: schemas.User = Depends(get_current_user)
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
        user: schemas.User = Depends(get_current_user)
):
    if user.vehicles:
        for vehicle in user.vehicles:
            if vehicle.vehicle_id == vehicle_id:
                crud.delete_vehicle(db, vehicle_id)
                return {'message': 'Veículo deletado com sucesso!'}

    raise HTTPException(status_code=404, detail="O usuário não possui esse veículo")




