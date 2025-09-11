from pydantic import BaseModel


class UserLogin(BaseModel):
    email: str
    password: str


class Patient(BaseModel):
    name: str
    surname: str
    email: str
    phone: str
    status: str


class MessageInput(BaseModel):
    chat_id: str
    text: str
