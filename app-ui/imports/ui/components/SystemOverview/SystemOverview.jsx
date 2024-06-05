import React from 'react';
import { useRef, useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import "./SystemOverview.css"
import { InfoLogo } from '../Icons/InfoLogo.jsx';
import { HollowBullet } from '../Icons/HollowBullet.jsx';
import { UpGreenArrow } from '../Icons/UpGreenArrow.jsx';
import { DownRedArrow } from '../Icons/DownRedArrow.jsx';
import { DoughnutChart } from '../EstimatedRiskChart/DoughnutChart.jsx';
import { greenFont, redFont, BASE_API } from '../../Constants.jsx';
import axios from 'axios';

const GetSystemOverview = ({ userid, setSoVals }) => {
    axios.get(BASE_API + '/getsystemoverview/?user=' + userid)
        .then(function (response) {
            //console.log(response.data["OutputJson"]);
            setSoVals({
                accuracy: response.data["OutputJson"]["Accuracy"],
                nsamples: response.data["OutputJson"]["NumSamples"],
                nfeats: response.data["OutputJson"]["NumFeatures"],
                pct: response.data["OutputJson"]["ScoreChange"],
            });

        }).catch(function (error) {
            console.log(error);
        });
}


export const SystemOverview = (
    {
        userid,
    }) => {
    const accuracyChartRef = useRef();
    const [soVals, setSoVals] = useState({ accuracy: 0, nsamples: 0, nfeats: 0, pct: 0});
    useEffect(() => {
        GetSystemOverview({ userid, setSoVals });
    }, []);

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
                        <HollowBullet /> &nbsp;{"No. of training samples"} : <b>{soVals.nsamples}</b>
                    </div>
                    <div className='chart-container-info'>
                        <HollowBullet /> &nbsp;{"No. of predictor variables"} : <b>{soVals.nfeats}</b>
                    </div>
                    <div className='chart-container-info'>
                        <HollowBullet /> &nbsp;{"Overall prediction accuracy"} : <b>{soVals.accuracy}%</b>
                    </div>
                    <div className='chart-container-info'>
                        <span style={{ color: (soVals.pct > 0) ? greenFont : redFont }}>
                            {(soVals.pct > 0) ? <UpGreenArrow /> : <DownRedArrow />}
                            <b> &nbsp;{soVals.pct}% </b>
                        </span>
                        {"from previous score"}

                    </div>
                </div>
                <div className="so-chart-right" >
                    <div className='chart-container-viz'>
                        <DoughnutChart accuracy={soVals.accuracy} chartRef={accuracyChartRef} />
                    </div>
                </div>
            </div>
        </div>
    );
};