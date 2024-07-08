import React from 'react';
import { useRef, useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import "./DataQuality.css"
import { InfoLogo } from '../Icons/InfoLogo.jsx';
import { HollowBullet } from '../Icons/HollowBullet.jsx';
import { UpRedArrow } from '../Icons/UpRedArrow.jsx';
import { UpGreenArrow } from '../Icons/UpGreenArrow.jsx';
import { DownRedArrow } from '../Icons/DownRedArrow.jsx';
import GaugeChart from 'react-gauge-chart';
import { greenFont, redFont, BASE_API, DATA_ISSUE_FRIENDLY_NAMES_Eng } from '../../Constants.jsx';
import axios from 'axios';


const GetDataQuality = ({ userid, setDqChartVals, setOrigDataQuality }) => {
    axios.get(BASE_API + '/getdataquality/?user=' + userid)
        .then(function (response) {
            //console.log(response.data["OutputJson"]);
            setDqChartVals({
                "score": response.data["OutputJson"]["score"],
                "quality_class": response.data["OutputJson"]["quality_class"],
                "issues": response.data["OutputJson"]["issues"],
                "issue_val": response.data["OutputJson"]["issue_val"]
            });
            setOrigDataQuality(response.data["OutputJson"]["score"]);

        }).catch(function (error) {
            console.log(error);
        });
}

export const DataQuality = (
    {
        userid,
        setOrigDataQuality
    }) => {

    const [dqChartVals, setDqChartVals] = useState({
        "score": 0.0,
        "quality_class": "Unknown",
        "issues": ["class imbalance", "outliers", "feature correlation", "data redundancy", "data drift", "data leakage"],
        "issue_val": [0, 0, 0, 0, 0, 0]
    });

    useEffect(() => {
        GetDataQuality({ userid, setDqChartVals, setOrigDataQuality });
    }, []);
    // Data Quality Gauage Chart Color
    const dqChartColor = dqChartVals["score"] > 0.8 ? "#244CB1" : dqChartVals["score"] > 0.5 ? "#1363DF" : "#67A3FF"

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
                        percent={dqChartVals["score"]}
                        textColor={"black"}
                        hideText={true}
                        colors={[
                            (dqChartVals["score"] > 0.0 ? dqChartColor : '#E5E5E5'),
                            (dqChartVals["score"] > 0.5 ? dqChartColor : '#E5E5E5'),
                            (dqChartVals["score"] > 0.8 ? dqChartColor : '#E5E5E5')
                        ]}
                        style={{ width: "12vw" }}
                    />
                </div>
            </div>
            <div className="dq-score">
                <div>
                    {dqChartVals["quality_class"]} - {Math.round((dqChartVals["score"] * 100 + Number.EPSILON) * 10) / 10}%
                </div>
            </div>
            <div className="dq-tag">
                <div>
                    {`The data quality is ${dqChartVals.quality_class.toLowerCase()} because of the following potential data issues.`}
                </div>
            </div>
            <div className="dq-info">
                <div className="dq-info-left">
                    <div className='chart-container-info'>
                        <UpRedArrow /> &nbsp;{DATA_ISSUE_FRIENDLY_NAMES_Eng[dqChartVals.issues[0]]} : <b>{- Math.round((dqChartVals.issue_val[0] / 6 + Number.EPSILON) * 10) / 10}%</b>
                    </div>
                    <div className='chart-container-info'>
                        <UpRedArrow /> &nbsp;{DATA_ISSUE_FRIENDLY_NAMES_Eng[dqChartVals.issues[1]]} : <b>{- Math.round((dqChartVals.issue_val[1] / 6 + Number.EPSILON) * 10) / 10}%</b>
                    </div>
                </div>
                <div className='dq-info-right'>
                    <div className='chart-container-info'>
                        <UpRedArrow /> &nbsp;{DATA_ISSUE_FRIENDLY_NAMES_Eng[dqChartVals.issues[2]]} : <b>{- Math.round((dqChartVals.issue_val[2] / 6 + Number.EPSILON) * 10) / 10}%</b>
                    </div>
                    <div className='chart-container-info'>
                        <UpRedArrow /> &nbsp;{DATA_ISSUE_FRIENDLY_NAMES_Eng[dqChartVals.issues[3]]} : <b>{- Math.round((dqChartVals.issue_val[3] / 6 + Number.EPSILON) * 10) / 10}%</b>
                    </div>
                </div>
            </div>
        </div>
    </div>);
};