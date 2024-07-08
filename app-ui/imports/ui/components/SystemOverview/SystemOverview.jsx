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
import { Tooltip } from 'antd';

const GetSystemOverview = ({ userid, setSoVals, setOrigDataAcc }) => {
    axios.get(BASE_API + '/getsystemoverview/?user=' + userid)
        .then(function (response) {
            //console.log(response.data["OutputJson"]);
            setSoVals({
                accuracy: response.data["OutputJson"]["Accuracy"],
                nsamples: response.data["OutputJson"]["NumSamples"],
                nfeats: response.data["OutputJson"]["NumFeatures"],
                pct: response.data["OutputJson"]["ScoreChange"],
            });
            setOrigDataAcc(response.data["OutputJson"]["Accuracy"]);

        }).catch(function (error) {
            console.log(error);
        });
}


export const SystemOverview = (
    {
        userid,
        setOrigDataAcc
    }) => {
    const accuracyChartRef = useRef();
    const [soVals, setSoVals] = useState({ accuracy: 0, nsamples: 0, nfeats: 0, pct: 0 });
    useEffect(() => {
        GetSystemOverview({ userid, setSoVals, setOrigDataAcc });
    }, []);

    return (
        <div className="dash-container-system-overview">
            <div className="chart-title-box">
                <div className="chart-title">
                    System Overview
                </div>
                <Tooltip
                    placement="bottom"
                    title={
                        "This component shows the overall accuracy of the prediction model."
                        + "\nIt shows number of patient records used to train the prediction model and the number of prediction variables present in the dataset."
                    }
                    overlayStyle={{ maxWidth: '500px' }}
                >
                    <div className="chart-icons">

                        <InfoLogo />
                    </div>

                </Tooltip>
            </div>
            <div className="so-container" >
                <div className="so-desc-left" >
                    <div className='chart-container-info'>
                        <Tooltip
                            placement="top"
                            title={
                                "Number of patients records used to train the prediction model."
                            }
                            overlayStyle={{ maxWidth: '500px' }}
                        >
                            <HollowBullet /> &nbsp;{"No. of training samples"} : <b>{soVals.nsamples}</b>
                        </Tooltip>
                    </div>
                    <div className='chart-container-info'>
                        <Tooltip
                            placement="top"
                            title={
                                "Predictor variables are health factors used to train the prediction model."
                                + "\nThe name of the 17 predictor variables are shown in the Augmentation Controller and the Data Explorer."
                            }
                            overlayStyle={{ maxWidth: '500px' }}
                        >
                            <HollowBullet /> &nbsp;{"No. of predictor variables"} : <b>{soVals.nfeats}</b>
                        </Tooltip>
                    </div>
                    <div className='chart-container-info'>
                        <Tooltip
                            placement="top"
                            title={
                                "Prediction accuracy denotes the number of times the system can accurately classify between diabetic and non-diabetic patients from their records."
                            }
                            overlayStyle={{ maxWidth: '500px' }}
                        >
                            <HollowBullet /> &nbsp;{"Overall prediction accuracy"} : <b>{soVals.accuracy}%</b>
                        </Tooltip>
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