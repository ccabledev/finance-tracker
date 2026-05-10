from datetime import datetime

from pydantic import BaseModel, Field


class CategoryCreate(BaseModel):
    """Data the client sends to create a category."""
    name: str = Field(min_length=1, max_length=100)


class CategoryRead(BaseModel):
    """Data we send back about a category."""
    id: int
    name: str
    created_at: datetime

    model_config = {"from_attributes": True}