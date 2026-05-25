from datetime import date, datetime, timezone
from decimal import Decimal
from typing import Optional

from sqlmodel import Field, SQLModel
from sqlalchemy import Column, ForeignKey, Integer


class Transaction(SQLModel, table=True):
    __tablename__ = "transactions"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    category_id: Optional[int] = Field(
    default=None,
    sa_column=Column(
        Integer,
        ForeignKey("categories.id", ondelete="SET NULL"),
        index=True,
    ),
)

    amount: Decimal = Field(max_digits=12, decimal_places=2)
    type: str = Field(max_length=10)
    description: str = Field(max_length=255)
    transaction_date: date
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )