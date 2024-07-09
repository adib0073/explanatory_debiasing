from pymongo import MongoClient
import urllib.parse

# Mongo User Credentials
UNAME = urllib.parse.quote_plus("Exdeb")
PWORD = urllib.parse.quote_plus("Exdeb@1005")
# Provide the mongodb atlas url to connect python to mongodb using pymongo
CONNECTION_STRING = f"mongodb+srv://{UNAME}:{PWORD}@exdebcluster.vpp62zi.mongodb.net/?retryWrites=true&w=majority&appName=exdebcluster"
# MONGO DATABASE NAME
DBNAME = "exdeb_db" # <update_here>
# MONGO COLLECTION NAME FOR USER DETAILS
USER_COLLECTION = "user_collection" # <update_here>
RB_COLLECTION = "rep_collection" # <update_here>
AC_COLLECTION = "aug_collection" # <update_here>

ALL_FEATURES = ["Age", "Gender", "BMI", 
                "SBP", "DBP", "FPG", "Chol",
                "Tri", "HDL", "LDL", "ALT", 
                "BUN", "CCR", "FFPG", "smoking", 
                "drinking", "family_history"]

# Separating Categorical and Continuous Numerical Variables
CATEGORICAL = ['Gender','smoking', 'drinking', 'family_history']
CONTINUOUS = ['Age', 'BMI', 'SBP', 'DBP', 'FPG', 'Chol', 'Tri', 'HDL', 'LDL', 'ALT', 'BUN', 'CCR', 'FFPG']
# target variable
TARGET_VARIABLE = "Diabetes"

CONT_BINS_LABELS = {
    "Age" : {
        "bins" : [0, 30, 45, 60, 150 ],
        "labels" : ["Below 30", "30-45", "46-60", "Above 60"]
    },
    "BMI" : {
        "bins" : [0, 18, 25, 35, 60 ],
        "labels" : ["Below 18", "18-25", "26-35", "Above 35"]
    },
    "SBP" : {
        "bins" : [0, 100, 130, 160, 250 ],
        "labels" : ["Below 100", "100-130", "130-160", "Above 160"]
    },
    "DBP" : {
        "bins" : [0, 70, 90, 120, 150 ],
        "labels" : ["Below 70", "70-90", "90-120", "Above 120"]
    },
    "FPG" : {
        "bins" : [0, 4, 6, 10 ],
        "labels" : ["Below 4", "4-6", "6-10"]
    },    
    "FFPG" : {
        "bins" : [0, 4, 6, 10, 25 ],
        "labels" : ["Below 4", "4-6", "6-10", "Above 10"]
    },        
    "Chol" : {
        "bins" : [0, 5, 6.5, 15 ],
        "labels" : ["Below 5", "5-6.5", "Above 6.5"]
    },
    "LDL" : {
        "bins" : [0, 3, 4, 15 ],
        "labels" : ["Below 3", "3-4", "Above 4"]
    },
    "HDL" : {
        "bins" : [0, 1, 1.5, 10 ],
        "labels" : ["Below 1", "1-1.5", "Above 1.5"]
    },
    "Tri" : {
        "bins" : [0, 1.6, 2.25, 35 ],
        "labels" : ["Below 1.6", "1.6-2.25", "Above 2.25"]
    },
    "ALT" : {
        "bins" : [0, 10, 130, 500 ],
        "labels" : ["Below 10", "10-130", "Above 130"]
    },
    "BUN" : {
        "bins" : [0, 2.5, 10.5, 20.0 ],
        "labels" : ["Below 2.5", "2.5-10.5", "Above 10.5"]
    },
    "CCR" : {
        "bins" : [0, 40, 90, 400 ],
        "labels" : ["Below 40", "40-90", "Above 90"]
    },
}

INV_CONT_BIN_DICT = {
    "Age" : {
        "Below 30" : {
            "low": 22,
            "up" : 29
        }, 
        "30-45": {
            "low": 30,
            "up" : 45
        },  
        "46-60": {
            "low": 46,
            "up" : 60
        },  
        "Above 60": {
            "low": 60,
            "up" : 85
        }
    },
    "BMI" : {
        "Below 18": {
            "low": 15,
            "up" : 18
        }, 
        "18-25": {
            "low": 18,
            "up" : 25
        },
        "26-35": {
            "low": 26,
            "up" : 35
        }, 
        "Above 35": {
            "low": 35,
            "up" : 45
        },
    },
    "SBP" : {
        "Below 100": {
            "low": 80,
            "up" : 100
        }, 
        "100-130": {
            "low": 100,
            "up" : 130
        }, 
        "130-160": {
            "low": 130,
            "up" : 160
        }, 
        "Above 160": {
            "low": 160,
            "up" : 200
        },
    },
    "DBP" : {
        "Below 70": {
            "low": 60,
            "up" : 70
        }, 
        "70-90": {
            "low": 70,
            "up" : 90
        },
        "90-120": {
            "low": 90,
            "up" : 120
        }, 
        "Above 120": {
            "low": 120,
            "up" : 130
        },
    },
    "FPG" : {
        "Below 4": {
            "low": 2,
            "up" : 4
        }, 
        "4-6": {
            "low": 4,
            "up" : 6
        },
        "6-10": {
            "low": 6,
            "up" : 10
        },
    },    
    "FFPG" : {
        "Below 4": {
            "low": 2,
            "up" : 4
        }, 
        "4-6": {
            "low": 4,
            "up" : 6
        }, 
        "6-10": {
            "low": 6,
            "up" : 10
        }, 
        "Above 10": {
            "low": 10,
            "up" : 20
        },
    },        
    "Chol" : {
        "Below 5": {
            "low": 2,
            "up" : 4
        }, 
        "5-6.5": {
            "low": 5,
            "up" : 6
        }, 
        "Above 6.5": {
            "low": 7,
            "up" : 10
        },
    },
    "LDL" : {
        "Below 3": {
            "low": 1,
            "up" : 3
        }, 
        "3-4": {
            "low": 3,
            "up" : 4
        }, 
        "Above 4": {
            "low": 4,
            "up" : 8
        },
    },
    "HDL" : {
        "Below 1": {
            "low": 0,
            "up" : 1
        }, 
        "1-1.5": {
            "low": 1,
            "up" : 2
        }, 
        "Above 1.5": {
            "low": 2,
            "up" : 4
        },
    },
    "Tri" : {
        "Below 1.6": {
            "low": 0,
            "up" : 1
        }, 
        "1.6-2.25": {
            "low": 1,
            "up" : 2
        }, 
        "Above 2.25": {
            "low": 2,
            "up" : 5
        },
    },
    "ALT" : {
        "Below 10": {
            "low": 0,
            "up" : 10
        }, 
        "10-130": {
            "low": 10,
            "up" : 130
        }, 
        "Above 130": {
            "low": 130,
            "up" : 200
        },
    },
    "BUN" : {
        "Below 2.5": {
            "low": 0,
            "up" : 2
        }, 
        "2.5-10.5": {
            "low": 3,
            "up" : 10
        }, 
        "Above 10.5": {
            "low": 10,
            "up" : 15
        },
    },
    "CCR" : {
        "Below 40": {
            "low": 0,
            "up" : 40
        }, 
        "40-90": {
            "low": 40,
            "up" : 90
        }, 
        "Above 90": {
            "low": 90,
            "up" : 130
        },
    },
}

INV_LABEL_ENCODING_DICT = {
    "Gender" : {
        "Male" : 1,
        "Female" : 2
    },
    "smoking" : {
        "Current Smoker" : 1,
        "Ever Smoker" : 2,
        "Never Smoker" : 3
    },
    "drinking" : {
        "Current Drinker" : 1,
        "Ever Drinker" : 2,
        "Never Drinker" : 3
    },
    "family_history" : {
        "Yes" : 1,
        "No" : 0
    },
    TARGET_VARIABLE : {
        "Non-diabetic" : 0,
        "Diabetic" : 1
    }
}

SORTING_ORDER = {
    "Age" : {
        "labels" : ["Below 30", "30-45", "46-60", "Above 60"]
    },
    "BMI" : {
        "labels" : ["Below 18", "18-25", "26-35", "Above 35"]
    },
    "SBP" : {
        "labels" : ["Below 100", "100-130", "130-160", "Above 160"]
    },
    "DBP" : {
        "labels" : ["Below 70", "70-90", "90-120", "Above 120"]
    },
    "FPG" : {
        "labels" : ["Below 4", "4-6", "6-10"]
    },    
    "FFPG" : {
        "labels" : ["Below 4", "4-6", "6-10", "Above 10"]
    },        
    "Chol" : {
        "labels" : ["Below 5", "5-6.5", "Above 6.5"]
    },
    "LDL" : {
        "labels" : ["Below 3", "3-4", "Above 4"]
    },
    "HDL" : {
        "labels" : ["Below 1", "1-1.5", "Above 1.5"]
    },
    "Tri" : {
        "labels" : ["Below 1.6", "1.6-2.25", "Above 2.25"]
    },
    "ALT" : {
        "labels" : ["Below 10", "10-130", "Above 130"]
    },
    "BUN" : {
        "labels" : ["Below 2.5", "2.5-10.5", "Above 10.5"]
    },
    "CCR" : {
        "labels" : ["Below 40", "40-90", "Above 90"]
    },
    "Gender" : {
        "labels": ["Male", "Female"]
    },
    "smoking" : {
        "labels": ["Current Smoker", "Ever Smoker", "Never Smoker"]
    },
    "drinking" : {
        "labels": ["Current Drinker", "Ever Drinker", "Never Drinker"]
    },
    "family_history" : {
        "labels": ["Yes", "No"]
    }
}

# User Detail Template
USER_DETAIL_JSON = {
    "UserName": None,
    "Phase": None,
    "CurrentAcc": 93,
    "PrevAcc": 0,
    "TrainAcc": 93,
    "DataQuality": 75
}

DATA_ISSUES = ["outlier", "drift", "correlation", "duplicate", "imbalance", "skew"]

# FRIENDLY NAMES
FRIENDLY_NAMES = {
    "Pregnancies": "Number of Pregnancies",
    "Glucose": "Plasma Glucose Concentration",
    "BloodPressure": "Diastolic Blood Pressure",
    "SkinThickness": "Triceps skinfold thickness",
    "Insulin": "Two-hour Serum Insulin",
    "BMI": "Body Mass Index",
    "DiabetesPedigreeFunction": "Diabetes Pedigree Function",
    "Age": "Age"
}

