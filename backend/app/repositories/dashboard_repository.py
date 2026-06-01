from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.models.order import Order
from app.models.product import Product


class DashboardRepository:
    def __init__(self, db: Session):
        self.db = db

    def summary(self, low_stock_threshold: int = 10) -> dict[str, int]:
        return {
            "total_products": self.db.scalar(select(func.count(Product.id))) or 0,
            "total_customers": self.db.scalar(select(func.count(Customer.id))) or 0,
            "total_orders": self.db.scalar(select(func.count(Order.id))) or 0,
            "low_stock_products": self.db.scalar(
                select(func.count(Product.id)).where(Product.quantity < low_stock_threshold)
            )
            or 0,
        }
