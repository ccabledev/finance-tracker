from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import UniqueConstraint
from sqlmodel import Field, SQLModel


class Category(SQLModel, table=True):
    __tablename__ = "categories"
    __table_args__ = (
        UniqueConstraint("user_id", "name", name="uq_categories_user_id_name"),
    )

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=100)
    user_id: int = Field(foreign_key="users.id", index=True)
    created_at: datetime = Field(
    default_factory=lambda: datetime.now(timezone.utc)
    )