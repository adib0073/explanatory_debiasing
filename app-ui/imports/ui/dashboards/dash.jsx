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

    var phase = user.phase;
    console.log(phase)
    if (phase == null || phase == "explore") {
        phase = window.localStorage.getItem('phase');
    }

    var datenow = user.datenow;
    if (datenow == null || datenow == "") {
        datenow = Number(window.localStorage.getItem('datenow'));
    }
    console.log(datenow)

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

    const [augTable, setAugTable] = useState({
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
    })

    const [seed, setSeed] = useState(1);
    const reset = () => {
        setSeed(Math.random());
    }

    return (
        <>
            <NavBar userid={userid} phase={phase} datenow={datenow} />
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
                        augTable={augTable}
                        setAugTable={setAugTable}
                        phase={phase}
                        datenow={datenow}
                    />
                    <DataGenController
                        userid={userid}
                        showGDTable={showGDTable}
                        setShowGDTable={setShowGDTable}
                        genData={genData}
                        setGenData={setGenData}
                        genDataAcc={genDataAcc}
                        genDataQuality={genDataQuality}
                        showBiasScreen={showBiasScreen}
                        setShowBiasScreen={setShowBiasScreen}
                        augTable={augTable}
                        phase={phase}
                        datenow={datenow}
                    />
                </div>
            </div>
        </>
    );
};