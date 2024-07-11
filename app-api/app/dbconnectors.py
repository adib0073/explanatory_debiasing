from pymongo import MongoClient
from constants import *
import uuid


def get_database():
    # Create a connection using MongoClient.
    client = MongoClient(CONNECTION_STRING)
    # Create the database
    return client, client[DBNAME]


def fetch_user_details(user):
    client, db = get_database()
    collection_name = db[USER_COLLECTION]
    user_details = collection_name.find_one({"UserName": user})
    return client, user_details


def fetch_autocorrect_configs(user):
    client, db = get_database()
    collection_name = db[AUTOCORRECT_CONFIG]
    autocorrect_configs = collection_name.find_one({"UserName": user})
    client.close()
    if autocorrect_configs is None:
        return None
    return autocorrect_configs["AutoCorrectConfig"]


def update_user_details(user, newValues):
    client, db = get_database()
    collection_name = db[USER_COLLECTION]
    collection_name.update_one({"UserName": user}, {"$set": newValues})
    client.close()


def insert_bias_data(bias_details):
    try:
        client, db = get_database()
        collection_name = db[RB_COLLECTION]
        bias_details.update({"_id": bias_details["user"]+uuid.uuid4().hex})
        collection_name.insert_one(bias_details)
        client.close()
    except Exception as e:
        print(f"### Error: {e}")


def insert_augsettings_data(aug_details):
    try:
        client, db = get_database()
        collection_name = db[AC_COLLECTION]
        aug_details.update({"_id": aug_details["user"]+uuid.uuid4().hex})
        collection_name.insert_one(aug_details)
        client.close()
    except Exception as e:
        print(f"### Error: {e}")


def fetch_user_augsettings(user):
    try:
        client, db = get_database()
        collection_name = db[AC_COLLECTION]
        latest_record = collection_name.find({"user": user}).sort("timestamp", -1).limit(1)
        aug_settings = None
        for record in latest_record:
            aug_settings = record
        #print(aug_settings)
        return client, aug_settings
    except Exception as e:
        print(f"### Error: {e}")


def insert_interaction_data(interaction_detail):
    client, db = get_database()
    collection_name = db[INTERACT_COLLECTION]
    interaction_detail.update(
        {"_id": interaction_detail["user"]+uuid.uuid4().hex})
    collection_name.insert_one(interaction_detail)
    client.close()
