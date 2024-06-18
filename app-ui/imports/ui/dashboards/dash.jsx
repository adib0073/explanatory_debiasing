import React from 'react';
import { useRef, useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import './dash.css'
import { NavBar } from '../components/NavBar/NavBar.jsx';
import axios from 'axios';
import { SystemOverview } from '../components/SystemOverview/SystemOverview.jsx';
import { DataExplorer } from '../components/DataExplorer/DataExplorer.jsx';
import { DataQuality } from '../components/DataQuality/DataQuality.jsx';
import { AugmentationController } from '../components/AugmentationController/AugmentationController.jsx';
import { DataGenController } from '../components/DataGenController/DataGenController.jsx';

export const DASH = ({ user }) => {
    var userid = user.id;
    if (userid == null || userid == "") {
        userid = window.localStorage.getItem('userid');
    }

    useEffect(() => {
    }, []);

    const handleChange = (value) => {
        console.log(`selected ${value}`);
    };

    const [showGDTable, setShowGDTable] = useState(false);
    const [showBiasScreen, setShowBiasScreen] = useState(false);
    const [genData, setGenData] = useState([]);
    const [genDataAcc, setGenDataAcc] = useState(0.0);
    const [genDataQuality, setGenDataQuality] = useState(0.0);

    const [seed, setSeed] = useState(1);
    const reset = () => {
        setSeed(Math.random());
    }

    return (
        <>
            <NavBar user={user} />
            <div className="dash-container">
                <div className="dash-container-left">
                    <SystemOverview userid={userid} />
                    <DataExplorer userid={userid} />
                    <DataQuality userid={userid} />
                </div>
                <div className="dash-container-right">
                    <AugmentationController
                        showGDTable={showGDTable}
                        setShowGDTable={setShowGDTable}
                        userid={userid}
                        key={seed}
                        resetFunc={reset}
                        setGenData={setGenData}
                        setGenDataAcc={setGenDataAcc}
                        setGenDataQuality={setGenDataQuality}
                    />
                    <DataGenController
                        showGDTable={showGDTable}
                        setShowGDTable={setShowGDTable}
                        genData={genData}
                        setGenData={setGenData}
                        genDataAcc={genDataAcc}
                        genDataQuality={genDataQuality}
                        showBiasScreen={showBiasScreen}
                        setShowBiasScreen={setShowBiasScreen}
                    />
                </div>
            </div>
        </>
    );
};