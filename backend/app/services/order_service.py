from decimal import Decimal

from sqlalchemy.orm import Session

from app.exceptions.base import NotFoundError, ValidationError
from app.models.order import Order, OrderItem
from app.repositories.customer_repository import CustomerRepository
from app.repositories.order_repository import OrderRepository
from app.repositories.product_repository import ProductRepository
from app.schemas.order import OrderCreate


class OrderService:
    def __init__(self, db: Session):
        self.db = db
        self.orders = OrderRepository(db)
        self.products = ProductRepository(db)
        self.customers = CustomerRepository(db)

    def list_orders(self) -> list[Order]:
        return self.orders.list()

    def get_order(self, order_id: int) -> Order:
        order = self.orders.get(order_id)
        if not order:
            raise NotFoundError("Order not found")
        return order

    def create_order(self, payload: OrderCreate) -> Order:
        if not self.customers.get(payload.customer_id):
            raise NotFoundError("Customer not found")

        product_quantities: dict[int, int] = {}
        for item in payload.items:
            product_quantities[item.product_id] = product_quantities.get(item.product_id, 0) + item.quantity

        order_items: list[OrderItem] = []
        total_amount = Decimal("0.00")

        try:
            for product_id, requested_quantity in product_quantities.items():
                product = self.products.get(product_id)
                if not product:
                    raise NotFoundError(f"Product {product_id} not found")
                if product.quantity < requested_quantity:
                    raise ValidationError(f"Insufficient stock for {product.name}")

                unit_price = Decimal(product.price)
                line_total = unit_price * requested_quantity
                product.quantity -= requested_quantity
                total_amount += line_total
                order_items.append(
                    OrderItem(
                        product_id=product.id,
                        quantity=requested_quantity,
                        unit_price=unit_price,
                        line_total=line_total,
                    )
                )

            order = Order(customer_id=payload.customer_id, total_amount=total_amount, items=order_items)
            self.orders.create(order)
            self.db.commit()
            return self.get_order(order.id)
        except Exception:
            self.db.rollback()
            raise

    def delete_order(self, order_id: int) -> None:
        order = self.get_order(order_id)
        self.orders.delete(order)
        self.db.commit()
