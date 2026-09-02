from decimal import Decimal
from typing import Optional

from sqlalchemy import Column, ForeignKey, Integer, UniqueConstraint
from sqlmodel import Field, SQLModel

class Budget(SQLModel, table=True):
    __tablename__ = "budgets"

    __table_args__ = (
        UniqueConstraint("user_id", "category_id", name="uq_budget_user_category"),
    )

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    category_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey("categories.id", ondelete="CASCADE"),
            nullable=False,
            index=True,
        ),
    )
    amount: Decimal = Field(max_digits=12, decimal_places=2)