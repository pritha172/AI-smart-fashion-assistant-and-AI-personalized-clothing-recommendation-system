from pydantic import BaseModel


class UserCreate(BaseModel):

    name: str
    email: str
    password: str
    gender: str


class UserLogin(BaseModel):

    email: str
    password: str