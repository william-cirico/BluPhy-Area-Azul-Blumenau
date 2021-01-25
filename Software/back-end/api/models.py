from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, Time, DateTime, Enum
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    phone = Column(String, unique=True)
    password = Column(String)
    document_number = Column(String)
    balance = Column(Float, default=0.00)

    vehicles = relationship("Vehicle", back_populates="owner")
    recharge = relationship("Recharge", back_populates="user")


class Vehicle(Base):
    __tablename__ = "vehicles"

    vehicle_id = Column(Integer, primary_key=True, index=True)
    license_plate = Column(String, index=True)
    model = Column(String)
    vehicle_type = Column(String)
    is_parked = Column(Boolean, default=False)
    user_id = Column(Integer, ForeignKey("users.user_id"))

    owner = relationship("User", back_populates="vehicles")


class ParkingTicket(Base):
    __tablename__ = "parking_tickets"
    parking_ticket_id = Column(Integer, primary_key=True, index=True)
    location = Column(String)
    parking_time = Column(Integer)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    price = Column(Float)
    vehicle_id = Column(Integer, ForeignKey("vehicles.vehicle_id"))


class Recharge(Base):
    __tablename__ = "recharges"
    recharge_id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime)
    value = Column(Float)
    payment_status = Column(Boolean)
    payment_type = Column(String)
    user_id = Column(Integer, ForeignKey("users.user_id"))

    user = relationship("User", back_populates="recharge")
    billet = relationship("Billet", back_populates="recharge")


class Billet(Base):
    __tablename__ = "billets"
    billet_id = Column(Integer, primary_key=True, index=True)
    billet_link = Column(String)
    recharge_id = Column(Integer, ForeignKey("recharges.recharge_id"))

    recharge = relationship("Recharge", back_populates="billet")


class TrafficWarden(Base):
    __tablename__ = "traffic_wardens"
    traffic_warden_id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)
