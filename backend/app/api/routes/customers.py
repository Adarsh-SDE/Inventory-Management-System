from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.customer import CustomerCreate, CustomerRead
from app.services.customer_service import CustomerService
from app.utils.responses import success_response

router = APIRouter(prefix="/customers", tags=["Customers"])


@router.post("", status_code=status.HTTP_201_CREATED)
def create_customer(payload: CustomerCreate, db: Session = Depends(get_db)):
    customer = CustomerService(db).create_customer(payload)
    return success_response("Customer created", CustomerRead.model_validate(customer).model_dump(mode="json"))


@router.get("")
def list_customers(search: str | None = Query(default=None), db: Session = Depends(get_db)):
    customers = CustomerService(db).list_customers(search)
    data = [CustomerRead.model_validate(customer).model_dump(mode="json") for customer in customers]
    return success_response("Customers retrieved", data)


@router.get("/{customer_id}")
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = CustomerService(db).get_customer(customer_id)
    return success_response("Customer retrieved", CustomerRead.model_validate(customer).model_dump(mode="json"))


@router.delete("/{customer_id}")
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    CustomerService(db).delete_customer(customer_id)
    return success_response("Customer deleted", None)
