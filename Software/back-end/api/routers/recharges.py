import requests
from fastapi import APIRouter, Depends, HTTPException, Query, Response, Security
from sqlalchemy.orm import Session

from ..dependencies import get_db, get_current_user, get_access_token
from .. import schemas
from .. import crud
from ..config import settings

router = APIRouter(
    prefix='/recharges',
    tags=['recharges']
)


@router.post('/')
def create_charge_by_billet(
    amount: float = Query(..., gt=0),
    user: schemas.User = Security(get_current_user, scopes=["user"]),
    access_token: str = Depends(get_access_token),
    db: Session = Depends(get_db),
):
    """
    Cria uma cobrança do tipo "Boleto"
    """
    charge = {
        "charge": {
            "description": "Bluphy - Recarga de crédito",
            "amount": amount,
            "paymentTypes": ["BOLETO"]
        },
        "billing": {
            "name": user.name,
            "document": user.document,
            "email": user.email,
            "notify": True
        }
    }

    headers = {
        'X-Api-Version': '2',
        'X-Resource-Token': settings.x_resource_token,
        'Authorization': access_token
    }

    r = requests.post(
        'https://sandbox.boletobancario.com/api-integration/charges',
        json=charge,
        headers=headers
    )

    if r.status_code != 200:
        raise HTTPException(status_code=400, detail='Ocorreu um erro ao processar sua recarga')

    recharge_id = r.json()['_embedded']['charges'][0]['id']
    billet_link = r.json()['_embedded']['charges'][0]['link']

    recharge = schemas.RechargeCreate(
        recharge_id=recharge_id,
        value=amount,
        is_paid=False,
        payment_type='BOLETO'
    )

    crud.create_recharge(db, recharge, user.user_id)
    crud.create_billet(db, billet_link, recharge_id)

    return {'link': billet_link}


@router.get('/verify', status_code=204)
def user_has_recharges(
    user: schemas.User = Security(get_current_user, scopes=['user']),    
    db: Session = Depends(get_db)
):
    if not crud.get_unpaid_recharges_by_user_id(db, user.user_id):
        raise HTTPException(status_code=404)

    return Response(status_code=204)



@router.get('/', status_code=204)
def check_recharge_payment(
    user: schemas.User = Security(get_current_user, scopes=['user']),
    access_token: str = Depends(get_access_token),
    db: Session = Depends(get_db)
):
    unpaid_recharges = crud.get_unpaid_recharges_by_user_id(db, user.user_id)
    
    headers = {
        'X-Api-Version': '2',
        'X-Resource-Token': settings.x_resource_token,
        'Authorization': access_token
    }

    for unpaid_recharge in unpaid_recharges:
        r = requests.get(
            f'https://sandbox.boletobancario.com/api-integration/charges/{unpaid_recharge.recharge_id}',
            headers=headers
        )

        if r.status_code != 200:
            raise HTTPException(status_code=400, detail='Ocorreu um erro consultar a cobrança')

        payment_status = r.json()['status']

        if payment_status in ('CANCELLED', 'MANUAL_RECONCILIATION', 'FAILED'):
            crud.delete_recharge(db, unpaid_recharge.recharge_id)

        if payment_status == 'PAID':
            new_balance = user.balance + unpaid_recharge.value
            crud.update_user_balance(db, new_balance, user.user_id)
            crud.update_recharge_status(db, unpaid_recharge.recharge_id)

    return Response(status_code=204)


