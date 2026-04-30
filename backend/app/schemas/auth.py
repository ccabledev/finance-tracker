from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    """Data the client sends to log in."""
    email: EmailStr
    password: str


class Token(BaseModel):
    """The access token the server returns after a successful login."""
    access_token: str
    token_type: str = "bearer"