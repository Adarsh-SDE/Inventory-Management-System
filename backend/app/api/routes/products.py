from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.product import ProductCreate, ProductRead, ProductUpdate
from app.services.product_service import ProductService
from app.utils.responses import success_response

router = APIRouter(prefix="/products", tags=["Products"])


@router.post("", status_code=status.HTTP_201_CREATED)
def create_product(payload: ProductCreate, db: Session = Depends(get_db)):
    product = ProductService(db).create_product(payload)
    return success_response("Product created", ProductRead.model_validate(product).model_dump(mode="json"))


@router.get("")
def list_products(search: str | None = Query(default=None), db: Session = Depends(get_db)):
    products = ProductService(db).list_products(search)
    data = [ProductRead.model_validate(product).model_dump(mode="json") for product in products]
    return success_response("Products retrieved", data)


@router.get("/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = ProductService(db).get_product(product_id)
    return success_response("Product retrieved", ProductRead.model_validate(product).model_dump(mode="json"))


@router.put("/{product_id}")
def update_product(product_id: int, payload: ProductUpdate, db: Session = Depends(get_db)):
    product = ProductService(db).update_product(product_id, payload)
    return success_response("Product updated", ProductRead.model_validate(product).model_dump(mode="json"))


@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    ProductService(db).delete_product(product_id)
    return success_response("Product deleted", None)
