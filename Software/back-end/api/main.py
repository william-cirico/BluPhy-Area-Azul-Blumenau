"""
Arquivo principal. Onde fica instância do FastAPI e a inclusão das rotas.
"""

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

tags_metadata = [
    {
        'name': 'users',
        'description': 'Operações com usuários'
    },
    {
        'name': 'auth',
        'description': 'Operações de autenticação'
    },
    {
        'name': 'vehicles',
        'description': 'Operações com veículos'
    },
    {
        'name': 'recharges',
        'description': 'Operações com recargas'
    },
    {
        'name': 'parking tickets',
        'description': 'Operações com tickets de estacionamento'
    },
    {
        'name': 'traffic wardens',
        'description': 'Operações com guarda de trânsito'
    },
]


models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title='AreaAzulBlumenau API',
    description='Projeto de conclusão do curso Entra21',
    version='1.0.0',
    openapi_tags=tags_metadata
)

app.include_router(users.router)
app.include_router(auth.router)
app.include_router(vehicles.router)
app.include_router(recharges.router)
app.include_router(parking_tickets.router)
app.include_router(traffic_wardens.router)
