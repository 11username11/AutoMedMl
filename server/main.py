import json
import os
from typing import *

from fastapi import FastAPI, Response, Depends, Cookie, Form, UploadFile, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt
from pymongo import MongoClient
from pymongo.synchronous.collection import ObjectId

from classes import UserLogin
from functions import create_access_token, is_valid_email, verify_password, is_valid_password, hash_password

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
with open(f"{BASE_DIR}/AutoMedML/server/config.json") as config_file:
    config = json.load(config_file)

FRONT_ADDRESS = config['front_address']
SECURE = config['secure']
UPLOAD_DIR = config["upload_dir"]

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

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONT_ADDRESS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_LINK = config["mongo_link"]
DB_NAME = config["db_name"]
USER_COLLECTION = config["users_collection"]
PATIENTS_COLLECTION = config["patients_collection"]
MODELS_COLLECTION = config["models_collection"]

client = MongoClient(MONGO_LINK)
db = client[DB_NAME]
users_collection = db[USER_COLLECTION]
models_collection = db[MODELS_COLLECTION]
patients_collection = db[PATIENTS_COLLECTION]


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
            if e == "Signature has expired.":
                pass
            else:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    if refresh_token:
        try:
            payload = jwt.decode(refresh_token, SECRET_KEY_REFRESH, algorithms=[ALGORITHM_REFRESH])
            id_: str = payload.get("id")
            if id_ is None:
                print('Invalid refresh token payload')
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token payload")

            new_access_token = create_access_token({"id": id_}, SECRET_KEY, ALGORITHM,
                                                   ACCESS_TOKEN_EXPIRE_MINUTES)
            response.set_cookie(key="access_token", value=new_access_token, httponly=True, samesite=SAMESITE,
                                secure=SECURE)
            return {"id": id_}
        except JWTError:
            response.delete_cookie(key="access_token")
            response.delete_cookie(key="refresh_token")
            return None
    response.delete_cookie(key="access_token")
    response.delete_cookie(key="refresh_token")
    return None


@app.get("/user_info")
async def get_user_info(current_user: dict = Depends(get_optional_user)):
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


@app.get("/get_avatar")
async def get_avatar(current_user: dict = Depends(get_optional_user)):
    return  # TODO доделать


@app.get("/chat_history/{chat}")
async def chat_history(chat: str, current_user: dict = Depends(get_optional_user)):
    return  # TODO доделать


@app.get("/patients")
async def patients(current_user: dict = Depends(get_optional_user)):
    return  # TODO: Доделать


@app.get("/patients_names")
async def patients_names(current_user: dict = Depends(get_optional_user)):
    return  # TODO: Доделать


@app.get("/send_message")
async def send_message(current_user: dict = Depends(get_optional_user)):
    return  # TODO: Доделать


@app.get("/add_patient")
async def add_patient(current_user: dict = Depends(get_optional_user)):
    return  # TODO: Доделать


@app.get("/models")
async def models(current_user: dict = Depends(get_optional_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    models_cursor = models_collection.find({})
    models_list = []
    for m in models_cursor:
        models_list.append({
            "title": m["title"],
            "technical_name": m["technical_name"],
            "category": m["category"],
            "description": m["description"],
            "accuracy": m["accuracy"],
            "processing_time": m["processing_time"],
            "supported_formats": m["supported_formats"],
            "button_text": m["button_text"]
        })
        # TODO: название иконок кидать
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
        "technical_name": model["technical_name"],
        "category": model["category"],
        "description": model["description"],
        "accuracy": model["accuracy"],
        "processing_time": model["processing_time"],
        "supported_formats": model["supported_formats"],
        "button_text": model["button_text"]
    }


@app.get("/model/{model_name}/send_data")
async def send_data_model(model_name: str, current_user: dict = Depends(get_optional_user)):
    return  # TODO: Доделать


@app.post("/registration")
async def registration(response: Response,
                       name: str = Form(...),
                       surname: str = Form(...),
                       password: str = Form(...),
                       email: str = Form(...),
                       code: str = Form(...),
                       doc: UploadFile = Form(...)):
    file_location = f"{UPLOAD_DIR}/{name}_{surname}_{doc.filename}"
    with open(file_location, "wb") as f:
        f.write(await doc.read())

    if code == CODE:
        verify = True
    else:
        verify = False

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
    access_token = create_access_token({"id": id_}, SECRET_KEY, ALGORITHM,
                                       ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token = create_access_token({"id": id_}, SECRET_KEY_REFRESH,
                                        ALGORITHM_REFRESH,
                                        REFRESH_TOKEN_EXPIRE_MINUTES)
    response.set_cookie(key="access_token", value=access_token, httponly=True, samesite=SAMESITE, secure=SECURE)
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, samesite=SAMESITE, secure=SECURE)
    return {"message": "User successfully registered"}


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

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")

    return {"message": "Account successfully deleted"}
