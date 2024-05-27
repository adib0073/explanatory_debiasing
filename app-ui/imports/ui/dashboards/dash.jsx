import React from 'react';
import { useRef, useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import { Empty, InputNumber, Table, Select } from 'antd';
import './dash.css'
import { NavBar } from '../components/NavBar/NavBar.jsx';
import axios from 'axios';
import { InfoLogo } from '../components/Icons/InfoLogo.jsx';
import { HollowBullet } from '../components/Icons/HollowBullet.jsx';
import { UpGreenArrow } from '../components/Icons/UpGreenArrow.jsx';
import { UpRedArrow } from '../components/Icons/UpRedArrow.jsx';
import { DownRedArrow } from '../components/Icons/DownRedArrow.jsx';
import { DoughnutChart } from '../components/EstimatedRiskChart/DoughnutChart.jsx';
import { SystemOverview } from '../components/SystemOverview/SystemOverview.jsx';
import { DataExplorer } from '../components/DataExplorer/DataExplorer.jsx';
import { DataQuality } from '../components/DataQuality/DataQuality.jsx';
import { AugmentationController } from '../components/AugmentationController/AugmentationController.jsx';

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
                    <div className="dash-container-gen-controller">
                        <div className="chart-title-box">
                            <div className="chart-title">
                                Generated Data Controller
                            </div>

                            <div className="chart-icons">
                                <InfoLogo />
                            </div>
                        </div>
                        <div className='chart-container'>
                            <div className="gd-container" >
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
                                    >
                                        Restore to defaults
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};