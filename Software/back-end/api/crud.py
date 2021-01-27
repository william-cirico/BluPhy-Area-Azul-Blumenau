from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from . import models
from . import schemas
from .utils import get_password_hash


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        name=user.name,
        email=user.email,
        phone=user.phone,
        password=hashed_password,
        document_number=user.document_number
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_vehicle(db: Session, vehicle: schemas.VehicleCreate, user_id):
    db_vehicle = models.Vehicle(**vehicle.dict(), user_id=user_id)
    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle


def create_recharge(db: Session, recharge: schemas.RechargeCreate, user_id):
    db_recharge = models.Recharge(**recharge.dict(), date=datetime.now(), user_id=user_id)
    db.add(db_recharge)
    db.commit()
    db.refresh(db_recharge)
    return db_recharge


def create_parking_ticket(
        db: Session,
        parking_ticket: schemas.ParkingTicketCreate,
        price: float,
        vehicle_id: int
):
    start_time = datetime.now()
    end_time = datetime.now() + timedelta(hours=parking_ticket.parking_time)
    db_parking_ticket = models.ParkingTicket(
        **parking_ticket.dict(),
        start_time=start_time,
        end_time=end_time,
        price=price,
        vehicle_id=vehicle_id,
    )
    db.add(db_parking_ticket)
    db.commit()
    db.refresh(db_parking_ticket)
    return db_parking_ticket


def create_traffic_warden(
    db: Session,
    traffic_warden: schemas.TrafficWardenCreate
):
    hashed_password = get_password_hash(traffic_warden.password)
    db_traffic_warden = models.TrafficWarden(
        name=traffic_warden.name,
        email=traffic_warden.email,
        password=hashed_password,
    )
    db.add(db_traffic_warden)
    db.commit()
    db.refresh(db_traffic_warden)
    return db_traffic_warden


def update_user(db: Session, user: schemas.UserUpdate, user_id):
    db.query(models.User)\
        .filter(models.User.user_id == user_id)\
        .update({
            models.User.name: user.name,
            models.User.phone: user.phone,
            models.User.document_number: user.document_number,
        })
    db.commit()


def update_user_password(db: Session, email: str, new_password: str):
    db.query(models.User)\
        .filter(models.User.email == email)\
        .update({models.User.password: new_password})
    db.commit()


def update_user_balance(db: Session, new_balance: float, user_id: int):
    db.query(models.User)\
        .filter(models.User.user_id == user_id)\
        .update({models.User.balance: new_balance})
    db.commit()


def update_vehicle(db: Session, vehicle_update: schemas.VehicleUpdate, vehicle_id: int):
    db.query(models.Vehicle)\
        .filter(models.Vehicle.vehicle_id == vehicle_id)\
        .update({
            models.Vehicle.license_plate: vehicle_update.license_plate,
            models.Vehicle.model: vehicle_update.model,
            models.Vehicle.vehicle_type: vehicle_update.vehicle_type,
            models.Vehicle.is_parked: vehicle_update.is_parked,
        })
    db.commit()


def get_user_by_cpf(db: Session, document_number: str):
    return db.query(models.User).filter(models.User.document_number == document_number).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_traffic_warden_by_email(db: Session, email: str):
    return db.query(models.TrafficWarden).filter(models.TrafficWarden.email == email).first()


def delete_vehicle(db: Session, vehicle_id: int):
    db.query(models.Vehicle).filter(models.Vehicle.vehicle_id == vehicle_id).delete()
    db.commit()
