<<<<<<< HEAD
from fastapi import APIRouter, Depends, Security
=======
from fastapi import APIRouter, Depends
>>>>>>> ffff7d25f1448e797d7f5cec993cbf0bcf51e352
from sqlalchemy.orm import Session

from ..dependencies import get_db, get_current_user
from .. import schemas
from .. import crud

router = APIRouter(
    prefix='/recharges',
    tags=['recharges']
)


@router.post('/', response_model=schemas.Recharge)
async def create_recharge(
        recharge: schemas.RechargeCreate,
        db: Session = Depends(get_db),
<<<<<<< HEAD
        user: schemas.User = Security(get_current_user, scopes=["user"])
=======
        user: schemas.User = Depends(get_current_user)
>>>>>>> ffff7d25f1448e797d7f5cec993cbf0bcf51e352
):
    """
    Criar um registro de recarga no banco
    """
    return crud.create_recharge(db, recharge, user.user_id)
