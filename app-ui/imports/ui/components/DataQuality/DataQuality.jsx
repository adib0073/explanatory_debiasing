import React from 'react';
import { useRef } from 'react';
import 'antd/dist/antd.css';
import "./DataQuality.css"
import { InfoLogo } from '../Icons/InfoLogo.jsx';
import { HollowBullet } from '../Icons/HollowBullet.jsx';
import { UpRedArrow } from '../Icons/UpRedArrow.jsx';
import { UpGreenArrow } from '../Icons/UpGreenArrow.jsx';
import { DownRedArrow } from '../Icons/DownRedArrow.jsx';
import { BiasCountPlots } from '../BiasDetectionPlots/BiasCountPlots.jsx';
import { BiasAccPlots } from '../BiasDetectionPlots/BiasAccPlots.jsx';
import { Select } from 'antd';
import GaugeChart from 'react-gauge-chart';

export const DataQuality = (
    {
    }) => {
    console.log('Data Quality');
    const handleChange = (value) => {
        console.log(`selected ${value}`);
    };

    return (<div className="dash-container-quality">
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
                        <UpRedArrow /> &nbsp;{"Class Imbalance"} : <b>{3000}</b>
                    </div>
                    <div className='chart-container-info'>
                        <UpRedArrow /> &nbsp;{"Correlated Features"} : <b>{18}</b>
                    </div>
                </div>
                <div className='dq-info-right'>
                    <div className='chart-container-info'>
                        <UpRedArrow /> &nbsp;{"Outlier Features"} : <b>{80}</b>
                    </div>
                    <div className='chart-container-info'>
                        <UpRedArrow /> &nbsp;{"Data Drift"} : <b>{80}</b>
                    </div>
                </div>
            </div>
        </div>
    </div>);
};