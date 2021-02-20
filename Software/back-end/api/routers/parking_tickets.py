"""
Rotas de Tickets de Estacionamento.
"""

from typing import List
from datetime import datetime
import asyncio

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Response, Security
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


async def change_vehicle_state(
        user_id: int,
        vehicle_id: int,
        sleep_time: int,
        db: Session
) -> None:
    """
    Background Task para mudar o estado do veículo depois que o tempo do ticket expira.

    Args:
        user_id: ID do usuário.
        vehicle_id: ID do veículo.
        sleep_time: Tempo de espera para a função rodar.
        db: Sessão do BD.
    """
    # Tempo de espera para executar a função
    await asyncio.sleep(sleep_time)

    # Obtendo o veículo novamente para evitar erros em caso de exclusão
    vehicle: schemas.Vehicle = crud.get_vehicle_by_id(db, vehicle_id)

    if vehicle:
        parking_ticket = crud.get_last_parking_ticket_from_vehicle(db, vehicle_id)

        if vehicle.is_parked and parking_ticket.end_time < datetime.now():
            crud.update_is_parked_vehicle(db, vehicle_id, False)

            # Atualizando o estado dos demais veículos
            vehicles: List[schemas.Vehicle] = crud.get_vehicles_by_user_id(db, user_id)
            for v in vehicles:
                crud.update_is_active_vehicle(db, v.vehicle_id, True)


@router.post(
    '/{vehicle_id}',
    response_model=schemas.ParkingTicket,
    summary='Cria um ticket de estacionamento'
)
async def create_parking_ticket(
        vehicle_id: int,
        parking_ticket: schemas.ParkingTicketCreate,
        background_tasks: BackgroundTasks,
        db: Session = Depends(get_db),
        user: schemas.User = Security(get_current_user, scopes=["user"])
):
    """
    Cria um ticket de estacionamento para o veículo informado.
    """
    global CAR_PRICE, MOTORCYCLE_PRICE

    vehicle: schemas.Vehicle = crud.get_vehicle_by_id(db, vehicle_id)

    # Validações
    if not vehicle:
        raise HTTPException(status_code=404, detail="Veículo não está cadastrado")

    if vehicle.user_id != user.user_id:
        raise HTTPException(status_code=404, detail="O usuário não possui esse veículo")

    # Verifica se o veículo com aquela placa já está estacionado
    is_parked = crud.get_parked_vehicle_by_license_plate(db, vehicle.license_plate)

    if is_parked:
        raise HTTPException(status_code=400, detail="Esse veículo já está estacionado")

    for v in user.vehicles:
        if v.is_parked:
            raise HTTPException(
                status_code=400,
                detail="Esse usuário já possui um veículo estacionado"
            )

    # Calculando o preço do ticket
    price_per_hour = CAR_PRICE if vehicle.vehicle_type == 'CARRO' else MOTORCYCLE_PRICE
    price = parking_ticket.parking_time * price_per_hour

    # Validando se o usuário possui saldo suficiente
    if user.balance < price:
        raise HTTPException(status_code=400, detail="Saldo insuficiente")

    # Atualizando o saldo do usuário
    new_balance = user.balance - price
    crud.update_user_balance(db, new_balance, user.user_id)

    # Atualizando o estado dos veículos
    crud.update_is_parked_vehicle(db, vehicle_id, True)
    for v in user.vehicles:
        if v.vehicle_id != vehicle_id:
            crud.update_is_active_vehicle(db, v.vehicle_id, False)

    # Criando uma background task para atualizar o estado do veículo após o tempo expirar    
    sleep_time = 3600 * parking_ticket.parking_time
    background_tasks.add_task(change_vehicle_state, user.user_id, vehicle_id, sleep_time, db)

    return crud.create_parking_ticket(db, parking_ticket, price, vehicle_id)


@router.delete(
    '/{vehicle_id}',
    status_code=204,
    summary='Cancelar ticket de estacionamento'
)
async def cancel_parking_ticket(
        vehicle_id: int,
        db: Session = Depends(get_db),
        user: schemas.User = Security(get_current_user, scopes=["user"])
):
    """
    Cancela o ticket de estacionamento do veículo informado.
    """
    vehicle = crud.get_vehicle_by_id(db, vehicle_id)

    if not vehicle:
        raise HTTPException(status_code=404, detail="Veículo não está cadastrado")

    if vehicle.user_id != user.user_id:
        raise HTTPException(status_code=404, detail="O usuário não possui esse veículo")

    # Atualizando o estado do veículo
    crud.update_is_parked_vehicle(db, vehicle_id, False)

    # Atualizando o estado dos outros veículos que o usuário possui
    vehicles: List[schemas.Vehicle] = crud.get_vehicles_by_user_id(db, user.user_id)
    for v in vehicles:
        crud.update_is_active_vehicle(db, v.vehicle_id, True)

    # Atualizando o ticket de estacionamento
    last_parked_ticket = crud.get_last_parking_ticket_from_vehicle(db, vehicle_id)
    crud.update_end_time_parking_ticket(db, last_parked_ticket.parking_ticket_id)

    return Response(status_code=204)



