from fastapi import APIRouter, Depends
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
        user: schemas.User = Depends(get_current_user)
):
    """
    Criar um registro de recarga no banco
    """
    return crud.create_recharge(db, recharge, user.user_id)
