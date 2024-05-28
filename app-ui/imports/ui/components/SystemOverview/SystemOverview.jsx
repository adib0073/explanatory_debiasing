import React from 'react';
import { useRef } from 'react';
import 'antd/dist/antd.css';
import "./SystemOverview.css"
import { InfoLogo } from '../Icons/InfoLogo.jsx';
import { HollowBullet } from '../Icons/HollowBullet.jsx';
import { UpGreenArrow } from '../Icons/UpGreenArrow.jsx';
import { DownRedArrow } from '../Icons/DownRedArrow.jsx';
import { DoughnutChart } from '../EstimatedRiskChart/DoughnutChart.jsx';
import { greenFont, redFont } from '../../Constants.jsx';

export const SystemOverview = (
    {
    }) => {
    const accuracyChartRef = useRef();
    return (
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
    );
};