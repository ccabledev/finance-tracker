from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field

class BudgetCreate(BaseModel):
    category_id: int
    amount: Decimal = Field(gt=0, max_digits=12, decimal_places=2)


class BudgetRead(BaseModel):
    id: int
    user_id: int
    category_id: int
    amount: Decimal
    spent_this_month: Decimal

    model_config = {"from_attributes": True}


class BudgetUpdate(BaseModel):
    amount: Optional[Decimal] = Field(
        default=None, gt=0, max_digits=12, decimal_places=2
    )