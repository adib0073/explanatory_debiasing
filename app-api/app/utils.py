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
import sdv
from sdv.metadata import SingleTableMetadata
from sdv.lite import SingleTablePreset
from sdv.sampling import Condition


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

def calculate_representation_bias(feature, sorting_order, thres_cr):
    """
    Calculates Representation Bias for a predictor variable
    """
    r_df = feature.value_counts()[sorting_order].rename_axis('categories').reset_index(name='counts')
    r_df['RR'] = np.round((r_df['counts']/ r_df['counts'].max())*100)
    
    average_rr = np.round(r_df['RR'].mean())
    cov_rate = np.round((len(r_df[r_df['counts'] >= thres_cr])/len(r_df)) * 100)
    
    return r_df.to_dict(), average_rr, cov_rate


def calculate_acc_impacts(data, feature_name, model, orig_data):
    """
    Calculates the category wise accuracy impacts
    """
    nd_score_list = []
    d_score_list = []
    for category in list(data[feature_name].unique()):
        # Non-diabetic
        df = data[(data[feature_name] == category) & (data[TARGET_VARIABLE] == 0)]
        nd_score = 0
        if(len(df) > 0):
            nd_score = np.round((model.score(orig_data.loc[df.index], df[TARGET_VARIABLE]) * 100), 2)
        nd_score_list.append(nd_score)
        # Diabetic
        df = data[(data[feature_name] == category) & (data[TARGET_VARIABLE] == 1)]
        d_score = 0
        if(len(df) > 0):
            d_score = np.round((model.score(orig_data.loc[df.index], df[TARGET_VARIABLE]) * 100), 2)
        d_score_list.append(d_score)

    return d_score_list, nd_score_list

def calculate_key_insights(rr, thres_rr, thres_cr, d_acc, nd_acc):
    """
    Function to calculate key insights
    """
    insights_list = []

    # Min RR
    res = {rr["categories"][key]:val for key,val in rr["RR"].items() if (val == min(rr["RR"].values())) and (val < thres_rr)}
    insights_list.append(res)

    # Min Coverage
    res = {rr["categories"][key]:val for key,val in rr["counts"].items() if (val == min(rr["counts"].values())) and (val < thres_cr)}
    insights_list.append(res)

    # Min D_ACC
    insights_list.append({rr["categories"][np.argmin(d_acc, axis=0)]: min(d_acc)})

    # Min ND_ACC
    insights_list.append({rr["categories"][np.argmin(nd_acc, axis=0)]: min(nd_acc)})

    return insights_list

def group_cont_data(data, feature, bins_labels):
    """
    Bin continuous data using this functions
    """
    df = pd.DataFrame()
    df[feature] = pd.cut(data[feature], 
                         bins=bins_labels["bins"], 
                         labels=bins_labels["labels"], 
                         include_lowest=True,
                         right=True,
                         ordered=False)
    return df

def inv_label_encoding(encoded_list, label_encoding_dict):
    """
    Function to convert integer encodings to string
    """
    # Create a reverse dictionary to map encoded values to original labels
    reverse_encoding_dict = {v: k for k, v in label_encoding_dict.items()}
    # Use the reverse dictionary to decode the labels
    original_labels = [reverse_encoding_dict[encoded_label] for encoded_label in encoded_list]
    return original_labels

def BiasDetector(data_features, labels, model, thres_rr, thres_cr, test_features, test_labels):
    """
    Detect Representation Bias and it's impact
    """

    transformed_data = labels.copy()
    transformed_test_data = test_labels.copy()

    # Perform Inverse Label Encoding for Categorical values
    for feature in CATEGORICAL:
        transformed_data[feature] = inv_label_encoding(list(data_features[feature].values), INV_LABEL_ENCODING_DICT[feature])
        transformed_test_data[feature] = inv_label_encoding(list(test_features[feature].values), INV_LABEL_ENCODING_DICT[feature])        
    # Define Bins and Labels for cont. data
    # Transform cont. to binned data
    for feature in CONTINUOUS:
        transformed_data[feature] = group_cont_data(data_features, feature, CONT_BINS_LABELS[feature])
        transformed_test_data[feature] = group_cont_data(test_features, feature, CONT_BINS_LABELS[feature])
    # Calculate RR for each variable
    rb_dict = {}
    sum_rr = 0
    sum_cr = 0
    for feature in ALL_FEATURES:
        rr, rr_avg, cov_rate = calculate_representation_bias(
            transformed_data[feature], 
            SORTING_ORDER[feature]['labels'], 
            thres_cr)
        sum_rr += rr_avg
        rb_dict[feature] = rr
        rb_dict[feature]['avg_rr'] = rr_avg
        rb_dict[feature]['cr'] = cov_rate
        sum_cr += cov_rate
        # Measuring the accuracy impacts
        d_acc, nd_acc = calculate_acc_impacts(transformed_test_data, feature, model, test_features)
        rb_dict[feature]['d_acc'] = nd_acc
        rb_dict[feature]['nd_acc'] = d_acc
        rb_dict[feature]['key_insights'] = calculate_key_insights(rr, thres_rr, thres_cr, d_acc, nd_acc)

    # Calculate Overall RR
    overall_rr = np.round(sum_rr / len(ALL_FEATURES))
    overall_cr = np.round(sum_cr / len(ALL_FEATURES))

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

    x_test = test_df.drop([TARGET_VARIABLE],axis='columns')
    y_test = test_df.filter([TARGET_VARIABLE],axis='columns') 

    thres_rr = 80 # TO-DO Get from Mongo API
    thres_cov = 300 # TO-DO Get from Mongo API
    thres_cr = 80 # TO-DO Get from Mongo API
    thres_acc = 80 # TO-DO Get from Mongo API

    feature_info, overall_rr, overall_cr = BiasDetector(x_train, y_train, model, thres_rr, thres_cov, x_test, y_test)

    output_json = {
        "overall_rr" : overall_rr,
        "threshold_rr" : thres_rr,
        "overall_cr" : overall_cr,
        "threshold_cr" : thres_cr,
        "feature_info": feature_info,
        "threshold_cov" : thres_cov,
        "acc_threshold" : thres_acc,
    }

    return (True, f"Successful. Data explorer information obtained for user: {user}", output_json)


def numerical_sampling_conditions(condition_list, key):
    """
    Function to generate constraints for numerical variables
    """
    processed_conditions = []
    for item in condition_list:
        processed_conditions.append(list(range(INV_CONT_BIN_DICT[key][item]["low"], INV_CONT_BIN_DICT[key][item]["up"])))
    return processed_conditions 


def categorical_sampling_conditions(condition_list, key):
    """
    # Define function to generate constraints for categorical variables
    """
    processed_conditions = []
    for item in condition_list:
        processed_conditions.append(INV_LABEL_ENCODING_DICT[key][item])
        
    return processed_conditions

def generate_new_conditions(conds_dict):
    """
    Generate Conditions Dictionary based on constraints
    """
    set_conditions = {}
    for key, val in conds_dict.items():
        if(len(val) == 0):
            continue
        if all(isinstance(i, list) for i in val):
            flattened_array = np.array([item for sublist in val for item in sublist])
            set_conditions[key] = np.random.choice(flattened_array)
        else:
            set_conditions[key] = np.random.choice(val)  
    
    return set_conditions

def new_sythetic_data(training_data, metadata, GROUP_SIZE, set_condiions):
    synthesizer = SingleTablePreset(metadata, name='FAST_ML')
    synthesizer.fit(training_data)
    
    conditions = Condition(
        num_rows= GROUP_SIZE,
        column_values= set_condiions #right now generating with a range of values is not permitted
    )
    synthetic_data = synthesizer.sample_from_conditions(
        conditions=[conditions],
    )
    
    return synthetic_data

def generated_new_data(augcontroller_data):
    """
    Method to generate new data based on controller settings
    """
    # Update Threshold scores if need
    # TO-DO

    # Prepare for generating data
    model, train_df, test_df = load_data_model(augcontroller_data.UserId)
    aug_cont_dict = augcontroller_data.JsonData

    # Load metadata from json file
    metadata = SingleTableMetadata.load_from_json(filepath='data/metadata_v1.json')
    original_data = pd.DataFrame()
    dia_data = pd.DataFrame()
    non_dia_data = pd.DataFrame()

    # Sample based on selection
    # Do not use prediction class for generation
    # For category both generate a balanced but separate sample for both categories
    if(aug_cont_dict["predCategory"] == "diabetic"):
        original_data = train_df[train_df[TARGET_VARIABLE] == 1][ALL_FEATURES].copy()
    elif(aug_cont_dict["predCategory"] == "non-diabetic"):
        original_data = train_df[train_df[TARGET_VARIABLE] == 0][ALL_FEATURES].copy()
    else:
        dia_data = train_df[train_df[TARGET_VARIABLE] == 1][ALL_FEATURES].copy()
        non_dia_data = train_df[train_df[TARGET_VARIABLE] == 0][ALL_FEATURES].copy()

    # Get constraint values
    # Find total number of conditions
    num_conds = 0
    conds_dict = {}
    for key, val in aug_cont_dict["features"].items():
        num_conds += len(val["selectedOptions"])
        if val['type'] == 'categorical':
            conds_dict[key] = categorical_sampling_conditions(val['selectedOptions'], key)
        if val['type'] == 'numerical':
            conds_dict[key] = numerical_sampling_conditions(val['selectedOptions'], key)

    # Generate for either diabetic or non-diabetic category or both
    GROUP_SIZE = 50
    NUM_ROWS = aug_cont_dict["numSamples"]
    gen_data_df = pd.DataFrame()

    if(aug_cont_dict["predCategory"] == "both" or aug_cont_dict["predCategory"] == "Both"):
        GROUP_SIZE = GROUP_SIZE//2
        NUM_ROWS = NUM_ROWS//2
        num_iters = int(NUM_ROWS / GROUP_SIZE)
        num_remains = NUM_ROWS % GROUP_SIZE
        
        for i in range(num_iters):
            ## For diabetics group
            set_conditions = generate_new_conditions(conds_dict)
            try:
                # generate new data
                subset_gen_df = new_sythetic_data(dia_data, metadata, GROUP_SIZE, set_conditions)
                # generate predictions
                predictions = model.predict(subset_gen_df[ALL_FEATURES])
                subset_gen_df["pred"] = predictions
                # generate confidence level
                subset_gen_df["conf"] = np.amax(model.predict_proba(subset_gen_df[ALL_FEATURES]), axis=1)
            except Exception as e:
                print(f"!!Error: {e}")
                subset_gen_df = pd.DataFrame()
            gen_data_df = pd.concat([gen_data_df, subset_gen_df], ignore_index=True)


            ## For non-diabetics group
            set_conditions = generate_new_conditions(conds_dict)
            try:
                # generate new data
                subset_gen_df = new_sythetic_data(non_dia_data, metadata, GROUP_SIZE, set_conditions)
                # generate predictions
                predictions = model.predict(subset_gen_df[ALL_FEATURES])
                subset_gen_df["pred"] = predictions
                # generate confidence level
                subset_gen_df["conf"] = np.amax(model.predict_proba(subset_gen_df[ALL_FEATURES]), axis=1)
            except Exception as e:
                print(f"!!Error: {e}")
                subset_gen_df = pd.DataFrame()
            gen_data_df = pd.concat([gen_data_df, subset_gen_df], ignore_index=True)

        if(num_remains > 0):
            ## For diabetics group
            set_conditions = generate_new_conditions(conds_dict)
            try:
                # generate new data
                subset_gen_df = new_sythetic_data(dia_data, metadata, GROUP_SIZE, set_conditions)
                # generate predictions
                predictions = model.predict(subset_gen_df[ALL_FEATURES])
                subset_gen_df["pred"] = predictions
                # generate confidence level
                subset_gen_df["conf"] = np.amax(model.predict_proba(subset_gen_df[ALL_FEATURES]), axis=1)
            except Exception as e:
                print(f"!!Error: {e}")
                subset_gen_df = pd.DataFrame()
            gen_data_df = pd.concat([gen_data_df, subset_gen_df], ignore_index=True)


            ## For non-diabetics group
            set_conditions = generate_new_conditions(conds_dict)
            try:
                # generate new data
                subset_gen_df = new_sythetic_data(non_dia_data, metadata, GROUP_SIZE, set_conditions)
                # generate predictions
                predictions = model.predict(subset_gen_df[ALL_FEATURES])
                subset_gen_df["pred"] = predictions
                # generate confidence level
                subset_gen_df["conf"] = np.amax(model.predict_proba(subset_gen_df[ALL_FEATURES]), axis=1)
            except Exception as e:
                print(f"!!Error: {e}")
                subset_gen_df = pd.DataFrame()
            gen_data_df = pd.concat([gen_data_df, subset_gen_df], ignore_index=True)

    else: 
        # Generate Data with constraints
        num_iters = int(NUM_ROWS / GROUP_SIZE)
        num_remains = NUM_ROWS % GROUP_SIZE
        for i in range(num_iters):
            set_conditions = generate_new_conditions(conds_dict)
            try:
                # generate new data
                subset_gen_df = new_sythetic_data(original_data, metadata, GROUP_SIZE, set_conditions)
                # generate predictions
                predictions = model.predict(subset_gen_df[ALL_FEATURES])
                subset_gen_df["pred"] = predictions
                # generate confidence level
                subset_gen_df["conf"] = np.amax(model.predict_proba(subset_gen_df[ALL_FEATURES]), axis=1)
            except Exception as e:
                print(f"!!Error: {e}")
                subset_gen_df = pd.DataFrame()
            gen_data_df = pd.concat([gen_data_df, subset_gen_df], ignore_index=True)

        if(num_remains > 0):
            set_conditions = generate_new_conditions(conds_dict)
            try:
                # generate new data
                subset_gen_df = new_sythetic_data(original_data, metadata, num_remains, set_conditions)
                # generate predictions
                predictions = model.predict(subset_gen_df[ALL_FEATURES])
                subset_gen_df["pred"] = predictions
                # generate confidence level
                subset_gen_df["conf"] = np.amax(model.predict_proba(subset_gen_df[ALL_FEATURES]), axis=1)
            except Exception as e:
                print(f"!!Error: {e}")
                subset_gen_df = pd.DataFrame()
            gen_data_df = pd.concat([gen_data_df, subset_gen_df], ignore_index=True)
     

    gen_data_df = gen_data_df.round(2)

    # TO-DO: Save/Cache generated data that is not added with default data
    #################################################

    #################################################

    # Convert Categorical Data to Human Friendly Form
    for feature in CATEGORICAL:
        inverse_encodings = {v: k for k, v in INV_LABEL_ENCODING_DICT[feature].items()}
        gen_data_df[feature] = gen_data_df[feature].replace(inverse_encodings)

    # Convert DataFrame to Dict
    generated_data = {
        "GenDataList" : gen_data_df.to_dict('records')
        
    }
    #print(generated_data)
    #insert_interaction_data(interaction_detail) -- Disabling interaction logs
    return (True, f"Successful. Interaction data inserted for user: {augcontroller_data.UserId}", generated_data)