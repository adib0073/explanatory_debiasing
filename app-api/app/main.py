from typing import List, Union
from fastapi import FastAPI, Query, APIRouter
from utils import *
from data_model import *
from constants import *
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
# fix ObjectId & FastApi conflict
import pydantic
from bson.objectid import ObjectId
pydantic.json.ENCODERS_BY_TYPE[ObjectId] = str

app = FastAPI()

origins = ["*"]

# Enable CORS in FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/')
def get_root():
    return {'message': 'Explanatory Debiasing API'}

@app.post("/validateusers", response_model=OutputwithPayloadDataModel)
async def validate_user(user: ValidateUserModel):

    # Call method to validate user
    code, message, output_json = login_service(user.UserId, user.Phase)

    response = {
        "StatusCode": code,
        "StatusMessage": message,
        "OutputJson": output_json
    }
    return response

@app.get("/getsystemoverview/", response_model=OutputwithPayloadDataModel)
async def GetSystemOverview(user: str):

    # Call method to get prediction chart value
    code, message, output_json = get_system_overview(user)

    response = {
        "StatusCode": code,
        "StatusMessage": message,
        "OutputJson": output_json
    }

    return response

@app.get("/getdataquality/", response_model=OutputwithPayloadDataModel)
async def GetDataQuality(user: str):
    # Call method to get data quality value for user
    code, message, output_json = data_quality_gen(user)

    response = {
        "StatusCode": code,
        "StatusMessage": message,
        "OutputJson": output_json
    }
    return response

@app.get("/getdataexplorer/", response_model=OutputwithPayloadDataModel)
async def GetDataExplorer(user: str):
    # Call method to get data quality value for user
    code, message, output_json = data_bias_explorer(user)

    response = {
        "StatusCode": code,
        "StatusMessage": message,
        "OutputJson": output_json
    }
    return response

@app.post("/postaugmentationsettings", response_model=OutputwithPayloadDataModel)
async def PostAugSettings(augcontroller_data: AugControllerDataModel):
    # Call method to restore default configurations
    code, message, output_json = generated_new_data(augcontroller_data)

    response = {
        "StatusCode": code,
        "StatusMessage": message,
        "OutputJson": output_json,
    }
    return response

@app.post("/postgenerateandretrain", response_model=OutputwithPayloadDataModel)
async def PostGenerateAndRetrain(gen_data: AugControllerDataModel):
    # Call method to restore default configurations
    code, message, output_json = generate_and_retrain(gen_data)

    response = {
        "StatusCode": code,
        "StatusMessage": message,
        "OutputJson": output_json,
    }
    return response

@app.get("/restoretodefaults/", response_model=OutputwithPayloadDataModel)
async def RestoreSystem(user: str):
    # Call method to get data quality value for user
    code, message, output_json = restore_system(user)

    response = {
        "StatusCode": code,
        "StatusMessage": message,
        "OutputJson": output_json
    }
    return response


@app.post("/biasawarenessinfo", response_model=OutputwithPayloadDataModel)
async def PostBiasAwarenessInfo(settings_data: AugControllerDataModel):
    # Call method to restore default configurations
    code, message, output_json = bias_awareness_info(settings_data)

    response = {
        "StatusCode": code,
        "StatusMessage": message,
        "OutputJson": output_json,
    }
    return response

# TO-DO: Check when used
"""
@app.post("/trackinteractions", response_model=OutputwithPayloadDataModel)
async def track_interaction(config_data: ConfigDataModel):
    # Call method to restore default configurations
    code, message, output_json = save_interaction_data(config_data)

    response = {
        "StatusCode": code,
        "StatusMessage": message,
        "OutputJson": output_json,
    }
    return response
"""