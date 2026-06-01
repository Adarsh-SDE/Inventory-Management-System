from sqlalchemy.orm import Session

from app.exceptions.base import ConflictError, NotFoundError
from app.models.customer import Customer
from app.repositories.customer_repository import CustomerRepository
from app.schemas.customer import CustomerCreate


class CustomerService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = CustomerRepository(db)

    def list_customers(self, search: str | None = None) -> list[Customer]:
        return self.repository.list(search)

    def get_customer(self, customer_id: int) -> Customer:
        customer = self.repository.get(customer_id)
        if not customer:
            raise NotFoundError("Customer not found")
        return customer

    def create_customer(self, payload: CustomerCreate) -> Customer:
        if self.repository.get_by_email(payload.email):
            raise ConflictError("Email already exists")
        customer = Customer(full_name=payload.full_name, email=str(payload.email), phone=payload.phone)
        self.repository.create(customer)
        self.db.commit()
        self.db.refresh(customer)
        return customer

    def delete_customer(self, customer_id: int) -> None:
        customer = self.get_customer(customer_id)
        self.repository.delete(customer)
        self.db.commit()
