from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel


class VehicleBase(BaseModel):
    license_plate: str
    model: str
    vehicle_type: str
    is_parked: Optional[bool] = False


class VehicleCreate(VehicleBase):
    pass


class VehicleUpdate(VehicleBase):
    pass


class Vehicle(VehicleBase):
    vehicle_id: int
    user_id: int

    class Config:
        orm_mode = True


class RechargeBase(BaseModel):
    value: float
    payment_status: Optional[bool] = False
    payment_type: str


class RechargeCreate(RechargeBase):
    pass


class Recharge(RechargeBase):
    date: datetime
    recharge_id: int
    user_id: int

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    name: str
    email: str


class UserCreate(UserBase):
    password: str    


class UserUpdate(UserBase):
    pass


class User(UserBase):
    user_id: int
    email: str
    balance: float    

    class Config:
        orm_mode = True


class ParkingTicketBase(BaseModel):
    location: str
    parking_time: Optional[int] = 1


class ParkingTicketCreate(ParkingTicketBase):
    pass


class ParkingTicket(ParkingTicketBase):
    parking_ticket_id: int
    start_time: datetime
    end_time: datetime
    price: float
    vehicle_id: int

    class Config:
        orm_mode = True


class ParkingInformation(BaseModel):
    parking_ticket: ParkingTicket
    vehicle: Vehicle


class BilletBase(BaseModel):
    url: str
    recharge_id: int


class BilletCreate(BilletBase):
    pass


class Billet(BilletBase):
    billet_id: int

    class Config:
        orm_mode = True


class TrafficWardenBase(BaseModel):
    name: str
    email: str


class TrafficWardenCreate(TrafficWardenBase):
    password: str


class TrafficWarden(TrafficWardenBase):
    traffic_warden_id: int

    class Config:
        orm_mode = True


class ChangePassword(BaseModel):
    verification_code: str
    new_password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str
    scopes: List[str] = []
