import React from 'react';
import { useRef } from 'react';
import 'antd/dist/antd.css';
import "./DataGenController.css";
import { Empty, message } from 'antd';
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

export const EmptyDataGenController = (
    {
        userid,
        setShowGDTable,
        setShowBiasScreen,
        phase,
        datenow,
        setInteractData
    }) => {

    if (phase == null || phase == "explore") {
        phase = window.localStorage.getItem('phase');
    }

    if (datenow == null || datenow == "") {
        datenow = window.localStorage.getItem('datenow');
    }
    const handleRestoreButton = (value) => {
        if (window.confirm("Are you sure to restore to default settings?")) {
            // API call to restore and fetch everything
            GetRestoreData({ userid, setShowGDTable, setShowBiasScreen });
        }
    };

    return (
        <>
            <div className='gd-subtitle'>
                Please use the augmentation controller to generate data.
            </div>
            <div className='generated-data-holder'>
                <div className='empty-holder'>
                    <Empty description={
                        <span className='gd-empty-text'>
                            There is no unsaved generated data.
                            <br />
                            Please use the Augmentation Controller to generate new data.
                        </span>
                    } />
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
            </div>
        </>
    )
};