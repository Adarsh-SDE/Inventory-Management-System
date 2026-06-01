from sqlalchemy.orm import Session

from app.exceptions.base import ConflictError, NotFoundError
from app.models.product import Product
from app.repositories.product_repository import ProductRepository
from app.schemas.product import ProductCreate, ProductUpdate


class ProductService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = ProductRepository(db)

    def list_products(self, search: str | None = None) -> list[Product]:
        return self.repository.list(search)

    def get_product(self, product_id: int) -> Product:
        product = self.repository.get(product_id)
        if not product:
            raise NotFoundError("Product not found")
        return product

    def create_product(self, payload: ProductCreate) -> Product:
        if self.repository.get_by_sku(payload.sku):
            raise ConflictError("SKU already exists")
        product = Product(name=payload.name, sku=payload.sku, price=payload.price, quantity=payload.quantity)
        self.repository.create(product)
        self.db.commit()
        self.db.refresh(product)
        return product

    def update_product(self, product_id: int, payload: ProductUpdate) -> Product:
        product = self.get_product(product_id)
        updates = payload.model_dump(exclude_unset=True, by_alias=False)
        if "sku" in updates:
            existing = self.repository.get_by_sku(updates["sku"])
            if existing and existing.id != product.id:
                raise ConflictError("SKU already exists")
        for field, value in updates.items():
            setattr(product, field, value)
        self.db.commit()
        self.db.refresh(product)
        return product

    def delete_product(self, product_id: int) -> None:
        product = self.get_product(product_id)
        self.repository.delete(product)
        self.db.commit()
