import React from 'react';
import { useRef, useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import "./DataGenController.css";
import { Collapse, Select, message, Empty } from 'antd';
const { Option } = Select;
import { AUGMENT_VARIABLES, redFont } from '../../Constants';
import { SelectionBiasPlots } from './SelectionBiasPlots';
import axios from 'axios';
import { BASE_API, FRIENDLY_NAMES_ENG } from '../../Constants.jsx';

const { Panel } = Collapse;

const PostGenerateAndRetrain = ({
    userid,
    setShowGDTable,
    setShowBiasScreen,
    genData
}) => {
    message.loading('Adding generated data and retraining the system', 5)
        .then(() => setShowGDTable(false))
        .then(() => setShowBiasScreen(false))

    let payload = {
        "GenDataList": genData
    }

    axios.post(BASE_API + '/postgenerateandretrain', {
        UserId: userid,
        JsonData: payload
    }, {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT, OPTIONS",
            "Access-Control-Allow-Headers": "X-Auth-Token, Origin, Authorization, X-Requested-With, Content-Type, Accept"
        }
    }).then(function (response) {
        if (response.data["StatusCode"]) {
            // Initiate System Refresh
            // # TO-DO
            console.log('completed retraining')
        }
        else {
            console.log("Error reported. Login failed.")
            // TO-DO: Navigate to Error Screen.
        }
    })
        .then(() => message.success('New data generated with selected settings', 1))
        .then(() => window.location.reload())
        .catch(function (error) {
            console.log(error);
        });
};

const GetBiasAwarenessData = ({
    userid,
    genData,
    augTable
}) => {

    let payload = {
        "GenDataList": genData,
        "AugSettings": augTable
    }

    axios.post(BASE_API + '/biasawarenessinfo', {
        UserId: userid,
        JsonData: payload
    }, {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT, OPTIONS",
            "Access-Control-Allow-Headers": "X-Auth-Token, Origin, Authorization, X-Requested-With, Content-Type, Accept"
        }
    }).then(function (response) {
        if (response.data["StatusCode"]) {
            // Initiate System Refresh
            // # TO-DO
            console.log(response.data['OutputJson'])
        }
        else {
            console.log("Error reported. Login failed.")
            // TO-DO: Navigate to Error Screen.
        }
    }).catch(function (error) {
        console.log(error);
    });
};

export const BiasAwareness = (
    {
        userid,
        setShowGDTable,
        setShowBiasScreen,
        genData,
        augTable
    }) => {
    const handleChange = (value) => {
        console.log(`selected ${value}`);
        setVarName(value)
    };

    const handleCancelButton = (value) => {
        // Return to previous screen
        setShowGDTable(true);
        setShowBiasScreen(false);
    };

    console.log(userid);

    const handleConfirmButton = (value) => {
        // API call to re-train model and fetch everything
        PostGenerateAndRetrain({
            userid,
            setShowGDTable,
            setShowBiasScreen,
            genData
        });
    };

    const [selectBiasList, setSelectBiasList] = useState([]);
    const [varName, setVarName] = useState(null);

    useEffect(() => {
        console.log(augTable);
        let selectionBiasvariables = Object.keys(augTable)
            .filter(key =>
                augTable[key].selectedOptions.length > 0
            );
        console.log(selectionBiasvariables)
        setSelectBiasList(selectionBiasvariables);
        GetBiasAwarenessData({ userid, genData, augTable });
    }, []);



    return (
        <>
            <div className='ba-subtitle'>
                <div>
                    Warning: Your suggested changes may introduce the following biases into the training data.
                    <br />
                    Please take a look at the following bias explanations and confirm again if you want to proceed.
                </div>
            </div>
            <div className='generated-data-holder'>
                <div className='ba-holder'>
                    <div className='ba-holder-header'>
                        Awareness for potential biases that may get introduced during the data generation process:
                    </div>
                    <Collapse accordion defaultActiveKey={['1']}>
                        <Panel header={"Selection Bias"} key="1"
                            className="collapse-panel-custom"
                            style={{ ["--header-border"]: "2px dashed #C4C4C4" }}>
                            <div className='ba-r1'>
                                <span>
                                    The augmentation process might have introduced selection bias for these variables:
                                </span>
                                &nbsp;
                                &nbsp;
                                <Select
                                    defaultValue={"Please select:"}
                                    size='small'
                                    style={{ width: '12vw', backgroundColor: '#E5E5E5', fontSize: '1.8vh' }}
                                    onChange={handleChange}>
                                    {
                                        (selectBiasList.length > 0)
                                            ?
                                            selectBiasList.map((item, index) => {
                                                return (
                                                    <Option key={index} value={item}>{FRIENDLY_NAMES_ENG[item]}</Option>
                                                );
                                            })
                                            :
                                            null
                                    }
                                </Select>
                            </div>
                            <div className='ba-r2'>
                                {
                                    (selectBiasList.length > 0)
                                        ?
                                        (varName != null)
                                            ?
                                            <SelectionBiasPlots
                                                x_values={AUGMENT_VARIABLES[varName]["options"]}
                                                y_values={[2500, 1500]}
                                                coverage={[2500, 1500]}
                                                rr={[60, 40]}
                                                cov_thres={2000} />
                                            :
                                            <Empty description={"Please select a variable."} />
                                        :
                                        <Empty description={"No selection bias observed."} />
                                }
                            </div>
                            <div className='ba-r3'>
                                <p>
                                    Selection bias occurs when you have selected only one sub-category for the data generation process.
                                    To avoid this bias, please click on 'Go Back' and 'Clear Unsaved Data' to start the data generation process again.
                                </p>
                            </div>
                        </Panel>
                        <Panel
                            header={"Generation Bias"}
                            key="2"
                            className="collapse-panel-custom"
                            style={{ ["--header-border"]: "2px dashed #C4C4C4" }}
                        >
                            <div className='ba-r1'>
                                <span>
                                    Potential outliers have been found in the training dataset.
                                </span>
                                Options Here
                            </div>
                            <div className='ba-r2'>
                                Graph Here
                            </div>
                            <div className='ba-r3'>
                                <p>
                                    {"Description Here"}
                                </p>
                            </div>
                        </Panel>
                    </Collapse>
                </div>
            </div>
            <div className='ba-button-message'>
                Are you sure that you want to re-train the model with the generated data?
            </div>
            <div className='ba-buttons'>
                <button
                    className="ba-cancel-button"
                    type="submit"
                    onClick={handleCancelButton}
                >
                    Go Back
                </button>
                <button
                    className="ba-train-button"
                    type="submit"
                    onClick={handleConfirmButton}
                >
                    Confirm
                </button>
            </div>
        </>
    )
};