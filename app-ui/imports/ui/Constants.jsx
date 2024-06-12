//export const BASE_API = "http://cassatt.experiments.cs.kuleuven.be:3970"; //"http://127.0.0.1:8000";
export const BASE_API = "http://127.0.0.1:8000";


export const greenFont = "#449231";
export const redFont = "#D64242";

// DATA SUMMARY VIZ DEFAULT MODEL
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

// DATA ISSUE FRIENDLY NAMES ENG
export const DATA_ISSUE_FRIENDLY_NAMES_Eng = {
  "drift": "Data Drift",
  "imbalance": "Class Imbalance",
  "skew": "Data Skewness",
  "duplicate": "Duplicate Data",
  "outlier": "Data Outlier",
  "correlation": "Feature Correlation",
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