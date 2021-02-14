from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from . import models
from . import schemas
from .utils import get_password_hash
from .database import SessionLocal


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        name=user.name,
        email=user.email,
        document=user.document,
        password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_vehicle(db: Session, vehicle: schemas.VehicleCreate, is_active: bool, user_id):
    db_vehicle = models.Vehicle(
        **vehicle.dict(),
        is_active=is_active,
        user_id=user_id
    )
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


def create_billet(db: Session, billet_link: str, recharge_id: str):
    db_billet = models.Billet(billet_link=billet_link, recharge_id=recharge_id)
    db.add(db_billet)
    db.commit()


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


def create_admin(
        name: str,
        email: str,
        password: str
):
    db: Session = SessionLocal()

    hashed_password = get_password_hash(password)
    db_admin = models.Admin(
        name=name,
        email=email,
        password=hashed_password
    )
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)

    db.close()
    print('Admin criado com sucesso!')


def create_password_redefine_requisition(db: Session, email: str, verification_code: str):
    db_password_redefine_requisition = models.PasswordRedefineRequisition(
        email=email,
        verification_code=verification_code
    )
    db.add(db_password_redefine_requisition)
    db.commit()
    db.refresh(db_password_redefine_requisition)


def update_user(db: Session, user: schemas.UserUpdate, user_id):
    db.query(models.User)\
        .filter(models.User.user_id == user_id)\
        .update({
            models.User.name: user.name,
            models.User.email: user.email,            
        })
    db.commit()


def update_user_password(db: Session, email: str, new_password: str):
    hashed_password = get_password_hash(new_password)
    db.query(models.User)\
        .filter(models.User.email == email)\
        .update({models.User.password: hashed_password})
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
        })
    db.commit()


def update_is_parked_vehicle(db: Session, vehicle_id: int, is_parked: bool):
    db.query(models.Vehicle)\
        .filter(models.Vehicle.vehicle_id == vehicle_id)\
        .update({models.Vehicle.is_parked: is_parked})
    db.commit()


def update_is_active_vehicle(db: Session, vehicle_id: int, is_active: bool):
    db.query(models.Vehicle)\
        .filter(models.Vehicle.vehicle_id == vehicle_id)\
        .update({models.Vehicle.is_active: is_active})
    db.commit()


def update_end_time_parking_ticket(db: Session, parking_ticket_id: int):    
    db.query(models.ParkingTicket)\
        .filter(models.ParkingTicket.parking_ticket_id == parking_ticket_id)\
        .update({models.ParkingTicket.end_time: datetime.now()})
    db.commit()


def update_recharge_status(db: Session, recharge_id: str):
    db.query(models.Recharge)\
        .filter(models.Recharge.recharge_id == recharge_id)\
        .update({models.Recharge.is_paid: True})
    db.commit()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_traffic_warden_by_email(db: Session, email: str):
    return db.query(models.TrafficWarden).filter(models.TrafficWarden.email == email).first()


def get_admin_by_email(db: Session, email: str):
    return db.query(models.Admin)\
        .filter(models.Admin.email == email).first()


def get_vehicles_by_user_id(db: Session, user_id: int):
    return db.query(models.Vehicle)\
        .filter(models.Vehicle.user_id == user_id)\
        .order_by(models.Vehicle.license_plate)\
        .all()


def get_parked_vehicle_by_license_plate(db: Session, license_plate: str):
    return db.query(models.Vehicle)\
        .filter(models.Vehicle.license_plate == license_plate)\
        .filter(models.Vehicle.is_parked)\
        .first()


def get_vehicle_by_id(db: Session, vehicle_id: int):
    return db.query(models.Vehicle)\
        .filter(models.Vehicle.vehicle_id == vehicle_id)\
        .first()


def get_user_by_document(db: Session, document: str):
    return db.query(models.User)\
        .filter(models.User.document == document)\
        .first()


def get_last_parked_ticket_from_vehicle(db: Session, vehicle_id: int):
    return db.query(models.ParkingTicket)\
        .filter(models.ParkingTicket.vehicle_id == vehicle_id)\
        .order_by(models.ParkingTicket.parking_ticket_id.desc())\
        .first()


def get_password_redefine_requisition(db: Session, email: str):
    return db.query(models.PasswordRedefineRequisition)\
        .filter(models.PasswordRedefineRequisition.email == email)\
        .first()


def get_unpaid_recharges_by_user_id(db: Session, user_id: int):
    return db.query(models.Recharge)\
        .filter(models.Recharge.user_id == user_id)\
        .filter(models.Recharge.is_paid == False)\
        .all()


def delete_vehicle(db: Session, vehicle_id: int):
    db.query(models.Vehicle).filter(models.Vehicle.vehicle_id == vehicle_id).delete()
    db.commit()


def delete_password_redefine_requisition(db, email):
    db.query(models.PasswordRedefineRequisition)\
        .filter(models.PasswordRedefineRequisition.email == email)\
        .delete()
    db.commit()


def delete_recharge(db, recharge_id):
    db.query(models.Recharge)\
        .filter(models.Recharge.recharge_id == recharge_id)\
        .delete()
    db.commit()

