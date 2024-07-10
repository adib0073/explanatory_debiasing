import React from 'react';
import { useRef, useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import "./AugmentationController.css"
import { InfoLogo } from '../Icons/InfoLogo.jsx';
import { Select, Table, InputNumber, message, Tooltip } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { AUGMENT_VARIABLES, FRIENDLY_NAMES_ENG, BASE_API, ALL_FEATURES, VAR_UNITS, VAR_DESC } from '../../Constants.jsx';
import axios from 'axios';

const FillGenDataTable = (responseData, setGenData) => {
    //console.log(responseData);
    let genData = [];
    for (let i = 0; i < responseData.length; i++) {
        /* Fixed Data Structure - modify if this needs to be dynamic */
        let rowdata = {}
        rowdata["key"] = i.toString();
        rowdata["conf"] = (responseData[i]["conf"] >= 0.8)
            ? 'High'
            : (responseData[i]["conf"] >= 0.65)
                ? 'Medium'
                : 'Low';
        rowdata["pred"] = (responseData[i]["pred"] == 1) ? 'Diabetic' : 'Non-diabetic';
        for (let j = 0; j < ALL_FEATURES.length; j++) {
            rowdata[ALL_FEATURES[j]] = responseData[i][ALL_FEATURES[j]]
        }
        genData.push(rowdata);
    }
    setGenData(genData);
};

const PostAugmentData = ({
    userid,
    augControllerSettings,
    setShowGDTable,
    setGenData,
    setGenDataAcc,
    setGenDataQuality
}) => {
    message.loading('Generating new data...', 5)
    axios.post(BASE_API + '/postaugmentationsettings', {
        UserId: userid,
        JsonData: augControllerSettings
    }, {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            /*"Access-Control-Allow-Origin": "*",*/
            "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT, OPTIONS",
            "Access-Control-Allow-Headers": "X-Auth-Token, Origin, Authorization, X-Requested-With, Content-Type, Accept"
        }
    }).then(function (response) {
        //console.log(response.data["OutputJson"]);
        if (response.data["StatusCode"]) {
            //console.log('data generation complete ...');
            FillGenDataTable(response.data['OutputJson']['GenDataList'], setGenData)
            setGenDataAcc(response.data['OutputJson']['PredAcc']);
            setGenDataQuality(response.data['OutputJson']['DataQuality']);
        }
        else {
            console.log("Error reported. Login failed.")
            // TO-DO: Navigate to Error Screen.
        }
    })
        .then(() => message.success('New data generated with selected settings', 1))
        .then(() => setShowGDTable(true))
        .catch(function (error) {
            console.log(error);
        });
};


export const AugmentationController = (
    {
        showGDTable,
        setShowGDTable,
        userid,
        resetFunc,
        setGenData,
        setGenDataAcc,
        setGenDataQuality,
        augTable,
        setAugTable,
        phase,
        datenow
    }) => {

    const [augSettings, setAugSettings] = useState({
        "numSamples": 100,
        "predCategory": "Both",
        "repThres": 80,
        "covThres": 300,
        "covRateThres": 80
    });

    const handleAugSetting = (settingType, value) => {
        setAugSettings({
            ...augSettings,
            [settingType]: value
        });
    }

    const handleAugTableChange = (feature, value) => {
        const updatedFeature = {
            ...augTable[feature],
            "selectedOptions": value
        }

        setAugTable({
            ...augTable,
            [feature]: updatedFeature
        });
    };

    const handleCancelButton = () => {
        // If yes - revert unsaved changes
        if (window.confirm("Do you want to revert unsaved changes?")) {

            setAugSettings({
                "numSamples": 100,
                "predCategory": "Both",
                "repThres": 80,
                "covThres": 300,
                "covRateThres": 80
            });

            setAugTable({
                "Age": {
                    "type": "numerical",
                    "selectedOptions": []
                },
                "Gender": {
                    "type": "categorical",
                    "selectedOptions": []
                },
                "BMI": {
                    "type": "numerical",
                    "selectedOptions": []
                },
                "SBP": {
                    "type": "numerical",
                    "selectedOptions": []
                },
                "DBP": {
                    "type": "numerical",
                    "selectedOptions": []
                },
                "FPG": {
                    "type": "numerical",
                    "selectedOptions": []
                },
                "Chol": {
                    "type": "numerical",
                    "selectedOptions": []
                },
                "Tri": {
                    "type": "numerical",
                    "selectedOptions": []
                },
                "HDL": {
                    "type": "numerical",
                    "selectedOptions": []
                },
                "LDL": {
                    "type": "numerical",
                    "selectedOptions": []
                },
                "ALT": {
                    "type": "numerical",
                    "selectedOptions": []
                },
                "BUN": {
                    "type": "numerical",
                    "selectedOptions": []
                },
                "CCR": {
                    "type": "numerical",
                    "selectedOptions": []
                },
                "FFPG": {
                    "type": "numerical",
                    "selectedOptions": []
                },
                "smoking": {
                    "type": "categorical",
                    "selectedOptions": []
                },
                "drinking": {
                    "type": "categorical",
                    "selectedOptions": []
                },
                "family_history": {
                    "type": "categorical",
                    "selectedOptions": []
                },
            });

            success();
        }
    };

    const [messageApi, contextHolder] = message.useMessage();
    const success = () => {
        messageApi
            .open({
                type: 'loading',
                content: 'Removing unsaved data...',
                duration: 0.5,
            })
            .then(() => resetFunc())
            .then(() => message.success('Cleared unsaved data', 1));
    };

    const handleGenButton = (value) => {
        // Merge setting objects
        let augControllerSettings = { ...augSettings }
        augControllerSettings["features"] = { ...augTable }
        // call Post API
        // If yes - revert unsaved changes
        if (window.confirm("Please confirm again to proceed.")) {
            PostAugmentData({
                userid,
                augControllerSettings,
                setShowGDTable,
                setGenData,
                setGenDataAcc,
                setGenDataQuality
            })
        }
        // Display Data
        //setShowGDTable(!showGDTable); // #TO-DO: Temporary Toggle Set
    };

    const ac_columns = [
        {
            title: 'Predictor Variable',
            dataIndex: 'feature',
            key: 'feature',
            align: "center",
            render: (_, record) => (
                <>
                    <div className='ac-inner-cell-li'>
                        <div>
                            <Tooltip
                                placement="top"
                                title={VAR_DESC[record.key]}
                                overlayStyle={{ maxWidth: '500px' }}
                            >
                                {record.feature}
                            </Tooltip>
                        </div>
                    </div>
                </>
            )
        },
        {
            title: 'Variable Type',
            dataIndex: 'type',
            key: 'type',
            hidden: true
        },
        {
            title: 'Variable Values',
            dataIndex: 'values',
            align: "center",
            key: 'values',
            render: (_, record) => (
                (record.type == "categorical")
                    ?
                    <>
                        <div className='ac-inner-cell-cat'>
                            <div>
                                <CaretRightOutlined /> &nbsp;
                            </div>

                            <div>
                                <Select
                                    mode="multiple"
                                    allowClear
                                    style={{
                                        width: '18vw',
                                    }}
                                    placeholder="Please select one or multiple options from the following:"
                                    onChange={(value) => {
                                        handleAugTableChange(feature = record.key, value = value)
                                    }}
                                    options={record.values.map((item) => ({
                                        value: item,
                                        label: item,
                                    }))}
                                />
                            </div>
                        </div>
                    </>
                    :
                    <>
                        <div className='ac-inner-cell'>
                            <div>
                                Select Range:
                            </div>
                            <div>
                                Lower Limit &nbsp;- &nbsp; <InputNumber min={0} defaultValue={record.values[0]} size='small' style={{ width: '4vw', fontSize: '1.8vh' }} />
                            </div>
                            <div>
                                Upper Limit &nbsp; - &nbsp; <InputNumber min={0} defaultValue={record.values[1]} size='small' style={{ width: '4vw', fontSize: '1.8vh' }} />
                            </div>
                        </div>
                    </>
            ),
        },
    ].filter(item => !item.hidden);

    const ac_data = []
    for (const [key, value] of Object.entries(AUGMENT_VARIABLES)) {
        ac_data.push({
            "key": key,
            "feature": (VAR_UNITS[key] == null)
                ? FRIENDLY_NAMES_ENG[key]
                : `${FRIENDLY_NAMES_ENG[key]} (${VAR_UNITS[key]})`,
            "type": 'categorical',
            "values": value["options"]
        })
    }

    return (<div className="dash-container-aug-controller">
        <div className="chart-title-box">
            <div className="chart-title">
                Augmentation Controller
            </div>
            <Tooltip
                placement="top"
                title={"This component allows to select categories or variables that require generated data."
                    + "\n You can choose categories or variables that are under-representation and generate more samples for them."
                    + "\n You can also decide the number of samples needed and alter the default thresholds for representation rate, data coverage and coverage rate."
                }
                overlayStyle={{ maxWidth: '500px' }}
            >
                <div className="chart-icons">
                    <InfoLogo />
                </div>
            </Tooltip>
        </div>
        <div className="ac-container" >
            <div className="ac-subtitle">
                Apply constraints to the generated data
            </div>
            <div className="ac-info-label">
                <div className='ac-info-label-sub'>
                    <div className='label-sub-left'>
                        <Tooltip
                            placement="top"
                            title={"Decide how many samples should be generated."}
                            overlayStyle={{ maxWidth: '500px' }}
                        >
                            Number of samples: &nbsp;
                        </Tooltip>
                        <InputNumber
                            min={0}
                            defaultValue={augSettings.numSamples}
                            onChange={(value) => {
                                handleAugSetting(settingType = "numSamples", value = value)
                            }}
                            size='small'
                            style={{ width: '4vw', fontSize: '1.8vh' }} />
                    </div>
                    <div className='label-sub-right'>
                        <Tooltip
                            placement="top"
                            title={"Do you want to generate samples for diabetic patients, non-diabetic patients or both?"}
                            overlayStyle={{ maxWidth: '500px' }}
                        >
                            Prediction category: &nbsp;
                        </Tooltip>
                        <Select
                            defaultValue={augSettings.predCategory}
                            onChange={(value) => {
                                handleAugSetting(settingType = "predCategory", value = value)
                            }}
                            options={[
                                {
                                    value: 'both',
                                    label: 'Both',
                                },
                                {
                                    value: 'diabetic',
                                    label: 'Diabetic',
                                },
                                {
                                    value: 'non-diabetic',
                                    label: 'Non-diabetic',
                                }
                            ]}
                            size='small'
                            style={{ width: '6vw', backgroundColor: '#E5E5E5', fontSize: '1.8vh' }}
                        />
                    </div>
                </div>
            </div>
            <div className="ac-info-label">
                <div className='ac-info-label-sub'>
                    <div>
                        <Tooltip
                            placement="top"
                            title={"Do you want to change the default representation rate threshold?"}
                            overlayStyle={{ maxWidth: '500px' }}
                        >
                            Representation Rate Threshold: &nbsp;
                        </Tooltip>
                        <InputNumber
                            min={0}
                            max={100}
                            defaultValue={augSettings.repThres}
                            onChange={(value) => {
                                handleAugSetting(settingType = "repThres", value = value)
                            }}
                            size='small'
                            formatter={(value) => `${value}%`}
                            parser={(value) => value?.replace('%', '')}
                            style={{ width: '4vw', fontSize: '1.8vh' }} />
                    </div>
                </div>
                <div className='ac-info-label-sub'>
                    <div>
                        <Tooltip
                            placement="top"
                            title={"Do you want to change the default data coverage threshold?"}
                            overlayStyle={{ maxWidth: '500px' }}
                        >
                            Coverage Threshold: &nbsp;
                        </Tooltip>
                        <InputNumber
                            min={0}
                            defaultValue={augSettings.covThres}
                            onChange={(value) => {
                                handleAugSetting(settingType = "covThres", value = value)
                            }}
                            size='small'
                            style={{ width: '4vw', fontSize: '1.8vh' }} />
                    </div>
                </div>
                <div className='ac-info-label-sub'>
                    <div>
                        <Tooltip
                            placement="top"
                            title={"Do you want to change the default coverage rate threshold?"}
                            overlayStyle={{ maxWidth: '500px' }}
                        >
                            Coverage Rate Threshold: &nbsp;
                        </Tooltip>
                        <InputNumber
                            min={0}
                            max={100}
                            defaultValue={augSettings.covRateThres}
                            onChange={(value) => {
                                handleAugSetting(settingType = "covRateThres", value = value)
                            }}
                            size='small'
                            formatter={(value) => `${value}%`}
                            parser={(value) => value?.replace('%', '')}
                            style={{ width: '4vw', fontSize: '1.8vh' }} />
                    </div>
                </div>
            </div>
            <div className='ac-feature-table'>
                <Table
                    columns={ac_columns}
                    dataSource={ac_data}
                    size='small'
                    bordered={true}
                    pagination={false}
                    style={
                        {
                            fontSize: "1.5vh"
                        }
                    }
                    scroll={{
                        y: "25vh",
                    }}
                />
            </div>
            <div className='ac-buttons'>
                <>
                    {contextHolder}
                    <button
                        className="cancel-button"
                        type="submit"
                        onClick={handleCancelButton}
                    >
                        Clear changes
                    </button>
                </>

                <button
                    className="train-button"
                    type="submit"
                    onClick={handleGenButton}
                >
                    Generate
                </button>
            </div>
        </div>
    </div>);
};