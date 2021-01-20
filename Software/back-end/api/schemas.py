from enum import Enum

class Tipo_Documento(Enum):
    cpf = 'CPF'
    cnpj = 'CNPJ'


class Tipo_Veiculo(Enum):
    moto = 'MOTO'
    carro = 'CARRO'