from pymongo import MongoClient
import json, os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
with open(f"{BASE_DIR}/AutoMedML/server/config.json") as config_file:
    config = json.load(config_file)
with open(f"{BASE_DIR}/AutoMedML/server/secrets.json") as secret_file:
    secrets = json.load(secret_file)

client = MongoClient(secrets["mongo_link"])
db = client[config["db_name"]]

users_collection = db[config["users_collection"]]
patients_collection = db[config["patients_collection"]]
models_collection = db[config["models_collection"]]
chats_collection = db[config["chats_collection"]]

users_collection.create_index("email", unique=True)
users_collection.create_index("verify")

patients_collection.create_index("medic_id")
patients_collection.create_index("patients_list.patient_id")

models_collection.create_index("technical_name", unique=True)
models_collection.create_index("category")

chats_collection.create_index("medic_id")
chats_collection.create_index("chats.chat_id")

print("✅ Indexes created successfully.")
