from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, field_validator


class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120, alias="product_name")
    sku: str = Field(..., min_length=1, max_length=64)
    price: Decimal = Field(..., gt=0, max_digits=12, decimal_places=2)
    quantity: int = Field(..., ge=0)

    @field_validator("name", "sku")
    @classmethod
    def strip_required(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Field cannot be empty")
        return value

    model_config = ConfigDict(populate_by_name=True)


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=120, alias="product_name")
    sku: str | None = Field(None, min_length=1, max_length=64)
    price: Decimal | None = Field(None, gt=0, max_digits=12, decimal_places=2)
    quantity: int | None = Field(None, ge=0)

    @field_validator("name", "sku")
    @classmethod
    def strip_optional(cls, value: str | None) -> str | None:
        if value is None:
            return value
        value = value.strip()
        if not value:
            raise ValueError("Field cannot be empty")
        return value

    model_config = ConfigDict(populate_by_name=True)


class ProductRead(BaseModel):
    id: int
    name: str
    sku: str
    price: Decimal
    quantity: int

    model_config = ConfigDict(from_attributes=True)
