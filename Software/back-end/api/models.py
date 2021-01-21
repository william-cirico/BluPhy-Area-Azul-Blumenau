from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, Time, DateTime, Enum
from sqlalchemy.orm import relationship

from .database import Base
from .schemas import Tipo_Documento, Tipo_Veiculo


class Usuario(Base):
    __tablename__ = "usuarios"

    id_usuario = Column(Integer, primary_key=True, index=True)
    nome = Column(String)
    email = Column(String, unique=True, index=True)
    telefone = Column(String, unique=True)
    hashed_senha = Column(String)
    numero_documento = Column(String, unique=True)
    tipo_documento = Column(Enum(Tipo_Documento))
    saldo = Column(Float, default=0.00)

    veiculo = relationship("Veiculo", back_populates="dono")
    recarga = relationship("Recarga", back_populates="usuario")
    cartao = relationship("Cartao", back_populates="usuario")


class Veiculo(Base):
    __tablename__ = "veiculos"

    id_veiculo = Column(Integer, primary_key=True, index=True)
    placa = Column(String, unique=True, index=True)
    modelo = Column(String)
    tipo_veiculo = Column(Enum(Tipo_Veiculo))
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"))

    dono = relationship("Usuario", back_populates="veiculo")
    reserva = relationship("Reserva", back_populates="veiculo")


class Reserva(Base):
    __tablename__ = "reservas"
    id_reserva = Column(Integer, primary_key=True, index=True)
    hora_inicio = Column(Time)
    hora_fim = Column(Time)
    localização = Column(String)
    id_veiculo = Column(Integer, ForeignKey("veiculos.id_veiculo"))

    veiculo = relationship("Veiculo", back_populates="reserva")


class Recarga(Base):
    __tablename__ = "recargas"
    id_recarga = Column(Integer, primary_key=True, index=True)
    data = Column(DateTime)
    valor = Column(Float)
    status_pagamento = Column(Boolean)    
    tipo_pagamento = Column(String)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"))

    usuario = relationship("Usuario", back_populates="recarga")
    boleto = relationship("Boleto", back_populates="recarga")


class Boleto(Base):
    __tablename__ = "boletos"
    id_boleto = Column(Integer, primary_key=True, index=True)
    link_boleto = Column(String)
    id_recarga = Column(Integer, ForeignKey("recargas.id_recarga"))

    recarga = relationship("Recarga", back_populates="boleto")


class Cartao(Base):
    __tablename__ = "cartoes"
    id_cartao = Column(Integer, primary_key=True, index=True)
    hashed_cartao = Column(String)
    bandeira = Column(String)
    ultimos_digitos = Column(Integer)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"))

    usuario = relationship("Usuario", back_populates="cartao")


class Funcionario(Base):
    __tablename__ = "funcionarios"
    id_funcionario = Column(Integer, primary_key=True, index=True)
    nome = Column(String)
    email = Column(String, unique=True, index=True)
    hashed_senha = Column(String)
