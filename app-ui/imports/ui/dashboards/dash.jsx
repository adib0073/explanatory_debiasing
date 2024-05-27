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

    return (
        <>
            <NavBar user={user} />
            <div className="dash-container">
                <div className="dash-container-left">
                    <SystemOverview />
                    <DataExplorer />
                    <DataQuality />
                </div>
                <div className="dash-container-right">
                    <AugmentationController />
                    <DataGenController />
                </div>
            </div>
        </>
    );
};