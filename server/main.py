import asyncio
import json
import os
from datetime import datetime
from typing import *

from fastapi import FastAPI, Response, Depends, Cookie, Form, UploadFile, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from jose import JWTError, jwt
from pymongo import MongoClient
from pymongo.synchronous.collection import ObjectId

from classes import UserLogin, Patient, MessageInput, DeletePatientData, UpdatePatient, UpdateUser
from functions import create_access_token, is_valid_email, verify_password, is_valid_password, hash_password

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

config_path = os.path.join(BASE_DIR, "config.json")

with open(config_path, "r", encoding="utf-8") as config_file:
    config = json.load(config_file)

FRONT_ADDRESS = config['front_address']
SECURE = config['secure']
UPLOAD_DIR = config["upload_dir"]

IMAGE_DIR = config["image_dir"]

if SECURE == "yes":
    SECURE = True
elif SECURE == "no":
    SECURE = False
else:
    SECURE = False

secrets_path = os.path.join(BASE_DIR, "secrets.json")

with open(secrets_path, "r", encoding="utf-8") as secrets_file:
    secrets = json.load(secrets_file)

SECRET_KEY = secrets['secret_key']
SECRET_KEY_REFRESH = secrets['secret_key_refresh']
ALGORITHM = secrets['algorithm']
ALGORITHM_REFRESH = secrets['algorithm_refresh']
ACCESS_TOKEN_EXPIRE_MINUTES = secrets['access_token_expire_minutes']
REFRESH_TOKEN_EXPIRE_MINUTES = secrets['refresh_token_expire_minutes']
SAMESITE = secrets['samesite']
CODE = secrets['code']
MONGO_LINK = secrets["mongo_link"]

MAX_DOC_SIZE_MB = 25

client = MongoClient(MONGO_LINK)

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

if not os.path.exists(IMAGE_DIR):
    os.makedirs(IMAGE_DIR)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONT_ADDRESS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_NAME = config["db_name"]
USER_COLLECTION = config["users_collection"]
PATIENTS_COLLECTION = config["patients_collection"]
MODELS_COLLECTION = config["models_collection"]
CHATS_COLLECTION = config["chats_collection"]

db = client[DB_NAME]
users_collection = db[USER_COLLECTION]
models_collection = db[MODELS_COLLECTION]
patients_collection = db[PATIENTS_COLLECTION]
chats_collection = db[CHATS_COLLECTION]

STATUS_PATIENTS_LIST = ["Active Treatment", "Recovered", "Deceased"]


async def get_optional_user(
        response: Response,
        access_token: Optional[str] = Cookie(None),
        refresh_token: Optional[str] = Cookie(None)) -> Optional[dict]:
    if access_token:
        try:
            payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
            id_: str = payload.get("id")
            if id_ is None:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
            return {"id": id_}
        except Exception as e:
            if str(e) == "Signature has expired.":
                pass
            else:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    if refresh_token:
        try:
            payload = jwt.decode(refresh_token, SECRET_KEY_REFRESH, algorithms=[ALGORITHM_REFRESH])
            id_: str = payload.get("id")
            if id_ is None:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token payload")

            new_access_token = create_access_token({"id": id_}, SECRET_KEY, ALGORITHM,
                                                   ACCESS_TOKEN_EXPIRE_MINUTES)
            response.set_cookie(key="access_token", value=new_access_token, httponly=True, samesite=SAMESITE,
                                secure=SECURE)
            return {"id": id_}
        except JWTError as e:
            response.delete_cookie(key="access_token")
            response.delete_cookie(key="refresh_token")
            return None
    response.delete_cookie(key="access_token")
    response.delete_cookie(key="refresh_token")
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")


@app.get("/")
async def home():
    return "Api status: online"


@app.get("/user_info")
async def user_info(current_user: dict = Depends(get_optional_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    user_id = current_user["id"]
    user_doc = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")

    patients_doc = patients_collection.find_one({"medic_id": user_id})
    num_of_patients = len(patients_doc.get("patients_list", [])) if patients_doc else 0

    registration_date = user_doc.get("registration_date")
    if not registration_date:
        registration_date = "Unknown"

    return {
        "name": user_doc.get("name"),
        "surname": user_doc.get("surname"),
        "email": user_doc.get("email"),
        "verify": user_doc.get("verify", False),
        "num_of_patient": num_of_patients,
        "registration_date": registration_date
    }


@app.get("/chat_history/{chat}")
async def chat_history(chat: str, current_user: dict = Depends(get_optional_user)):
    result = chats_collection.find_one({"medic_id": current_user["id"]})
    if not result:
        raise HTTPException(status_code=404, detail="Medic not found")

    chat_data = next((c for c in result.get("chats", []) if c["chat_id"] == chat), None)
    if not chat_data:
        raise HTTPException(status_code=404, detail="Chat not found")
    return {
        "chat_id": chat_data["chat_id"],
        "name": chat_data["name"],
        "messages": chat_data["messages"]
    }


@app.get("/patients")
async def patients(current_user: dict = Depends(get_optional_user)):
    result = patients_collection.find_one({"medic_id": current_user["id"]})
    return result["patients_list"][::-1]


@app.get("/patients_names")
async def patients_names(current_user: dict = Depends(get_optional_user)):
    result = patients_collection.find_one({"medic_id": current_user["id"]})
    if not result:
        raise HTTPException(status_code=404, detail="Medic not found")

    all_patient_name_surname = []
    for patient in result.get("patients_list", []):
        all_patient_name_surname.append({
            "id": patient.get("patient_id"),
            "name": patient.get("name"),
            "surname": patient.get("surname")
        })

    return all_patient_name_surname[::-1]


@app.post("/send_message")
async def send_message(
        message: MessageInput,
        current_user: dict = Depends(get_optional_user)
):
    chat_id = message.chat_id
    text = message.text

    chats_collection.update_one(
        {"medic_id": current_user["id"], "chats.chat_id": chat_id},
        {"$push": {"chats.$.messages": {
            "sender": "user",
            "text": text,
            "timestamp": datetime.now()
        }}}
    )

    # TODO: fake_stream потом переделать когда модели уже появятся, то что сейчас это чисто демонстрация
    async def fake_stream():
        response_text = f"Simulated response to: {text}\n"
        for chunk in response_text:
            yield chunk
            await asyncio.sleep(0.005)

        chats_collection.update_one(
            {"medic_id": current_user["id"], "chats.chat_id": chat_id},
            {"$push": {"chats.$.messages": {
                "sender": "system",
                "text": response_text,
                "timestamp": datetime.now()
            }}}
        )

    return StreamingResponse(fake_stream(), media_type="text/plain")


@app.post("/add_patient")
async def add_patient(
        patient: Patient,
        response: Response,
        current_user: dict = Depends(get_optional_user)
):
    if patient.status not in STATUS_PATIENTS_LIST:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Status of Patients must be: {STATUS_PATIENTS_LIST}"
        )

    try:
        new_patient_id = str(ObjectId())

        new_patient = {
            "patient_id": new_patient_id,
            "name": patient.name,
            "surname": patient.surname,
            "email": patient.email,
            "phone": patient.phone,
            "status": patient.status,
            "gender": patient.gender,
            "date_of_birth": patient.date_of_birth
        }

        result = patients_collection.update_one(
            {"medic_id": current_user["id"]},
            {"$push": {"patients_list": new_patient}}
        )

        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Medic not found")

        welcome_message = f"""This chat is dedicated to patient {patient.name} {patient.surname}.\n\n
            Here you can discuss case-specific details and use AI-powered tools 
            to assist in analyzing this patient’s medical data, such as diagnostic images, 
            clinical history, or lab results.\n\n
            ⚠️ Important notice: The outputs generated by this system are for informational 
            and educational purposes only. They do not constitute medical advice, and should not 
            be used as a substitute for your own professional judgment. You remain solely 
            responsible for all diagnoses, treatment decisions, and patient care."""

        chats_collection.update_one(
            {"medic_id": current_user["id"]},
            {
                "$push": {
                    "chats": {
                        "chat_id": new_patient_id,
                        "name": f"Chat with {patient.name} {patient.surname}",
                        "messages": [
                            {
                                "sender": "system",
                                "text": welcome_message,
                                "timestamp": datetime.now()
                            }
                        ]
                    }
                }
            }
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"message": "Patient added successfully", "patient": new_patient}


@app.get("/models")
async def models(current_user: dict = Depends(get_optional_user)):
    if not current_user:
        print("ТЫ ОПЯТЬ ЗАБЫЛ КУКИ ОТПРАВИТЬ!!!")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    models_cursor = models_collection.find({})
    models_list = []
    for model in models_cursor:
        models_list.append({
            "title": model["title"],
            "technical_name": model["technical_name"],
            "category": model["category"],
            "description": model["description"],
            "accuracy": model["accuracy"],
            "processing_time": model["processing_time"],
            "supported_formats": model["supported_formats"],
            "button_text": model["button_text"],
            "icon": model["icon"]
        })
    return models_list


@app.get("/model/{model_name}")
async def current_model(model_name: str, current_user: dict = Depends(get_optional_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    model = models_collection.find_one({"technical_name": model_name})
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    return {
        "title": model["title"],
        "category": model["category"],
        "description": model["description"],
        "accuracy": model["accuracy"],
        "processing_time": model["processing_time"],
        "supported_formats": model["supported_formats"],
        "button_text": model["button_text"],
        "icon": model["icon"]
    }


@app.post("/model/{model_name}/send_data")
async def send_data_model(response: Response, model_name: str, current_user: dict = Depends(get_optional_user),
                          image: UploadFile = Form(...)):
    file_location = f"{IMAGE_DIR}/{model_name}_{image.filename}"
    try:
        with open(file_location, "wb") as f:
            f.write(await image.read())
    except Exception as e:
        raise HTTPException(status_code=500, detail=fr"{e}")

    return {"message": "Success"}


@app.post("/registration")
async def registration(
        response: Response,
        name: str = Form(...),
        surname: str = Form(...),
        password: str = Form(...),
        email: str = Form(...),
        code: str = Form(...),
        doc: UploadFile = Form(...)
):
    allowed_extensions = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff"}

    _, ext = os.path.splitext(doc.filename.lower())
    if ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(allowed_extensions)}"
        )

    if not doc.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid MIME type: {doc.content_type}. Must be an image."
        )

    content = await doc.read()
    size_mb = len(content) / (1024 * 1024)
    if size_mb > MAX_DOC_SIZE_MB:
        raise HTTPException(
            status_code=400,
            detail=f"File too large ({size_mb:.2f} MB). Limit is {MAX_DOC_SIZE_MB} MB."
        )

    file_location = f"{UPLOAD_DIR}/{name}_{surname}_{doc.filename}"
    with open(file_location, "wb") as f:
        f.write(content)

    verify = code == CODE

    existing_email = users_collection.find_one({"email": email})
    if existing_email:
        raise HTTPException(status_code=400, detail="Username or email already registered")

    if not is_valid_password(password):
        raise HTTPException(status_code=400, detail="Bad password")

    hashed_password = hash_password(password)
    result = users_collection.insert_one({
        "name": name,
        "surname": surname,
        "email": email,
        "password": hashed_password,
        "code": code,
        "doc": file_location,
        "verify": verify,
        "registration_date": datetime.now(),
    })
    id_ = str(result.inserted_id)

    patients_collection.insert_one({
        "medic_id": id_,
        "patients_list": []
    })

    chats_collection.insert_one({
        "medic_id": id_,
        "chats": [
            {
                "chat_id": "main",
                "name": "Main consultation chat",
                "messages": [
                    {
                        "sender": "system",
                        "text":
                            """Welcome to your main consultation chat.\n\n
                            This service provides access to advanced AI models 
                            that can assist you in analyzing medical data, 
                            including patient information and diagnostic images. 
                            It is designed as a supportive tool to help you make 
                            better-informed clinical decisions.\n\n
                            ⚠️ Important notice: The outputs generated by this system 
                            are for informational and educational purposes only. 
                            They do not constitute medical advice, and should not be 
                            used as a substitute for your own professional judgment. 
                            You remain solely responsible for all diagnoses, treatment 
                            decisions, and patient care.\n\n
                            Use this chat for general consultation or discussions not 
                            linked to a specific patient. For individual patients, 
                            dedicated chats will be created.""",
                        "timestamp": datetime.now()
                    }
                ]
            }
        ]
    })

    if code == CODE:
        access_token = create_access_token({"id": id_}, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES)
        refresh_token = create_access_token({"id": id_}, SECRET_KEY_REFRESH, ALGORITHM_REFRESH,
                                            REFRESH_TOKEN_EXPIRE_MINUTES)
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            samesite=SAMESITE,
            secure=SECURE,
            expires=ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            samesite=SAMESITE,
            secure=SECURE,
            expires=REFRESH_TOKEN_EXPIRE_MINUTES * 60
        )

    return {"message": "User successfully registered", "verify": verify}


@app.post("/login")
async def login(user: UserLogin, response: Response):
    email = user.email

    if not is_valid_email(email):
        raise HTTPException(status_code=400, detail="Invalid email")

    db_user = users_collection.find_one({"email": email})
    if not db_user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    if not db_user.get("verify", False):
        raise HTTPException(status_code=403, detail="User is not verified")

    user_id = str(db_user["_id"])
    access_token = create_access_token(
        {"id": user_id},
        SECRET_KEY,
        ALGORITHM,
        ACCESS_TOKEN_EXPIRE_MINUTES
    )

    refresh_token = create_access_token(
        {"id": user_id},
        SECRET_KEY_REFRESH,
        ALGORITHM_REFRESH,
        REFRESH_TOKEN_EXPIRE_MINUTES
    )

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        samesite=SAMESITE,
        secure=SECURE,
        expires=ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        samesite=SAMESITE,
        secure=SECURE,
        expires=REFRESH_TOKEN_EXPIRE_MINUTES * 60
    )

    return {"message": "Logged in successfully"}


@app.get("/logout")
async def logout(response: Response):
    response.delete_cookie(key="access_token")
    response.delete_cookie(key="refresh_token")
    return {"message": "Logged out successfully"}


@app.get("/delete_account")
async def delete_account(
        response: Response,
        current_user: dict = Depends(get_optional_user)
):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    user_id = current_user["id"]

    result = users_collection.delete_one({"_id": ObjectId(user_id)})
    result2 = patients_collection.delete_one({"medic_id": user_id})
    result3 = chats_collection.delete_one({"medic_id": user_id})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    if result2.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Patients of user not found")

    if result3.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Chats of user not found")

    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")

    return {"message": "Account successfully deleted"}


@app.post("/delete_patient")
async def delete_patient(patient_id: DeletePatientData,
                         response: Response,
                         current_user: dict = Depends(get_optional_user)):
    user_id = current_user["id"]
    result = users_collection.find_one({"_id": ObjectId(user_id)})

    if not result:
        raise HTTPException(status_code=404, detail="User not found")

    result_patients_id = patients_collection.find_one({"medic_id": user_id})
    if not result_patients_id:
        raise HTTPException(status_code=404, detail="No Patients")

    update_result = patients_collection.update_one(
        {"medic_id": user_id},
        {"$pull": {"patients_list": {"patient_id": patient_id.patient_id}}}
    )

    if update_result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Patient not found")

    chats_collection.update_one(
        {"medic_id": user_id},
        {"$pull": {"chats": {"chat_id": patient_id.patient_id}}}
    )

    return {"message": "Patient and related chat deleted successfully"}


@app.post("/update_patient")
async def update_patient(update_patient_: UpdatePatient,
                         response: Response,
                         current_user: dict = Depends(get_optional_user)):
    user_id = current_user["id"]
    result = users_collection.find_one({"_id": ObjectId(user_id)})
    if not result:
        raise HTTPException(status_code=404, detail="User not found")

    update_result = patients_collection.update_one(
        {
            "medic_id": user_id,
            "patients_list.patient_id": update_patient_.patient_id
        },
        {
            "$set": {
                "patients_list.$.name": update_patient_.name,
                "patients_list.$.surname": update_patient_.surname,
                "patients_list.$.email": update_patient_.email,
                "patients_list.$.phone": update_patient_.phone,
                "patients_list.$.status": update_patient_.status,
                "patients_list.$.gender": update_patient_.gender,
                "patients_list.$.date_of_birth": update_patient_.date_of_birth
            }
        }
    )

    if update_result.modified_count == 0:
        raise HTTPException(status_code=228, detail="Patient not found or no changes applied")

    chats_collection.update_one(
        {
            "medic_id": user_id,
            "chats.chat_id": update_patient_.patient_id
        },
        {
            "$set": {
                "chats.$.name": f"Chat with {update_patient_.name} {update_patient_.surname}"
            }
        }
    )

    return {"message": "Patient updated successfully"}


@app.get("/patient/{patient_id}")
async def get_patient_info(patient_id: str, current_user: dict = Depends(get_optional_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    user_id = current_user["id"]

    doc = patients_collection.find_one(
        {"medic_id": user_id, "patients_list.patient_id": patient_id},
        {"patients_list": {"$elemMatch": {"patient_id": patient_id}}}
    )

    if not doc or not doc.get("patients_list"):
        raise HTTPException(status_code=404, detail="Patient not found or does not belong to this medic")

    patient_info = doc["patients_list"][0]

    return patient_info


@app.post("/change_user")
async def change_user(update_user_data: UpdateUser,
                      response: Response,
                      current_user: dict = Depends(get_optional_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    user_id = current_user["id"]
    existing_user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    update_fields = {}

    if update_user_data.name is not None:
        update_fields["name"] = update_user_data.name

    if update_user_data.surname is not None:
        update_fields["surname"] = update_user_data.surname

    if update_user_data.email is not None:
        if not is_valid_email(update_user_data.email):
            raise HTTPException(status_code=400, detail="Invalid email format")
        update_fields["email"] = update_user_data.email

    if update_user_data.password is not None:
        if not is_valid_password(update_user_data.password):
            raise HTTPException(status_code=400, detail="Weak password")
        update_fields["password"] = hash_password(update_user_data.password)

    if not update_fields:
        raise HTTPException(status_code=400, detail="No data to update")

    update_result = users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_fields}
    )

    if update_result.modified_count == 0:
        raise HTTPException(status_code=304, detail="No changes were applied")

    return {"message": "User data updated successfully"}
