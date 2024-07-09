//export const BASE_API = "http://cassatt.experiments.cs.kuleuven.be:3970"; //"http://127.0.0.1:8000";
export const BASE_API = "http://127.0.0.1:8000";


export const greenFont = "#449231";
export const redFont = "#D64242";

// ALL FEATURES
export const ALL_FEATURES = ["Age", "Gender", "BMI",
  "SBP", "DBP", "FPG", "Chol",
  "Tri", "HDL", "LDL", "ALT",
  "BUN", "CCR", "FFPG", "smoking",
  "drinking", "family_history"];


// AUGMENTATION VARIABLES DEFAULT MODEL
export const AUGMENT_VARIABLES = {
  "Age": {
    "type": "numerical",
    "options": ["Below 30", "30-45", "46-60", "Above 60"]
  },
  "Gender": {
    "type": "categorical",
    "options": ["Male", "Female"]
  },
  "BMI": {
    "type": "numerical",
    "options": ["Below 18", "18-25", "26-35", "Above 35"]
  },
  "SBP": {
    "type": "numerical",
    "options": ["Below 100", "100-130", "130-160", "Above 160"]
  },
  "DBP": {
    "type": "numerical",
    "options": ["Below 70", "70-90", "90-120", "Above 120"]
  },
  "FPG": {
    "type": "numerical",
    "options": ["Below 4", "4-6", "6-10"]
  },
  "Chol": {
    "type": "numerical",
    "options": ["Below 5", "5-6.5", "Above 6.5"]
  },
  "Tri": {
    "type": "numerical",
    "options": ["Below 1.6", "1.6-2.25", "Above 2.25"]
  },
  "HDL": {
    "type": "numerical",
    "options": ["Below 1", "1-1.5", "Above 1.5"]
  },
  "LDL": {
    "type": "numerical",
    "options": ["Below 3", "3-4", "Above 4"]
  },
  "ALT": {
    "type": "numerical",
    "options": ["Below 10", "10-130", "Above 130"]
  },
  "BUN": {
    "type": "numerical",
    "options": ["Below 2.5", "2.5-10.5", "Above 10.5"]
  },
  "CCR": {
    "type": "numerical",
    "options": ["Below 40", "40-90", "Above 90"]
  },
  "FFPG": {
    "type": "numerical",
    "options": ["Below 4", "4-6", "6-10", "Above 10"]
  },
  "smoking": {
    "type": "categorical",
    "options": ["Current Smoker", "Ever Smoker", "Never Smoker"]
  },
  "drinking": {
    "type": "categorical",
    "options": ["Current Drinker", "Ever Drinker", "Never Drinker"]
  },
  "family_history": {
    "type": "categorical",
    "options": ["Yes", "No"]
  },
}

// INVERSE ENCODING FOR NUMERICAL VALUES
export const INV_CONT_BIN_DICT = {
  "Age": {
    "Below 30": {
      "low": 20,
      "up": 29
    },
    "30-45": {
      "low": 30,
      "up": 45
    },
    "46-60": {
      "low": 46,
      "up": 60
    },
    "Above 60": {
      "low": 60,
      "up": 85
    }
  },
  "BMI": {
    "Below 18": {
      "low": 15,
      "up": 18
    },
    "18-25": {
      "low": 18,
      "up": 25
    },
    "26-35": {
      "low": 26,
      "up": 35
    },
    "Above 35": {
      "low": 35,
      "up": 45
    },
  },
  "SBP": {
    "Below 100": {
      "low": 80,
      "up": 100
    },
    "100-130": {
      "low": 100,
      "up": 130
    },
    "130-160": {
      "low": 130,
      "up": 160
    },
    "Above 160": {
      "low": 160,
      "up": 200
    },
  },
  "DBP": {
    "Below 70": {
      "low": 60,
      "up": 70
    },
    "70-90": {
      "low": 70,
      "up": 90
    },
    "90-120": {
      "low": 90,
      "up": 120
    },
    "Above 120": {
      "low": 120,
      "up": 130
    },
  },
  "FPG": {
    "Below 4": {
      "low": 2,
      "up": 4
    },
    "4-6": {
      "low": 4,
      "up": 6
    },
    "6-10": {
      "low": 6,
      "up": 10
    },
  },
  "FFPG": {
    "Below 4": {
      "low": 2,
      "up": 4
    },
    "4-6": {
      "low": 4,
      "up": 6
    },
    "6-10": {
      "low": 6,
      "up": 10
    },
    "Above 10": {
      "low": 10,
      "up": 20
    },
  },
  "Chol": {
    "Below 5": {
      "low": 2,
      "up": 4
    },
    "5-6.5": {
      "low": 5,
      "up": 6
    },
    "Above 6.5": {
      "low": 7,
      "up": 10
    },
  },
  "LDL": {
    "Below 3": {
      "low": 1,
      "up": 3
    },
    "3-4": {
      "low": 3,
      "up": 4
    },
    "Above 4": {
      "low": 4,
      "up": 8
    },
  },
  "HDL": {
    "Below 1": {
      "low": 0,
      "up": 1
    },
    "1-1.5": {
      "low": 1,
      "up": 2
    },
    "Above 1.5": {
      "low": 2,
      "up": 4
    },
  },
  "Tri": {
    "Below 1.6": {
      "low": 0,
      "up": 1
    },
    "1.6-2.25": {
      "low": 1,
      "up": 2
    },
    "Above 2.25": {
      "low": 2,
      "up": 5
    },
  },
  "ALT": {
    "Below 10": {
      "low": 0,
      "up": 10
    },
    "10-130": {
      "low": 10,
      "up": 130
    },
    "Above 130": {
      "low": 130,
      "up": 200
    },
  },
  "BUN": {
    "Below 2.5": {
      "low": 0,
      "up": 2
    },
    "2.5-10.5": {
      "low": 3,
      "up": 10
    },
    "Above 10.5": {
      "low": 10,
      "up": 15
    },
  },
  "CCR": {
    "Below 40": {
      "low": 0,
      "up": 40
    },
    "40-90": {
      "low": 40,
      "up": 90
    },
    "Above 90": {
      "low": 90,
      "up": 130
    },
  },
}

// DATA ISSUE FRIENDLY NAMES ENG
export const DATA_ISSUE_FRIENDLY_NAMES_Eng = {
  "drift": "Data Drift",
  "imbalance": "Class Imbalance",
  "skew": "Data Skewness",
  "duplicate": "Duplicate Data",
  "outlier": "Data Outlier",
  "correlation": "Feature Correlation",
}

// DATA ISSUE DESCRIPTIONS
export const DATA_ISSUE_DESC = {
  "drift": "It occurs when new data gradually changes over time, making prediction models less accurate",
  "imbalance": "It occurs when some categories have much more data than others, leading to biased predictions.",
  "skew": "It occurs when data is unevenly distributed, causing prediction models to be less reliable.",
  "duplicate": "It occurs due to repeated entries that can confuse prediction models and skew results",
  "outlier": "Outliers are unusual values that can distort prediction models and reduce accuracy",
  "correlation": "It means some of predictor variables are closely related, which can mislead prediction models",
}


// FRIENDLY NAMES
export const FRIENDLY_NAMES_ENG = {
  "Age": "AGE",
  "Gender": "GENDER",
  "BMI": "Body Mass Index",
  "SBP": "Systolic Blood Pressure",
  "DBP": "Diastolic Blood Pressure",
  "FPG": "Fasting Plasma Glucose",
  "Chol": "Cholesterol",
  "Tri": "Triglyceride",
  "HDL": "HDL : High-Density Lipoprotein",
  "LDL": "LDL : Low-Density Lipoprotein",
  "ALT": "Alanine Aminotransferase",
  "BUN": "Blood urea nitrogen",
  "CCR": "Creatinine Clearance",
  "FFPG": "Final Fasting Plasma Glucose",
  "smoking": "Smoking Status",
  "drinking": "Drinking Status",
  "family_history": "Family History of Diabetes"
}


// VARIABLE UNITS
export const VAR_UNITS = {
  "Age": "years",
  "Gender": null,
  "BMI": null,
  "SBP": "mmHg",
  "DBP": "mmHg",
  "FPG": "mmol/L",
  "Chol": "mmol/L",
  "Tri": "mmol/L",
  "HDL": "mmol/L",
  "LDL": "mmol/L",
  "ALT": "Units/L",
  "BUN": "mmol/L",
  "CCR": "mL/sec",
  "FFPG": "mmol/L",
  "smoking": null,
  "drinking": null,
  "family_history": null
}

// VARIABLE DESC
export const VAR_DESC = {
  "Age": "Age of the patient in years",
  "Gender": "Gender of the patient",
  "BMI": "Body Mass Index of the patient",
  "SBP": "Measures pressure in arteries during heartbeats; high levels can indicate cardiovascular risk in diabetics",
  "DBP": "Measures pressure in arteries between heartbeats; elevated levels can suggest vascular complications in diabetics",
  "FPG": "Measures blood sugar levels after fasting; crucial for diagnosing and monitoring diabetes",
  "Chol": "Total cholesterol levels in blood; high levels are a risk factor for cardiovascular diseases in diabetics",
  "Tri": "Measures blood triglycerides; elevated levels are linked to insulin resistance and diabetes",
  "HDL": "Measures 'good' cholesterol; higher levels are protective against heart disease in diabetics",
  "LDL": "Measures 'bad' cholesterol; high levels increase cardiovascular risk in diabetes patients",
  "ALT": "Measures liver enzyme levels; elevated ALT can indicate liver dysfunction, common in diabetes",
  "BUN": "Measures kidney function; high BUN can signal kidney complications in diabetes",
  "CCR": "Assesses kidney function by measuring creatinine clearance rate; important for detecting diabetic nephropathy",
  "FFPG": "Measures final blood sugar levels after fasting; essential for confirming diabetes diagnosis",
  "smoking": "Indicates smoking habits; smoking exacerbates diabetes complications and cardiovascular risk",
  "drinking": "Indicates alcohol consumption; excessive drinking can affect blood sugar control and liver function in diabetics",
  "family_history": "Indicates genetic predisposition; family history is a significant risk factor for developing diabetes"
}