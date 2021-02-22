"""
Operações no banco de dados (Create, Read, Update, Delete).
"""
from typing import List
from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from . import models
from . import schemas
from .utils import get_password_hash
from .database import SessionLocal


def create_user(db: Session, user: schemas.UserCreate) -> schemas.User:
    """
    Cria um usuário no banco de dados.

    Args:
        db: Sessão do BD.
        user: Dados do usuário.
    Returns:
        O usuário criado no banco.
    """
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


def create_vehicle(
        db: Session,
        vehicle: schemas.VehicleCreate,
        is_active: bool,
        user_id: int
) -> schemas.Vehicle:
    """
    Cria um veículo no banco de dados.

    Args:
        db: Sessão do BD.
        vehicle: Os dados do veículo.
        is_active: O estado do veículo.
        user_id: ID do dono do veículo.
    Returns:
        O veículo criado no banco.
    """
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
    """
    Cria um registro de recarga no banco de dados.

    Args:
        db: Sessão do BD.
        recharge: Os dados da recarga.
        user_id: ID do usuário que fez a recarga.
    Returns:
        A recarga criada no banco.
    """
    db_recharge = models.Recharge(**recharge.dict(), date=datetime.now(), user_id=user_id)
    db.add(db_recharge)
    db.commit()
    db.refresh(db_recharge)
    return db_recharge


def create_billet(db: Session, billet_link: str, recharge_id: str) -> None:
    """
    Cria um registro de boleto no banco.

    Args:
        db: Sessão do BD.
        billet_link: Link do boleto (Retornado da Juno APi).
        recharge_id: ID da recarga em que o boleto foi gerado.
    """
    db_billet = models.Billet(billet_link=billet_link, recharge_id=recharge_id)
    db.add(db_billet)
    db.commit()


def create_parking_ticket(
        db: Session,
        parking_ticket: schemas.ParkingTicketCreate,
        price: float,
        vehicle_id: int
) -> schemas.ParkingTicket:
    """
    Cria um ticket de estacionamento.

    Args:
        db: Sessão do BD.
        parking_ticket: Os dados do ticket de estacionamento.
        price: Preço do ticket.
        vehicle_id: ID do veículo estacionado.
    Returns:
        Retorna o ticket de estacionamento criado no banco.
    """
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
) -> schemas.TrafficWarden:
    """
    Criando um registro de guarda de trânsito no banco de dados.

    Args:
        db: Sessão do BD.
        traffic_warden: Dados do guarda de trânsito.
    """
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
) -> None:
    """
    Cria um admin no banco de dados.

    Args:
        name: Nome do Admin.
        email: Email do Admin.
        password: Senha do Admin.
    """
    db: Session = SessionLocal()

    hashed_password = get_password_hash(password)
    db_admin = models.Admin(
        name=name,
        email=email,
        password=hashed_password
    )
    db.add(db_admin)
    db.commit()
    db.close()
    print('Admin criado com sucesso!')


def create_password_redefine_requisition(
        db: Session,
        email: str,
        verification_code: str
) -> None:
    """
    Cria um registro de requisição de redefinição de senha no banco de dados.

    Args:
        db: Sessão do BD.
        email: Email da conta.
        verification_code: Código de verificação.
    """
    db_password_redefine_requisition = models.PasswordRedefineRequisition(
        email=email,
        verification_code=verification_code
    )
    db.add(db_password_redefine_requisition)
    db.commit()


def update_user(db: Session, user: schemas.UserUpdate, user_id) -> None:
    """
    Atualizar os dados de um usuário no banco de dados.

    Args:
        db: Sessão do BD.
        user: Dados do usuário.
        user_id: ID do usuário.
    """
    db.query(models.User)\
        .filter(models.User.user_id == user_id)\
        .update({
            models.User.name: user.name,            
            models.User.document: user.document,
        })
    db.commit()


def update_user_password(db: Session, email: str, new_password: str) -> None:
    """
    Atualiza a senha do usuário.

    Args:
        db: Sessão do BD.
        email: Email do usuário.
        new_password: Nova senha.
    """
    hashed_password = get_password_hash(new_password)
    db.query(models.User)\
        .filter(models.User.email == email)\
        .update({models.User.password: hashed_password})
    db.commit()


def update_user_balance(db: Session, new_balance: float, user_id: int) -> None:
    """
    Atualiza o saldo do usuário.

    Args:
        db: Sessão do BD.
        new_balance: Novo saldo.
        user_id: ID do usuário.
    """
    db.query(models.User)\
        .filter(models.User.user_id == user_id)\
        .update({models.User.balance: new_balance})
    db.commit()


def update_vehicle(db: Session, vehicle_update: schemas.VehicleUpdate, vehicle_id: int) -> None:
    """
    Atualiza os dados do veículo.

    Args:
        db: Sessão do BD.
        vehicle_update: Dados de atualização do veículo.
        vehicle_id: ID do veículo.
    """
    db.query(models.Vehicle)\
        .filter(models.Vehicle.vehicle_id == vehicle_id)\
        .update({
            models.Vehicle.license_plate: vehicle_update.license_plate,
            models.Vehicle.model: vehicle_update.model,
            models.Vehicle.vehicle_type: vehicle_update.vehicle_type,
        })
    db.commit()


def update_is_parked_vehicle(db: Session, vehicle_id: int, is_parked: bool) -> None:
    """
    Atualiza o campo "is_parked" do veículo.

    Args:
        db: Sessão do BD.
        vehicle_id: ID do veículo.
        is_parked: Estado do veículo.
    """
    db.query(models.Vehicle)\
        .filter(models.Vehicle.vehicle_id == vehicle_id)\
        .update({models.Vehicle.is_parked: is_parked})
    db.commit()


def update_is_active_vehicle(db: Session, vehicle_id: int, is_active: bool) -> None:
    """
    Atualiza o campo "is_active" do veículo.

    Args:
        db: Sessão do BD.
        vehicle_id: ID do veículo.
        is_active: Estado do veículo.
    """
    db.query(models.Vehicle)\
        .filter(models.Vehicle.vehicle_id == vehicle_id)\
        .update({models.Vehicle.is_active: is_active})
    db.commit()


def update_end_time_parking_ticket(db: Session, parking_ticket_id: int) -> None:
    """
    Atualiza o tempo de expiração do ticket.

    Args:
        db: Sessão do BD.
        parking_ticket_id: ID do ticket.
    """
    db.query(models.ParkingTicket)\
        .filter(models.ParkingTicket.parking_ticket_id == parking_ticket_id)\
        .update({models.ParkingTicket.end_time: datetime.now()})
    db.commit()


def update_recharge_status(db: Session, recharge_id: str) -> None:
    """
    Atualiza o campo "is_paid" da recarga para True.

    Args:
        db: Sessão do BD.
        recharge_id: ID da recarga.
    """
    db.query(models.Recharge)\
        .filter(models.Recharge.recharge_id == recharge_id)\
        .update({models.Recharge.is_paid: True})
    db.commit()


def get_user_by_email(db: Session, email: str) -> schemas.User:
    """
    Retorna o registro do usuário pelo seu email.

    Args:
        db: Sessão do BD.
        email: Email do usuário.
    """
    return db.query(models.User).filter(models.User.email == email).first()


def get_traffic_warden_by_email(db: Session, email: str) -> schemas.TrafficWarden:
    """
    Retorna o registro do guarda de trânsito pelo seu email.

    Args:
        db: Sessão do BD.
        email: Email do guarda de trânsito.
    """
    return db.query(models.TrafficWarden).filter(models.TrafficWarden.email == email).first()


def get_admin_by_email(db: Session, email: str) -> schemas.Admin:
    """
    Retorna o registro do admin com base no seu email.

    Args:
        db: Sessão do BD.
        email: Email do Admin.
    """
    return db.query(models.Admin)\
        .filter(models.Admin.email == email).first()


def get_vehicles_by_user_id(db: Session, user_id: int) -> List[schemas.Vehicle]:
    """
    Retorna a lista de veículos de um usuário através do seu ID.

    Args:
        db: Sessão do BD.
        user_id: ID do usuário.
    """
    return db.query(models.Vehicle)\
        .filter(models.Vehicle.user_id == user_id)\
        .order_by(models.Vehicle.license_plate)\
        .all()


def get_parked_vehicle_by_license_plate(db: Session, license_plate: str) -> schemas.Vehicle:
    """
    Retorna o veículo pela sua placa se ele estiver estacionado.

    Args:
        db: Sessão do BD.
        license_plate: Placa do veículo.
    """
    return db.query(models.Vehicle)\
        .filter(models.Vehicle.license_plate == license_plate)\
        .filter(models.Vehicle.is_parked)\
        .first()


def get_vehicle_by_id(db: Session, vehicle_id: int) -> schemas.Vehicle:
    """
    Retorna o veículo pelo seu ID.

    Args:
        db: Sessão do BD.
        vehicle_id: ID do veículo.
    """
    return db.query(models.Vehicle)\
        .filter(models.Vehicle.vehicle_id == vehicle_id)\
        .first()


def get_user_by_document(db: Session, document: str) -> schemas.User:
    """
    Retorna um usuário pelo seu documento (CPF ou CNPJ).

    Args:
        db: Sessão do BD.
        document: Documento do usuário.
    """
    return db.query(models.User)\
        .filter(models.User.document == document)\
        .first()


def get_last_parking_ticket_from_vehicle(db: Session, vehicle_id: int) -> schemas.ParkingTicket:
    """
    Retorna o último ticket de estacionamento de um veículo.

    Args:
        db: Sessão do BD.
        vehicle_id: ID do veículo
    """
    return db.query(models.ParkingTicket)\
        .filter(models.ParkingTicket.vehicle_id == vehicle_id)\
        .order_by(models.ParkingTicket.parking_ticket_id.desc())\
        .first()


def get_password_redefine_requisition(db: Session, email: str):
    """
    Retorna o registro da requisição de redefinição de senha.

    Args:
        db: Sessão do BD.
        email: Email da requisição.
    """
    return db.query(models.PasswordRedefineRequisition)\
        .filter(models.PasswordRedefineRequisition.email == email)\
        .first()


def get_unpaid_recharges_by_user_id(db: Session, user_id: int) -> List[schemas.Recharge]:
    """
    Retorna as recargas que não estão pagas através do ID de um usuáiro.

    Args:
        db: Sessão do BD.
        user_id: ID do usuário.
    """
    return db.query(models.Recharge)\
        .filter(models.Recharge.user_id == user_id)\
        .filter(models.Recharge.is_paid == False)\
        .all()


def delete_vehicle(db: Session, vehicle_id: int) -> None:
    """
    Deleta o registro do veículo do banco.

    Args:
        db: Sessão do BD.
        vehicle_id: ID do veículo.
    """
    db.query(models.Vehicle).filter(models.Vehicle.vehicle_id == vehicle_id).delete()
    db.commit()


def delete_password_redefine_requisition(db, email):
    """
    Deleta o registro de requisição de redefinição de senha do banco.

    Args:
        db: Sessão do BD.
        email: Email da requisição.
    """
    db.query(models.PasswordRedefineRequisition)\
        .filter(models.PasswordRedefineRequisition.email == email)\
        .delete()
    db.commit()


def delete_recharge(db, recharge_id):
    """
    Deleta o registro da recarga.

    Args:
        db: Sessão do BD.
        recharge_id: ID da recarga.
    """
    db.query(models.Recharge)\
        .filter(models.Recharge.recharge_id == recharge_id)\
        .delete()
    db.commit()

