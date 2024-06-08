'''
All utility functions for training and inference
'''
import re
import logging
from datetime import datetime
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
import pandas as pd
import numpy as np
from constants import *
from dbconnectors import *
from evidently.metrics import DataDriftTable
from evidently.report import Report
import json
import joblib
import lightgbm as lgb


def login_service(user_name, cohort, language):
    """
    Method to relieve user details if exists
    or create a new user if doesn't exist
    """
    client, db = get_database()
    collection_name = db[USER_COLLECTION]
    user_details = collection_name.find_one({"UserName": user_name})

    # find and update last login time
    if user_details is None:
        print("Record Not Found")
        new_user = USER_DETAIL_JSON
        new_user["UserName"] = user_name
        new_user["Cohort"] = cohort
        new_user["Language"] = language
        new_user.update({"_id": user_name+cohort})
        collection_name.insert_one(new_user)
        user_details = collection_name.find_one({"UserName": user_name})
        client.close()
        autocorrect_configs = {
            "UserName": user_name,
            "Cohort": cohort,
            "AutoCorrectConfig":   {
                "outlier": False,
                "correlation": False,
                "skew": False,
                "imbalance": False,
                "drift": False,
                "duplicate": False,
            }
        }
        insert_autocorrect_configs(autocorrect_configs)
        return (True, f"New record created for user: {user_name}", user_details)
    else:
        print("Record found")
        client.close()
        return (True, f"Record found for user: {user_name}", user_details)


def key_insights_gen(user):
    """
    Method to generate insights
    """
    client, user_details = fetch_user_details(user)
    client.close()
    if user_details is None:
        return (False, f"Invalid username: {user}", user_details)

    filters, selected_features, data, labels = load_filtered_user_data(
        user_details)
    # fetch language
    lang = user_details["Language"]
    # Diabetic ratio
    xy_data = data.copy()
    xy_data[TARGET_VARIABLE] = labels
    pct_list = []
    input_list = []
    insight_list = []
    diabetic_count = len(xy_data[xy_data[TARGET_VARIABLE] == 1])
    dc_pct = np.round(100 * (diabetic_count/(len(xy_data))), 0)
    pct_list.append(dc_pct)
    if lang == "SLO":
        input_list.append("pacientov ima ")
        insight_list.append("sladkorno bolezen")
    else:
        input_list.append("Patients have ")
        insight_list.append("diabetes")
    # Zero Counts insights
    for feat in ACTIONABLE_FEATURES:
        if feat not in selected_features:
            continue  # Skip for filtered features
        zero_counts_pct = np.round(
            100 * (len(data[data[feat] == 0.0])/len(data)), 0)
        pct_list.append(zero_counts_pct)
        if lang == "SLO":
            input_list.append(f"{FRIENDLY_NAMES_SLO[feat]} ima ")
            insight_list.append("vrednost, ki je enaka nič")
        else:
            input_list.append(f"{FRIENDLY_NAMES[feat]} feature has ")
            insight_list.append("value equal to zero")
        # 90th and 10th Percentile Insights
        # Greater than
        qv = np.round(data[feat].quantile(0.9), 1)
        qvc_pct = np.round(100 * (len(data[data[feat] > qv])/len(data)), 0)
        pct_list.append(qvc_pct)
        if lang == "SLO":
            input_list.append(f"Pacientov ima {FRIENDLY_NAMES_SLO[feat]} ")
            insight_list.append(f"> {qv}")
        else:
            input_list.append(f"Patients have {FRIENDLY_NAMES[feat]} ")
            insight_list.append(f"greater than {qv}")
        # Lesser than
        qv = np.round(data[feat].quantile(0.1), 1)
        qvc_pct = np.round(100 * (len(data[data[feat] < qv])/len(data)), 0)
        pct_list.append(qvc_pct)
        if lang == "SLO":
            input_list.append(f"Pacientov ima {FRIENDLY_NAMES_SLO[feat]} ")
            insight_list.append(f"< {qv}")
        else:
            input_list.append(f"Patients have {FRIENDLY_NAMES[feat]} ")
            insight_list.append(f"lesser than {qv}")

    # Sorting in a dataframe
    ki_df = pd.DataFrame()
    ki_df['pct'] = pct_list
    ki_df['input'] = input_list
    ki_df['insight'] = insight_list
    ki_df = ki_df.sort_values(by=['pct'], ascending=False).head(4)

    insights = {
        "pct_list": ki_df['pct'].tolist(),
        "input_list": ki_df["input"].tolist(),
        "insight_list": ki_df["insight"].tolist()
    }
    return (True, f"Successful. Data summary details founde for user: {user}", insights)


def detect_drift(user):
    '''
    Method to detect class imbalance and their corrected values
    '''
    # Load user data
    client, user_details = fetch_user_details(user)
    client.close()
    if user_details is None:
        return (False, f"Invalid username: {user}", user_details)

    # Get training data
    filters, selected_features, train_data, train_labels = load_filtered_user_data(
        user_details)
    # Get test data
    test_data, test_labels = load_test_data(selected_features)

    data_drift_dataset_report = Report(metrics=[
        DataDriftTable(),
    ])
    data_drift_dataset_report.run(reference_data=train_data,
                                  current_data=test_data)

    drift_output = {}

    report_result = str(data_drift_dataset_report.json())
    report_result = json.loads(report_result)

    for metric in report_result['metrics']:
        if metric['metric'] == 'DataDriftTable':
            drift_output['overall'] = {
                "drift_score": np.round(metric['result']['share_of_drifted_columns'] * 100, 2),
                "isDrift": metric['result']['share_of_drifted_columns'] > 0.0
            }
            drift_output['features'] = metric['result']['drift_by_columns']
    for feat in drift_output['features'].keys():
        del drift_output['features'][feat]['column_name']
        del drift_output['features'][feat]['column_type']

    # Drift details
    isDrift = drift_output['overall']['isDrift']
    # Prepare output
    return (True, f"Successful. Drift information obtained for user: {user}", drift_output, isDrift)


def detect_skew(user):
    '''
    Method to detect class imbalance and their corrected values
    '''
    # Load user data
    client, user_details = fetch_user_details(user)
    client.close()
    if user_details is None:
        return (False, f"Invalid username: {user}", user_details)

    # Get training data
    filters, selected_features, train_data, train_labels = load_filtered_user_data(
        user_details)
    skewed_df = train_data.skew(axis=0, skipna=True).abs()
    # logging.error(train_data.skew(axis = 0, skipna = True))
    skewed_features = np.count_nonzero(skewed_df.values > 1)
    skew_pct = np.round(skewed_features/len(selected_features) * 100, 2)
    isSkew = skewed_features > 0
    skew_json = {
        "skew_score": skew_pct,
        "features": train_data.skew(axis=0, skipna=True).to_dict()
    }
    # Prepare output
    return (True, f"Successful. Skewness information obtained for user: {user}", skew_json, isSkew)


def detect_duplicates(user):
    '''
    Method to detect class imbalance and their corrected values
    '''
    # Load user data
    client, user_details = fetch_user_details(user)
    client.close()
    if user_details is None:
        return (False, f"Invalid username: {user}", user_details, False)

    # Get training data
    filters, selected_features, train_data, train_labels = load_filtered_user_data(
        user_details)
    isDuplicate = bool(train_data.duplicated().any())
    duplicate_features = np.count_nonzero(train_data.duplicated())
    duplicate_pct = np.round(duplicate_features/len(train_data) * 100, 2)

    duplicate_json = {
        "duplicate_score": duplicate_pct,
    }

    # Prepare output
    return (True, f"Successful. Duplicate information obtained for user: {user}", duplicate_json, isDuplicate)


def detect_correlation(user):
    '''
    Method to detect data correlation
    '''
    # Load user data
    client, user_details = fetch_user_details(user)
    client.close()
    if user_details is None:
        return (False, f"Invalid username: {user}", user_details, False)

    # Get training data
    filters, selected_features, train_data, train_labels = load_filtered_user_data(
        user_details)

    isCorrelated = False
    corr_list = []
    corr_df = train_data.corr()
    corr_df = corr_df.where(
        np.triu(np.ones(corr_df.shape), k=1).astype(np.bool))

    for ind in range(len(corr_df)):
        for col in corr_df.columns:
            if (corr_df.iloc[ind][col]) > 0.5 or (corr_df.iloc[ind][col]) < -0.5:
                corr_list.append(
                    {
                        "feature1": corr_df.index[ind],
                        "feature2": col,
                        "score": corr_df.iloc[ind][col]
                    }
                )
    if len(corr_list) > 0:
        isCorrelated = True

    # Prepare output
    output_json = {
        "corrScore": np.round(len(corr_list) * 2/len(selected_features) * 100, 2),
        "corrFeatures": corr_list
    }
    return (True, f"Successful. Feature Correlation information obtained for user: {user}", output_json, isCorrelated)

def save_interaction_data(config_data):
    """
    Method to store interaction data
    """
    interaction_detail = {
        "user": config_data.UserId,
        "cohort": config_data.Cohort,
        "viz": config_data.JsonData["viz"],
        "eventType": config_data.JsonData["eventType"],
        "description": config_data.JsonData["description"],
        "timestamp": config_data.JsonData["timestamp"],
        "duration": config_data.JsonData["duration"]
    }
    #insert_interaction_data(interaction_detail) -- Disabling interaction logs
    return (True, f"Successful. Interaction data inserted for user: {config_data.UserId}", interaction_detail)

##############################################
# New
##############################################
def load_data_model(user):
    """
    Function to load default data and models
    """

    # Return default values 
    # if new model or data not-available for the user
    default_model = joblib.load('model/default_model.joblib')
    default_train_df = pd.read_csv('data/training_data.csv')
    default_test_df = pd.read_csv('data/test_data.csv')

    return default_model, default_train_df, default_test_df

def get_system_overview(user):
    """
    # get user details
    # get current system overview
    """
    ####################################################
    # TO-DO : Fetch user details when connected to Mongo
    ####################################################
    '''
    client, user_details = fetch_user_details(user)
    client.close()
    if user_details is None:
        return (False, f"Invalid username: {user}", user_details)
    else:
        filters, selected_features, data, labels = load_filtered_user_data(
            user_details)

        prev_score = user_details["PrevScore"]
        curr_score = user_details["CurrentScore"]

        # calc score change
        score_change = 0
        if prev_score is None or prev_score == 0:
            score_change = 0
        else:
            score_change = np.ceil(curr_score) - np.ceil(prev_score)
    '''
    # Load Data
    model, train_df, test_df = load_data_model(user)
    x_train = train_df.drop([TARGET_VARIABLE],axis='columns')
    y_train = train_df.filter([TARGET_VARIABLE],axis='columns')  
    x_test = test_df.drop([TARGET_VARIABLE],axis='columns')
    y_test = test_df.filter([TARGET_VARIABLE],axis='columns') 

    output_json = {
            "Accuracy": np.round(model.score(x_test, y_test) * 100, 0),
            "NumSamples": x_train.shape[0],
            "NumFeatures": x_train.shape[1],
            "ScoreChange": 1, # fetch and change later
        }

    return (True, f"Successful. Data summary details founde for user: {user}", output_json)


def outlier_thresholds(dataframe, col_name, q1=0.05, q3=0.95):
    quartile1 = dataframe[col_name].quantile(q1)
    quartile3 = dataframe[col_name].quantile(q3)
    interquantile_range = quartile3 - quartile1
    up_limit = quartile3 + 1.5 * interquantile_range
    low_limit = quartile1 - 1.5 * interquantile_range
    # Correct Thresholds
    low_limit = max(low_limit, min(dataframe[col_name].to_list()))
    up_limit = min(up_limit,  max(dataframe[col_name].to_list()))
    # logging.error(col_name)
    # logging.error([low_limit, up_limit])
    # logging.error([NON_EXTREME_VALUES[col_name][0], NON_EXTREME_VALUES[col_name][1]])

    return low_limit, up_limit

def feature_wise_outlier(dataframe, col_name):
    low_limit, up_limit = outlier_thresholds(dataframe, col_name)
    if dataframe[(dataframe[col_name] > up_limit) | (dataframe[col_name] < low_limit)].any(axis=None):
        return (True, low_limit, up_limit)
    else:
        return (False, low_limit, up_limit)

def ComputeDataIssues(data, labels, test_data, test_labels):
    """
    Updating the data issues
    """
    # Imbalance
    diabetic_count = len(labels[labels[TARGET_VARIABLE] == 1])
    dc_pct = np.round(100 * (diabetic_count/(len(labels))), 0)
    ndc_pct = 100 - dc_pct
    imbalance_score = np.round(
        (1 - min(dc_pct, ndc_pct) / max(dc_pct, ndc_pct)) * 100, 2)

    # Duplicates
    duplicate_features = np.count_nonzero(data.duplicated())
    duplicate_pct = np.round(duplicate_features/len(data) * 100, 2)

    # Outlier
    outliers = []
    out_count = 0
    isOutlier = False
    for f in ALL_FEATURES:
        outlier_status, low_limit, up_limit = feature_wise_outlier(data, f)
        if outlier_status:
            isOutlier = True
        original_feature_values = data[f].to_list()
        # Get data after filering outliers
        corrected_feature_values = data[(data[f] >= low_limit) & (
            data[f] <= up_limit)][f].to_list()
        # Calculate outlier percentage
        out_count += len(original_feature_values) - len(corrected_feature_values)
    # Prepare output
    out_pct = np.round(100 * (out_count/len(data)), 1)
    
    # Skew
    skewed_df = data.skew(axis=0, skipna=True).abs()
    skewed_features = np.count_nonzero(skewed_df.values > 1)
    skew_pct = np.round(skewed_features/len(ALL_FEATURES) * 100, 2)
    
    # Drift
    data_drift_dataset_report = Report(metrics=[
        DataDriftTable(),
    ])
    data_drift_dataset_report.run(reference_data=data,
                                  current_data=test_data)

    report_result = str(data_drift_dataset_report.json())
    report_result = json.loads(report_result)

    for metric in report_result['metrics']:
        if metric['metric'] == 'DataDriftTable':
            drift_pct = np.round(
                metric['result']['share_of_drifted_columns'] * 100, 2)

    # Correlation
    corr_list = []
    corr_df = data.corr()
    corr_df = corr_df.where(
        np.triu(np.ones(corr_df.shape), k=1).astype(np.bool))

    for ind in range(len(corr_df)):
        for col in corr_df.columns:
            if (corr_df.iloc[ind][col]) > 0.5 or (corr_df.iloc[ind][col]) < -0.5:
                corr_list.append(
                    {
                        "feature1": corr_df.index[ind],
                        "feature2": col,
                        "score": corr_df.iloc[ind][col]
                    }
                )

    corr_pct = np.round(len(corr_list) * 2/len(ALL_FEATURES) * 100, 2)

    data_issue_impact = imbalance_score + duplicate_pct + out_pct + skew_pct + drift_pct + corr_pct
    
    quality_score = np.round((100 - (data_issue_impact/6))/100, 2)

    return quality_score, [out_pct, drift_pct, corr_pct, duplicate_pct, imbalance_score, skew_pct]

def data_quality_gen(user):
    """
    Method to estimate data quality based on data issues
    """
    ####################################################
    # TO-DO : Fetch user details when connected to Mongo
    ####################################################
    '''
    # Load user data
    client, user_details = fetch_user_details(user)
    client.close()
    if user_details is None:
        return (False, f"Invalid username: {user}", user_details)
    '''
    model, train_df, test_df = load_data_model(user)
    x_train = train_df.drop([TARGET_VARIABLE],axis='columns')
    y_train = train_df.filter([TARGET_VARIABLE],axis='columns')  
    x_test = test_df.drop([TARGET_VARIABLE],axis='columns')
    y_test = test_df.filter([TARGET_VARIABLE],axis='columns') 

    quality_score, issue_scores = ComputeDataIssues(x_train, y_train, x_test, y_test)
    
    quality_class = "Poor"

    if quality_score > 0.80:
        quality_class = "Good"
    elif quality_score > 0.50:
        quality_class = "Moderate"

    sorted_data_issues = [x for _,x in sorted(zip(issue_scores,DATA_ISSUES), reverse=True)]
    sorted_issue_vals = sorted(issue_scores,reverse=True)
    
    output_json = {
        "score": quality_score,
        "quality_class": quality_class,
        "issues": sorted_data_issues,
        "issue_val": sorted_issue_vals
    }

    return (True, f"Successful. Data quality information obtained for user: {user}", output_json)

def calculate_representation_bias(feature, thres_cr):
    """
    Calculates Representation Bias for a predictor variable
    """
    r_df = feature.value_counts().rename_axis('categories').reset_index(name='counts')
    r_df['RR'] = (r_df['counts']/ r_df['counts'].max())*100    
    average_rr = r_df['RR'].mean()

    cov_rate = (len(r_df[r_df['counts'] >= thres_cr])/len(r_df)) * 100
    
    return r_df.to_dict(), average_rr, cov_rate


def transform_data(data, feature, bins_labels):
    """
    Bin continuous data using this functions
    """
    df = pd.DataFrame()
    df[feature] = pd.cut(data[feature], 
                         bins=bins_labels["bins"], 
                         labels=bins_labels["labels"], 
                         include_lowest=True,
                         right=True)
    return df

def BiasDetector(data_features, labels, model, thres_cr):
    """
    Detect Representation Bias and it's impact
    """
    # Copy DF for categorical data
    transformed_data = data_features[CATEGORICAL].copy()
    transformed_data[TARGET_VARIABLE] = labels.copy()

    # Define Bins and Labels for cont. data
    # Transform cont. to binned data
    for feature in CONTINUOUS:
        transformed_data[feature] = transform_data(data_features, feature, CONT_BINS_LABELS[feature])
    # Calculate RR for each variable
    rb_dict = {}
    sum_rr = 0
    sum_cr = 0
    for feature in ALL_FEATURES:
        rr, rr_avg, cov_rate = calculate_representation_bias(transformed_data[feature], thres_cr)
        sum_rr += rr_avg
        rb_dict[feature] = rr
        rb_dict[feature]['avg_rr'] = rr_avg
        rb_dict[feature]['cr'] = cov_rate
        sum_cr += cov_rate
    # Calculate Overall RR
    overall_rr = sum_rr / len(ALL_FEATURES)
    overall_cr = sum_cr / len(ALL_FEATURES)

    return rb_dict, overall_rr, overall_cr

def data_bias_explorer(user):
    """
    Method to estimate data quality based on data issues
    """
    ####################################################
    # TO-DO : Fetch user details when connected to Mongo
    ####################################################
    '''
    # Load user data
    client, user_details = fetch_user_details(user)
    client.close()
    if user_details is None:
        return (False, f"Invalid username: {user}", user_details)
    '''
    model, train_df, test_df = load_data_model(user)
    x_train = train_df.drop([TARGET_VARIABLE],axis='columns')
    y_train = train_df.filter([TARGET_VARIABLE],axis='columns') 
    thres_rr = 80 # TO-DO Get from Mongo API
    thres_cr = 300 # TO-DO Get from Mongo API
    key_insights = {} # Prepare from function
    feature_info, overall_rr, overall_cr = BiasDetector(x_train, y_train, model, thres_cr)

    output_json = {
        "overall_rr" : overall_rr,
        "threshold_rr" : thres_rr,
        "overall_cr" : overall_cr,
        "threshold_cr" : thres_cr,
        "feature_info": feature_info,
        "key_insights": key_insights
    }

    return (True, f"Successful. Data explorer information obtained for user: {user}", output_json)