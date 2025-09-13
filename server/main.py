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

from classes import UserLogin, Patient, MessageInput
from functions import create_access_token, is_valid_email, verify_password, is_valid_password, hash_password

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
with open(f"{BASE_DIR}/AutoMedML/server/config.json") as config_file:
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

with open(f"{BASE_DIR}/AutoMedML/server/secrets.json") as secret_file:
    secrets = json.load(secret_file)

SECRET_KEY = secrets['secret_key']
SECRET_KEY_REFRESH = secrets['secret_key_refresh']
ALGORITHM = secrets['algorithm']
ALGORITHM_REFRESH = secrets['algorithm_refresh']
ACCESS_TOKEN_EXPIRE_MINUTES = secrets['access_token_expire_minutes']
REFRESH_TOKEN_EXPIRE_MINUTES = secrets['refresh_token_expire_minutes']
SAMESITE = secrets['samesite']
CODE = secrets['code']
MONGO_LINK = secrets["mongo_link"]

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
        return None

    user_id = current_user["id"]
    result = users_collection.find_one({"_id": ObjectId(user_id)})

    if not result:
        return None
    return {"name": result["name"],
            "surname": result["surname"],
            "email": result["email"],
            "verify": result["verify"]}


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
    return result["patients_list"]


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

    return all_patient_name_surname


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
        for chunk in response_text.split():
            yield chunk + " "
            await asyncio.sleep(0.2)

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
            "last_visit": datetime.now(),
            "status": patient.status
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

    return "Success!"


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
    file_location = f"{UPLOAD_DIR}/{name}_{surname}_{doc.filename}"
    with open(file_location, "wb") as f:
        f.write(await doc.read())

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
        "verify": verify
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
                            dedicated chats will be created."""
                        ,
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
        response.set_cookie(key="access_token", value=access_token, httponly=True, samesite=SAMESITE, secure=SECURE)
        response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, samesite=SAMESITE, secure=SECURE)

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
        secure=SECURE
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        samesite=SAMESITE,
        secure=SECURE
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
