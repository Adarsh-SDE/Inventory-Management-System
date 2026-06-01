from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.product import Product


class ProductRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self, search: str | None = None) -> list[Product]:
        query = select(Product).order_by(Product.id.desc())
        if search:
            pattern = f"%{search}%"
            query = query.where(Product.name.ilike(pattern) | Product.sku.ilike(pattern))
        return list(self.db.scalars(query))

    def get(self, product_id: int) -> Product | None:
        return self.db.get(Product, product_id)

    def get_by_sku(self, sku: str) -> Product | None:
        return self.db.scalar(select(Product).where(Product.sku == sku))

    def create(self, product: Product) -> Product:
        self.db.add(product)
        self.db.flush()
        return product

    def delete(self, product: Product) -> None:
        self.db.delete(product)
