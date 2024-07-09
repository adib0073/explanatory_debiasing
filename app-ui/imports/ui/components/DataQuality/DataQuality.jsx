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
import { greenFont, redFont, BASE_API, DATA_ISSUE_FRIENDLY_NAMES_Eng, DATA_ISSUE_DESC } from '../../Constants.jsx';
import axios from 'axios';
import { Tooltip } from 'antd';


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
            <Tooltip
                placement="top"
                title={
                    "This component shows the quality of the dataset. The potential issues present in the data and their negative impact in the quality score are highlighted in this component."
                }
                overlayStyle={{ maxWidth: '500px' }}
            >
                <div className="chart-icons">
                    <InfoLogo />
                </div>
            </Tooltip>
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
                <Tooltip
                    placement="top"
                    title={
                        "If the quality score is greater than 80, the quality is considered good. If the score is lesser than 50, it is considered as poor. Otherwise, the quality is considered as moderate."
                    }
                    overlayStyle={{ maxWidth: '500px' }}
                >
                    <div>
                        {dqChartVals["quality_class"]}: {Math.round((dqChartVals["score"] * 100 + Number.EPSILON) * 10) / 10}%
                    </div>
                </Tooltip>
            </div>
            <div className="dq-tag">

                <div>
                    {`The data quality is ${dqChartVals.quality_class.toLowerCase()} because of the following potential data issues.`}
                </div>
            </div>
            <div className="dq-info">
                <div className="dq-info-left">
                    <div className='chart-container-info'>
                        <Tooltip
                            placement="top"
                            title={DATA_ISSUE_DESC[dqChartVals.issues[0]]}
                            overlayStyle={{ maxWidth: '500px' }}
                        >
                            <UpRedArrow /> &nbsp;{DATA_ISSUE_FRIENDLY_NAMES_Eng[dqChartVals.issues[0]]}: <b>{- Math.round((dqChartVals.issue_val[0] / 6 + Number.EPSILON) * 10) / 10}%</b>
                        </Tooltip>
                    </div>
                    <div className='chart-container-info'>
                        <Tooltip
                            placement="top"
                            title={DATA_ISSUE_DESC[dqChartVals.issues[1]]}
                            overlayStyle={{ maxWidth: '500px' }}
                        >
                            <UpRedArrow /> &nbsp;{DATA_ISSUE_FRIENDLY_NAMES_Eng[dqChartVals.issues[1]]}: <b>{- Math.round((dqChartVals.issue_val[1] / 6 + Number.EPSILON) * 10) / 10}%</b>
                        </Tooltip>
                    </div>
                </div>
                <div className='dq-info-right'>
                    <div className='chart-container-info'>
                        <Tooltip
                            placement="top"
                            title={DATA_ISSUE_DESC[dqChartVals.issues[2]]}
                            overlayStyle={{ maxWidth: '500px' }}
                        >
                            <UpRedArrow /> &nbsp;{DATA_ISSUE_FRIENDLY_NAMES_Eng[dqChartVals.issues[2]]}: <b>{- Math.round((dqChartVals.issue_val[2] / 6 + Number.EPSILON) * 10) / 10}%</b>
                        </Tooltip>
                    </div>
                    <div className='chart-container-info'>
                        <Tooltip
                            placement="top"
                            title={DATA_ISSUE_DESC[dqChartVals.issues[3]]}
                            overlayStyle={{ maxWidth: '500px' }}
                        >
                            <UpRedArrow /> &nbsp;{DATA_ISSUE_FRIENDLY_NAMES_Eng[dqChartVals.issues[3]]}: <b>{- Math.round((dqChartVals.issue_val[3] / 6 + Number.EPSILON) * 10) / 10}%</b>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </div>
    </div >);
};