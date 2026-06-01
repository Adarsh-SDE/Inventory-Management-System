from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.customer import Customer


class CustomerRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self, search: str | None = None) -> list[Customer]:
        query = select(Customer).order_by(Customer.id.desc())
        if search:
            pattern = f"%{search}%"
            query = query.where(Customer.full_name.ilike(pattern) | Customer.email.ilike(pattern))
        return list(self.db.scalars(query))

    def get(self, customer_id: int) -> Customer | None:
        return self.db.get(Customer, customer_id)

    def get_by_email(self, email: str) -> Customer | None:
        return self.db.scalar(select(Customer).where(Customer.email == email))

    def create(self, customer: Customer) -> Customer:
        self.db.add(customer)
        self.db.flush()
        return customer

    def delete(self, customer: Customer) -> None:
        self.db.delete(customer)
