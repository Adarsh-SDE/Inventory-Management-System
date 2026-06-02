from __future__ import annotations

from decimal import Decimal

from sqlalchemy import delete

from app.db.database import SessionLocal
from app.models.customer import Customer
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreate, OrderItemCreate
from app.services.order_service import OrderService

PRODUCTS = [
    {"name": "Walnut Desk Shelf", "sku": "DSK-WAL-001", "price": Decimal("149.00"), "quantity": 24},
    {"name": "Felt Cable Tray", "sku": "CBL-FLT-014", "price": Decimal("38.00"), "quantity": 42},
    {"name": "Task Lamp Arc", "sku": "LMP-ARC-207", "price": Decimal("89.00"), "quantity": 15},
    {"name": "Soft Touch Notebook", "sku": "NTB-STN-112", "price": Decimal("16.50"), "quantity": 110},
    {"name": "Ceramic Pen Cup", "sku": "ACC-CRM-023", "price": Decimal("24.00"), "quantity": 32},
    {"name": "Studio Headphone Stand", "sku": "AUD-STD-311", "price": Decimal("54.00"), "quantity": 9},
    {"name": "Grid Planner Pad", "sku": "PLN-GRD-028", "price": Decimal("12.00"), "quantity": 60},
    {"name": "Minimal Monitor Riser", "sku": "DSK-RSR-144", "price": Decimal("129.00"), "quantity": 18},
]

CUSTOMERS = [
    {"full_name": "Avery Bennett", "email": "avery.bennett@northstar.design", "phone": "+1 415 555 0101"},
    {"full_name": "Mila Chen", "email": "mila.chen@harborstudio.co", "phone": "+1 415 555 0114"},
    {"full_name": "Noah Alvarez", "email": "noah.alvarez@tideworks.io", "phone": "+1 415 555 0133"},
    {"full_name": "Sofia Patel", "email": "sofia.patel@atelierretail.com", "phone": "+1 415 555 0178"},
    {"full_name": "Ethan Brooks", "email": "ethan.brooks@oakandco.com", "phone": "+1 415 555 0190"},
]

ORDER_BLUEPRINTS = [
    {"customer": "Avery Bennett", "items": [("Walnut Desk Shelf", 2), ("Ceramic Pen Cup", 3)]},
    {"customer": "Mila Chen", "items": [("Task Lamp Arc", 1), ("Felt Cable Tray", 2)]},
    {"customer": "Noah Alvarez", "items": [("Minimal Monitor Riser", 1), ("Studio Headphone Stand", 1)]},
    {"customer": "Sofia Patel", "items": [("Soft Touch Notebook", 12), ("Grid Planner Pad", 8)]},
    {"customer": "Ethan Brooks", "items": [("Walnut Desk Shelf", 1), ("Task Lamp Arc", 2), ("Ceramic Pen Cup", 2)]},
]


def seed() -> None:
    db = SessionLocal()
    try:
        db.execute(delete(OrderItem))
        db.execute(delete(Order))
        db.execute(delete(Customer))
        db.execute(delete(Product))
        db.commit()

        products = [Product(**payload) for payload in PRODUCTS]
        customers = [Customer(**payload) for payload in CUSTOMERS]
        db.add_all(products + customers)
        db.commit()

        product_index = {product.name: product.id for product in db.query(Product).all()}
        customer_index = {customer.full_name: customer.id for customer in db.query(Customer).all()}
        order_service = OrderService(db)

        for blueprint in ORDER_BLUEPRINTS:
            payload = OrderCreate(
                customer_id=customer_index[blueprint["customer"]],
                items=[
                    OrderItemCreate(product_id=product_index[product_name], quantity=quantity)
                    for product_name, quantity in blueprint["items"]
                ],
            )
            order_service.create_order(payload)

        summary = {
            "products": db.query(Product).count(),
            "customers": db.query(Customer).count(),
            "orders": db.query(Order).count(),
        }
        print(f"Seed complete: {summary}")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
