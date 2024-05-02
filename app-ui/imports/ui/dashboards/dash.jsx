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
import GaugeChart from 'react-gauge-chart';
import { Empty } from 'antd';



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
                        <div className="so-container" >
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
                            <div className="de-container" >
                                <div className="de-metric-container" >
                                    <div className='de-info'>
                                        &nbsp;{"Overall representation rate (RR) is"} : <b>{70}</b>
                                    </div>
                                    <div className='de-info'>
                                        &nbsp;{"Overall data coverage is"} : <b>{60}</b>
                                    </div>
                                    <div className='de-info'>
                                        &nbsp;{"Low RR and coverage indicates presence of potential bias in the variables"}
                                    </div>
                                </div>
                                <div className="de-chart-container" >
                                    <div>
                                        Variable Selected
                                    </div>
                                    <div>
                                        <div className='chart-container-viz'>
                                            <DoughnutChart accuracy={80} chartRef={accuracyChartRef} />
                                        </div>
                                    </div>
                                    <div className="de-insights-container" >
                                        Insights:
                                        <div className='chart-container-info'>
                                            <HollowBullet /> &nbsp;{"No. of records"} : <b>{3000}</b>
                                        </div>
                                        <div className='chart-container-info'>
                                            <HollowBullet /> &nbsp;{"No. of predictor variables"} : <b>{18}</b>
                                        </div>
                                        <div className='chart-container-info'>
                                            <HollowBullet /> &nbsp;{"Overall prediction accuracy"} : <b>{80}</b>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                        <div className='dq-container'>
                            <div className="dq-guage">
                                <div>
                                    <GaugeChart
                                        nrOfLevels={3}
                                        arcsLength={[0.5, 0.3, 0.2]}
                                        percent={0.6}
                                        textColor={"black"}
                                        hideText={true}
                                        colors={[
                                            (0.6 > 0.0 ? '#1363DF' : '#E5E5E5'),
                                            (0.6 > 0.5 ? '#1363DF' : '#E5E5E5'),
                                            (0.6 > 0.8 ? '#1363DF' : '#E5E5E5')
                                        ]}
                                        style={{ width: "12vw" }}
                                    />
                                </div>
                            </div>
                            <div className="dq-score">
                                <div>
                                    Poor : 60 %
                                </div>
                            </div>
                            <div className="dq-tag">
                                <div>
                                    The data quality is poor because of the following potential data issues.
                                </div>
                            </div>
                            <div className="dq-info">
                                <div className="dq-info-left">
                                    <div className='chart-container-info'>
                                        <HollowBullet /> &nbsp;{"Class Imbalance"} : <b>{3000}</b>
                                    </div>
                                    <div className='chart-container-info'>
                                        <HollowBullet /> &nbsp;{"Correlated Features"} : <b>{18}</b>
                                    </div>
                                </div>
                                <div className='dq-info-right'>
                                    <div className='chart-container-info'>
                                        <HollowBullet /> &nbsp;{"Outlier Features"} : <b>{80}</b>
                                    </div>
                                    <div className='chart-container-info'>
                                        <HollowBullet /> &nbsp;{"Data Drift"} : <b>{80}</b>
                                    </div>
                                </div>
                            </div>
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
                        <div className="ac-container" >
                            <div>
                                Apply constraints to the generated data
                            </div>
                            <div>
                                Number of samples
                            </div>
                            <div>
                                Table Here
                            </div>
                            <div>
                                <button
                                    className="reset-button"
                                    type="submit"
                                >
                                    Cancel
                                </button>

                                <button
                                    className="train-button"
                                    type="submit"
                                >
                                   Generate
                                </button>
                            </div>
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
                        <div className='chart-container'>
                            <div className="gd-container" >
                                <div>
                                    Please use the augmentation controller to generate data.
                                </div>
                                <div className='generated-data-holder'>
                                    <div className='empty-holder'>
                                        <Empty description={
                                            <span>
                                                There is no unsaved generated data.
                                                Please use the Augmentation Controller to generate new data.
                                            </span>
                                        } />
                                    </div>
                                </div>
                                <div>
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