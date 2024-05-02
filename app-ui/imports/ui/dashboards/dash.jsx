import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { NavBar } from '../components/NavBar/NavBar.jsx';
import './dash.css'
import axios from 'axios';
import { InfoLogo } from '../components/Icons/InfoLogo.jsx';
import { HollowBullet } from '../components/Icons/HollowBullet.jsx';
import { UpGreenArrow } from '../components/Icons/UpGreenArrow.jsx';
import { UpRedArrow } from '../components/Icons/UpRedArrow.jsx';
import { DownRedArrow } from '../components/Icons/DownRedArrow.jsx';
import { DoughnutChart } from '../components/EstimatedRiskChart/DoughnutChart.jsx';


export const DASH = ({ user }) => {
    var userid = user.id;
    if (userid == null || userid == "") {
        userid = window.localStorage.getItem('userid');
    }

    const accuracyChartRef = useRef();

    useEffect(() => {
    }, []);

    const greenFont = "#449231";
    const redFont = "#D64242";

    return (
        <>
            <NavBar user={user} />
            <div className="dash-container">
                <div className="dash-container-left">
                    <div className="dash-container-system-overview">
                        <div className="chart-title-box">
                            <div className="chart-title">
                                System Overview
                            </div>

                            <div className="chart-icons">
                                <InfoLogo />
                            </div>
                        </div>
                        <div className="chart-container" >
                            <div className="so-desc-left" >
                                <div className='chart-container-info'>
                                    <HollowBullet /> &nbsp;{"No. of records"} : <b>{3000}</b>
                                </div>
                                <div className='chart-container-info'>
                                    <HollowBullet /> &nbsp;{"No. of predictor variables"} : <b>{18}</b>
                                </div>
                                <div className='chart-container-info'>
                                    <HollowBullet /> &nbsp;{"Overall prediction accuracy"} : <b>{80}</b>
                                </div>
                                <div className='chart-container-info'>
                                    <span style={{ color: (5 > 0) ? greenFont : redFont }}>
                                        {(5 > 0) ? <UpGreenArrow /> : <DownRedArrow />}
                                        <b> &nbsp;{5}% </b>
                                    </span>
                                    {"from previous score"}

                                </div>
                            </div>
                            <div className="so-chart-right" >
                                <div className='chart-container-viz'>
                                    <DoughnutChart accuracy={80} chartRef={accuracyChartRef} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="dash-container-data-explorer">
                        <div className="chart-title-box">
                            <div className="chart-title">
                                Data Explorer
                            </div>

                            <div className="chart-icons">
                                <InfoLogo />
                            </div>
                        </div>
                        <div className="chart-container" >
                            Chart Here
                        </div>
                    </div>
                    <div className="dash-container-quality">
                        <div className="chart-title-box">
                            <div className="chart-title">
                                Data Quality Overview
                            </div>

                            <div className="chart-icons">
                                <InfoLogo />
                            </div>
                        </div>
                        <div className="chart-container" >
                            Chart Here
                        </div>
                    </div>
                </div>
                <div className="dash-container-right">
                    <div className="dash-container-aug-controller">
                        <div className="chart-title-box">
                            <div className="chart-title">
                                Augmentation Controller
                            </div>

                            <div className="chart-icons">
                                <InfoLogo />
                            </div>
                        </div>
                        <div className="chart-container" >
                            Chart Here
                        </div>
                    </div>
                    <div className="dash-container-gen-controller">
                        <div className="chart-title-box">
                            <div className="chart-title">
                                Generated Data Controller
                            </div>

                            <div className="chart-icons">
                                <InfoLogo />
                            </div>
                        </div>
                        <div className="chart-container" >
                            Chart Here
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};