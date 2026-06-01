from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models.order import Order, OrderItem


class OrderRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self) -> list[Order]:
        query = (
            select(Order)
            .options(joinedload(Order.customer), joinedload(Order.items).joinedload(OrderItem.product))
            .order_by(Order.id.desc())
        )
        return list(self.db.scalars(query).unique())

    def get(self, order_id: int) -> Order | None:
        query = (
            select(Order)
            .options(joinedload(Order.customer), joinedload(Order.items).joinedload(OrderItem.product))
            .where(Order.id == order_id)
        )
        return self.db.scalars(query).unique().one_or_none()

    def create(self, order: Order) -> Order:
        self.db.add(order)
        self.db.flush()
        return order

    def delete(self, order: Order) -> None:
        self.db.delete(order)
