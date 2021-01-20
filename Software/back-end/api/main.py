from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import crud, models, schemas
from .database import engine
from .routers import users

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8081",
    "http://localhost:8080",
    "http://localhost:59845",
    "http://10.0.2.2:8081"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app.include_router(users.router)


@app.get('/')
async def hello():
    return {'message': 'Hello World!'}

