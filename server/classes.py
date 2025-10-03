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