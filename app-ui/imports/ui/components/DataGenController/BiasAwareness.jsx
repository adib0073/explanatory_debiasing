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
import { GenBiasPlots } from './GenBiasPlots.jsx';

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
        .then(() => message.success('New data generated with selected settings', 1))

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
        .then(() => window.location.reload())
        .catch(function (error) {
            console.log(error);
        });
};


const PostInteractions = ({ userid, interactData }) => {
    axios.post(BASE_API + '/trackinteractions', {
        UserId: userid,
        Component: interactData["component"],
        Clicks: interactData["clicks"],
        Time: interactData["time"],
        ClickList: interactData["clickList"]
    }, {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT, OPTIONS",
            "Access-Control-Allow-Headers": "X-Auth-Token, Origin, Authorization, X-Requested-With, Content-Type, Accept"
        }
    }).then(function (response) {
        //console.log(response.data["OutputJson"]);
        if (response.data["StatusCode"]) {
            // Fire and Forget
        }
        else {
            console.log("Error reported. Login failed.")
            // TO-DO: Navigate to Error Screen.
        }
    }).catch(function (error) {
        console.log(error);
    });
};

const GetBiasAwarenessData = ({
    userid,
    genData,
    augTable,
    setCategorySelections,
    setOdVals,
    setGdVals
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
            //console.log(response.data['OutputJson'])
            setCategorySelections(response.data['OutputJson']['selected_vals']);
            setOdVals(response.data['OutputJson']['train_data_vals']);
            setGdVals(response.data['OutputJson']['gen_data_vals'])
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
        augTable,
        gen_acc,
        gen_dq,
        origDataAcc,
        origDataQuality,
        interactData,
        setInteractData
    }) => {

    const interactDataRef = useRef(interactData);
    interactDataRef.current = interactData;

    const handleChange = (value) => {
        setVarName(value)
    };

    const updateInteractData = (update) => {
        return new Promise((resolve) => {
            setInteractData(prevState => {
                const newState = { ...prevState, ...update };
                resolve(newState);
                return newState;
            });
        });
    };

    const handleCancelButton = async (value) => {
        // Return to previous screen
        setShowGDTable(true);
        setShowBiasScreen(false);

        var endTime = new Date();
        var timeDiff = endTime - startTime; //in ms
        // strip the ms
        timeDiff /= 1000;
        // get seconds
        var duration = Math.round(timeDiff % 60);
        // -----
        // Post Interaction
        const newState = await updateInteractData({
            component: "BiasAwareness",
            time: duration
        });
        PostInteractions({ userid, interactData: newState });
    };

    //console.log(userid);

    const handleConfirmButton = async (value) => {
        // API call to re-train model and fetch everything
        PostGenerateAndRetrain({
            userid,
            setShowGDTable,
            setShowBiasScreen,
            genData
        });

        var endTime = new Date();
        var timeDiff = endTime - startTime; //in ms
        // strip the ms
        timeDiff /= 1000;
        // get seconds
        var duration = Math.round(timeDiff % 60);

        const newState = await updateInteractData({
            component: "BiasAwareness",
            time: duration
        });
        PostInteractions({ userid, interactData: newState });
    };

    const [selectBiasList, setSelectBiasList] = useState([]);
    const [categorySelections, setCategorySelections] = useState(null);
    const [gdVals, setGdVals] = useState(null);
    const [odVals, setOdVals] = useState(null);
    const [varName, setVarName] = useState(null);
    // Hover time for interaction data
    const [startTime, setStartTime] = useState(new Date());

    useEffect(() => {

        let selectionBiasvariables = Object.keys(augTable)
            .filter(key =>
                augTable[key].selectedOptions.length > 0
            );
        setSelectBiasList(selectionBiasvariables);
        GetBiasAwarenessData({
            userid,
            genData,
            augTable,
            setCategorySelections,
            setOdVals,
            setGdVals
        });
        setInteractData({
            "component": null,
            "clicks": 0,
            "time": 0,
            "clickList": []
        });
    }, []);

    const handlePanelClick = (biasType) => {

        console.log(biasType)
        // Update interaction data
        setInteractData(prevState => ({
            ...prevState,  // Spread the previous state
            component: "BiasAwareness",
            clicks: prevState.clicks + 1,  // Update 'clicks' property
            clickList: [...prevState.clickList, biasType]
        }));
        // -----
    };

    //console.log(gen_acc, gen_dq)
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
                    <Collapse accordion>
                        <Panel header={"Selection Bias"} key="1"
                            className="collapse-panel-custom"
                            style={{ ["--header-border"]: "2px dashed #C4C4C4" }}
                            onClick={() => { handlePanelClick("selection_bias") }}
                        >
                            <div className='ba-r1'>
                                <span>
                                    The augmentation process might have introduced selection bias for these variables:
                                </span>
                                &nbsp;
                                &nbsp;
                                <Select
                                    defaultValue={"Please select:"}
                                    size='small'
                                    style={{ width: '8vw', backgroundColor: '#E5E5E5', fontSize: '1.8vh' }}
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
                                        (varName != null && odVals != null && gdVals != null)
                                            ?
                                            <SelectionBiasPlots
                                                x_values={AUGMENT_VARIABLES[varName]["options"]}
                                                orig_data={Object.values(odVals[varName]["counts"])}
                                                gen_data={Object.values(gdVals[varName]["counts"])}
                                                selectedStatus={categorySelections[varName]}
                                            />
                                            :
                                            <Empty description={"Please select a variable."} />
                                        :
                                        <Empty description={"No selection bias observed."} />
                                }
                            </div>
                            <div className='ba-r3'>
                                <p>
                                    Selection bias occurs when you have selected only one sub-category for the data generation process.
                                    Proceed only if you think this form of bias is necessary.
                                    Otherwise, please click on 'Go Back' and 'Clear Unsaved Data' to start the data generation process again.
                                </p>
                            </div>
                        </Panel>
                        <Panel
                            header={"Generation Bias"}
                            key="2"
                            className="collapse-panel-custom"
                            style={{ ["--header-border"]: "2px dashed #C4C4C4" }}
                            onClick={() => { handlePanelClick("generation_bias") }}
                        >
                            <div className='ba-r1'>
                                <span>
                                    Generation bias occurs either due to the bias in data generation algorithms or when the data has been edited.
                                </span>

                            </div>
                            <div className='ba-r2'>
                                < GenBiasPlots
                                    x_values={["Model Accuracy", "Data Quality"]}
                                    y_values={[[origDataAcc, origDataQuality], [gen_acc, gen_dq]]}
                                />
                            </div>
                            <div className='ba-r3'>
                                <p>
                                    Kindly validate the estimated accuracy and the quality score of the generated data.
                                    If the estimated scores are below the current scores, the generated data can hamper the performance of the system.
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