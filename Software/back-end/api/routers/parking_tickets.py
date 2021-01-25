from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..dependencies import get_db, get_current_user
from .. import schemas
from .. import crud

router = APIRouter(
    prefix='/parking-tickets',
    tags=['parking tickets']
)


CAR_PRICE = 1.5
MOTORCYCLE_PRICE = 0.75


@router.post('/{vehicle_id}', response_model=schemas.ParkingTicket)
async def create_parking_ticket(
        vehicle_id: int,
        parking_ticket: schemas.ParkingTicketCreate,
        db: Session = Depends(get_db),
        user: schemas.User = Depends(get_current_user)
):
    """
    1) Verificar se o usuário possui aquele veículo.
    2) Verificar se o usuário tem saldo suficiente para estacionar aquele tipo de veículo.
    3) Criar o registro do ticket no banco
    4) Atualizar o saldo do usuário
    """
    current_vehicle = None
    if user.vehicles:
        for vehicle in user.vehicles:
            if vehicle.vehicle_id == vehicle_id:
                current_vehicle = vehicle
                break
        else:
            raise HTTPException(status_code=404, detail="O usuário não possui esse veículo")
    else:
        raise HTTPException(status_code=404, detail="O usuário não possui esse veículo")

    price_per_hour = 1.5 if current_vehicle.vehicle_type == 'CARRO' else 0.75
    price = parking_ticket.parking_time * price_per_hour

    if user.balance < price:
        raise HTTPException(status_code=400, detail="Saldo insuficiente")

    new_balance = user.balance - price
    crud.update_user_balance(db, new_balance, user.user_id)

    return crud.create_parking_ticket(db, parking_ticket, price, vehicle_id)



