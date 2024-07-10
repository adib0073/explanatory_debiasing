import React from 'react';
import { useRef, useState } from 'react';
import 'antd/dist/antd.css';
import "./DataGenController.css";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Table, Switch, Tag, Space, message, Tooltip } from 'antd';
import { greenFont, redFont } from '../../Constants.jsx';
import { CustomTableComponent } from './CustomTableComponent.jsx';
import axios from 'axios';
import { BASE_API } from '../../Constants.jsx';

const GetRestoreData = ({ userid, setShowGDTable, setShowBiasScreen }) => {
    message.loading('Restoring to defaults', 2)
        .then(() => setShowGDTable(false))
        .then(() => setShowBiasScreen(false))
    axios.get(BASE_API + '/restoretodefaults/?user=' + userid)
        .then(function (response) {
            //console.log(response.data["OutputJson"]);
            console.log("Default data and model restored");

        })
        .then(() => window.location.reload())
        .then(() => message.success('System restored to defaults', 3))
        .catch(function (error) {
            console.log(error);
        });
}

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

export const GenDataTable = (
    {
        userid,
        gen_acc,
        default_acc,
        gen_dq,
        default_dq,
        data,
        setData,
        setShowGDTable,
        setShowBiasScreen,
        interactData,
        setInteractData
    }) => {

    const onChangeSortSwitch = (checked) => {
        setSortSwitch(!sortSwitch);
    };

    const onChangeFilterSwitch = (checked) => {
        setFilterSwitch(!filterSwitch);
    };

    const [sortSwitch, setSortSwitch] = useState(true);
    const [filterSwitch, setFilterSwitch] = useState(true);
    // Hover time for interaction data
    const [startTime, setStartTime] = useState(new Date());

    const interactDataRef = useRef(interactData);
    interactDataRef.current = interactData;

    const handleTrainButton = async (value) => {

        var endTime = new Date();
        var timeDiff = endTime - startTime; //in ms
        // strip the ms
        timeDiff /= 1000;
        // get seconds
        var duration = Math.round(timeDiff % 60);

        const newState = await updateInteractData({
            component: "GenDataTable",
            clicks: interactDataRef.current.clicks + 1,
            time: duration,
            clickList: [...interactDataRef.current.clickList, "train"]
        });
        PostInteractions({ userid, interactData: newState });

        // Show Bias Awareness Screen First
        if (window.confirm("Are you ready to proceed?")) {
            setShowGDTable(false);
            setShowBiasScreen(true);
        }
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
        var endTime = new Date();
        var timeDiff = endTime - startTime; //in ms
        // strip the ms
        timeDiff /= 1000;
        // get seconds
        var duration = Math.round(timeDiff % 60);

        const newState = await updateInteractData({
            component: "GenDataTable",
            clicks: interactDataRef.current.clicks + 1,
            time: duration,
            clickList: [...interactDataRef.current.clickList, "cancel"]
        });
        PostInteractions({ userid, interactData: newState });

        if (window.confirm("Are you sure to discard the generated data? You have to generate new data again using the augmentation controller if you press ok.")) {
            setShowGDTable(false);
            setShowBiasScreen(false);
        }
    };

    const handleRestoreButton = async (value) => {

        var endTime = new Date();
        var timeDiff = endTime - startTime; //in ms
        // strip the ms
        timeDiff /= 1000;
        // get seconds
        var duration = Math.round(timeDiff % 60);

        const newState = await updateInteractData({
            component: "GenDataTable",
            clicks: interactDataRef.current.clicks + 1,
            time: duration,
            clickList: [...interactDataRef.current.clickList, "restore"]
        });
        PostInteractions({ userid, interactData: newState });

        if (window.confirm("Are you sure to restore to default settings?")) {
            // API call to restore and fetch everything
            GetRestoreData({ userid, setShowGDTable, setShowBiasScreen });

        }
    };

    return (
        <>
            <div className='gd-subtitle'>
                <div className='gd-subtitle-left'>
                    <div>
                        <Tooltip
                            placement="top"
                            title={
                                "Verify the model accuracy of the generated data to ensure that only accurate samples are added."
                                + "Also, particularly verify generated samples with low confidence levels."
                            }
                            overlayStyle={{ maxWidth: '500px' }}
                        >
                            Estimated prediction accuracy on generated data:
                        </Tooltip>
                        <span style={{ color: (gen_acc >= default_acc) ? greenFont : redFont }}>
                            &nbsp;{gen_acc} %
                        </span>
                    </div>
                    <div>
                        <Tooltip
                            placement="top"
                            title={
                                "Verify the quality of the generated data to ensure that only good samples are added."
                            }
                            overlayStyle={{ maxWidth: '500px' }}
                        >
                            Estimated data quality of generated data:
                        </Tooltip>
                        <span style={{ color: (gen_dq >= default_dq) ? greenFont : redFont }}>
                            &nbsp;{gen_dq} %
                        </span>
                    </div>
                </div>
                <div className='gd-subtitle-right'>
                    <div className='gd-subtitle-right-row'>
                        <Tooltip
                            placement="top"
                            title={
                                "Use this to sort the generated data table."
                            }
                            overlayStyle={{ maxWidth: '500px' }}
                        >
                            Sort:
                        </Tooltip>
                        <div className='gd-subtitle-right-switch'>
                            <Switch
                                size="small"
                                onChange={onChangeSortSwitch}
                                defaultChecked={true}
                            />
                        </div>
                    </div>
                    <div className='gd-subtitle-right-row'>
                        <Tooltip
                            placement="top"
                            title={
                                "Use this to filter the generated data table."
                            }
                            overlayStyle={{ maxWidth: '500px' }}
                        >
                            Filter:
                        </Tooltip>
                        <div className='gd-subtitle-right-switch'>
                            <Switch
                                size="small"
                                onChange={onChangeFilterSwitch}
                                defaultChecked={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className='generated-data-holder'>
                <div className='datagen-holder'>
                    <CustomTableComponent
                        isSort={sortSwitch}
                        isFilter={filterSwitch}
                        data={data}
                        setData={setData}
                        setInteractData={setInteractData}
                    />
                </div>
            </div>
            <div className='gd-buttons'>
                <button
                    className="reset-button"
                    type="submit"
                    onClick={handleRestoreButton}
                >
                    Restore to defaults
                </button>
                <button
                    className="cancel-button"
                    type="submit"
                    onClick={handleCancelButton}
                >
                    Cancel changes
                </button>
                <button
                    className="train-button"
                    type="submit"
                    onClick={handleTrainButton}
                >
                    Save and Re-train
                </button>
            </div>
        </>
    )
};