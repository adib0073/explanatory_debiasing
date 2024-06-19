from pydantic import BaseModel
from typing import Optional, List, Union
from constants import *

class OutputDataModel(BaseModel):
    StatusCode: bool
    StatusMessage: str

class OutputwithPayloadDataModel(BaseModel):
    StatusCode: bool
    StatusMessage: str    
    OutputJson: dict = None

class AugControllerDataModel(BaseModel):
    UserId: str
    JsonData: dict = None

class GenDataModel(BaseModel):
    UserId: str
    ListData: list[dict] = None

class ValidateUserModel(BaseModel):
    UserId: str
    Cohort: str
    Language: str = "ENG"

class FeaturesToInclude(BaseModel):
    features_to_include: list[str] = ALL_FEATURES


class FeatureRanges(BaseModel):
    features_to_include: list[str] = ALL_FEATURES
    features_ranges: list[tuple] = DEFAULT_VALUES