from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class CustomerCreate(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=140)
    email: EmailStr
    phone: str = Field(..., min_length=1, max_length=32)

    @field_validator("full_name", "phone")
    @classmethod
    def strip_required(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Field cannot be empty")
        return value


class CustomerRead(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    phone: str

    model_config = ConfigDict(from_attributes=True)
