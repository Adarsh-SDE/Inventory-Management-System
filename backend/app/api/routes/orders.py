from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.order import OrderCreate, OrderRead
from app.services.order_service import OrderService
from app.utils.responses import success_response

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("", status_code=status.HTTP_201_CREATED)
def create_order(payload: OrderCreate, db: Session = Depends(get_db)):
    order = OrderService(db).create_order(payload)
    return success_response("Order created", OrderRead.model_validate(order).model_dump(mode="json"))


@router.get("")
def list_orders(db: Session = Depends(get_db)):
    orders = OrderService(db).list_orders()
    data = [OrderRead.model_validate(order).model_dump(mode="json") for order in orders]
    return success_response("Orders retrieved", data)


@router.get("/{order_id}")
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = OrderService(db).get_order(order_id)
    return success_response("Order retrieved", OrderRead.model_validate(order).model_dump(mode="json"))


@router.delete("/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    OrderService(db).delete_order(order_id)
    return success_response("Order deleted", None)
