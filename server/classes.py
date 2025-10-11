from pydantic import BaseModel
from typing import Optional

class UserLogin(BaseModel):
    email: str
    password: str


class Patient(BaseModel):
    name: str
    surname: str
    email: str
    phone: str
    status: str
    date_of_birth: str
    gender: str


class MessageInput(BaseModel):
    chat_id: str
    text: str


class DeletePatientData(BaseModel):
    patient_id: str


class UpdatePatient(BaseModel):
    patient_id: str
    name: str
    surname: str
    email: str
    phone: str
    status: str
    date_of_birth: str
    gender: str


class UpdateUser(BaseModel):
    name: Optional[str] = None
    surname: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
