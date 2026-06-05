from datetime import date, datetime
from decimal import Decimal
from typing import Literal, Optional

from pydantic import BaseModel, Field

class TransactionCreate(BaseModel):
    amount: Decimal = Field(gt=0, max_digits=12, decimal_places=2)
    type: Literal["income", "expense"]
    description: str = Field(min_length=1, max_length=255)
    transaction_date: date
    category_id: Optional[int] = None


class TransactionRead(BaseModel):
    id: int
    user_id: int
    category_id: Optional[int]
    amount: Decimal
    type: Literal["income", "expense"]
    description: str
    transaction_date: date
    created_at: datetime

    model_config = {"from_attributes": True}

class TransactionUpdate(BaseModel):
    amount: Optional[Decimal] = Field(default=None, gt=0, max_digits=12, decimal_places=2)
    type: Optional[Literal["income", "expense"]] = None
    description: Optional[str] = Field(default=None, min_length=1, max_length=255)
    transaction_date: Optional[date] = None
    category_id: Optional[int] = None