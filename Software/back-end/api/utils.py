from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def document_validator(document:str) -> bool:
    document = clean_document(document)
    if len(document) == 11:
        response = False
        soma1 = 0
        soma2 = 0
        num = 10
        document = list(document)
        for i in range(11):
            document[i] = int(document[i])

        for i in range(9):
            soma1 = soma1 + document[i] * num
            num = num - 1
        tot1 = soma1 * 10 % 11
        if tot1 == 10:
            tot1 = 0

        num = 11
        for i in range(10):
            soma2 = soma2 + document[i] * num
            num = num - 1

        tot2 = soma2 * 10 % 11
        if tot2 == 10:
            tot2 = 0

        if tot1 == document[9] and tot2 == document[10]:
            response = True  
    
    elif len(document) == 14:
        response = False
        soma1 = 0
        soma2 = 0
        num1 = 5
        num2 = 9
        document = list(document)
        for i in range(14):
            document[i] = int(document[i])

        for i in range(4):
            soma1 = soma1 + document[i] * num1
            num1 = num1 - 1
        for j in range(8):
            soma1 = soma1 + document[j+4] * num2
            num2 = num2 - 1
        tot1 = soma1 * 10 % 11
        if tot1 == 10:
            tot1 = 0

        num1 = 6
        num2 = 9

        for i in range(5):
            soma2 = soma2 + document[i] * num1
            num1 = num1 - 1
        for j in range(8):
            soma2 = soma2 + document[j+5] * num2
            num2 = num2 - 1
            
        tot2 = soma2 * 10 % 11
        if tot2 == 10:
            tot2 = 0
        if tot1 == document[12] and tot2 == document[13]:
            response = True
    else:
        response = False
    
    return response

def clean_document(document:str) -> str:
    char = [".", "-", "/"]
    for i in char:
        document = document.replace(i, "")
    return document
