from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    """Data the client sends to sign up."""
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserRead(BaseModel):
    """Data we send back about a user (no password)."""
    id: int
    email: EmailStr
    created_at: datetime

    model_config = {"from_attributes": True}