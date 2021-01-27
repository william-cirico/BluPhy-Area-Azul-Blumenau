from fastapi import FastAPI

from . import models
from .database import engine
from .routers import (
    users, 
    auth, 
    vehicles,
    recharges, 
    parking_tickets, 
    traffic_wardens
)


models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# origins = [
#     "http://localhost",
#     "http://localhost:8081",
#     "http://localhost:8080",
#     "http://localhost:59845",
#     "http://10.0.2.2:8081",
# ]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_methods=["*"],
#     allow_headers=["*"],
#     allow_credentials=True,
# )

app.include_router(users.router)
app.include_router(auth.router)
app.include_router(vehicles.router)
app.include_router(recharges.router)
app.include_router(parking_tickets.router)
app.include_router(traffic_wardens.router)
