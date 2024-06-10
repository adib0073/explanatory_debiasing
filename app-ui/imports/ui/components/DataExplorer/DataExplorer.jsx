import React from 'react';
import { useRef, useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import "./DataExplorer.css"
import { InfoLogo } from '../Icons/InfoLogo.jsx';
import { HollowBullet } from '../Icons/HollowBullet.jsx';
import { UpGreenArrow } from '../Icons/UpGreenArrow.jsx';
import { DownRedArrow } from '../Icons/DownRedArrow.jsx';
import { BiasCountPlots } from '../BiasDetectionPlots/BiasCountPlots.jsx';
import { BiasAccPlots } from '../BiasDetectionPlots/BiasAccPlots.jsx';
import { Select } from 'antd';
import { BASE_API } from '../../Constants.jsx';
import axios from 'axios';

const GetDataExplorerInfo = ({ userid, setDeChartVals }) => {
    axios.get(BASE_API + '/getdataexplorer/?user=test' + userid)
        .then(function (response) {
            console.log(response.data["OutputJson"]);
            setDeChartVals({
                "overall_rr": response.data["OutputJson"]["overall_rr"],
                "threshold_rr": response.data["OutputJson"]["threshold_rr"],
                "overall_cr": response.data["OutputJson"]["overall_cr"],
                "threshold_cr": response.data["OutputJson"]["threshold_cr"],
                "feature_info": response.data["OutputJson"]["feature_info"],
            });

        }).catch(function (error) {
            console.log(error);
        });
}

export const DataExplorer = (
    {
        userid,
    }) => {
    const handleChange = (value) => {
        console.log(`selected ${value}`);
    };

    const [deChartVals, setDeChartVals] = useState({
        "overall_rr": 0.0,
        "threshold_rr": 0.0,
        "overall_cr": 0.0,
        "threshold_cr": 0.0,
        "feature_info": {},
    });

    useEffect(() => {
        GetDataExplorerInfo({ userid, setDeChartVals });
    }, []);

    return (<div className="dash-container-data-explorer">
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
                        {"Overall representation rate (RR) is :"}
                        &nbsp;<b>{deChartVals["overall_rr"]}</b>&nbsp;
                        {
                            ((deChartVals["overall_rr"] - deChartVals["threshold_rr"]) > 0) ?
                                <>
                                    <UpGreenArrow />
                                    &nbsp;
                                    {`${deChartVals["overall_rr"] - deChartVals["threshold_rr"]}% above threshold`}
                                </>
                                :
                                <>
                                    <DownRedArrow />
                                    &nbsp;
                                    {`${deChartVals["overall_rr"] - deChartVals["threshold_rr"]}% below threshold`}
                                </>
                        }
                    </div>
                    <div className='de-info'>
                        {"Overall data coverage is"} :
                        &nbsp; <b>{deChartVals["overall_cr"]}</b> &nbsp;
                        {
                            ((deChartVals["overall_cr"] - deChartVals["threshold_cr"]) > 0) ?
                                <>
                                    <UpGreenArrow />
                                    &nbsp;
                                    {`${deChartVals["overall_cr"] - deChartVals["threshold_cr"]}% above threshold`}
                                </>
                                :
                                <>
                                    <DownRedArrow />
                                    &nbsp;
                                    {`${deChartVals["overall_cr"] - deChartVals["threshold_cr"]}% below threshold`}
                                </>
                        }
                    </div>
                    <div className='de-info'>
                        {"Low RR and coverage indicates presence of potential bias in the variables"}
                    </div>
                </div>
                <div className="de-chart-container" >
                    <div className='de-variable-selector'>
                        Variable Selected: &nbsp;
                        <Select
                            defaultValue="both"
                            onChange={handleChange}
                            options={[
                                {
                                    value: 'age',
                                    label: 'Age',
                                },
                                {
                                    value: 'gender',
                                    label: 'Gender',
                                },
                                {
                                    value: 'bmi',
                                    label: 'BMI',
                                }
                            ]}
                            size='small'
                            style={{ width: '6vw', backgroundColor: '#E5E5E5', fontSize: '1.8vh' }}
                        />
                        &nbsp; <DownRedArrow /> &nbsp; {"RR: 61%"}
                        &nbsp; <DownRedArrow /> &nbsp; {"CR: 50%"}
                    </div>
                    <div className='de-charts'>
                        <div className='de-charts-sc'>
                            <BiasCountPlots x_values={['High', 'Low']} y_values={[2500, 1500]} coverage={[2500, 1500]} rr={[60, 40]} cov_thres={2000} />
                            <div className='de-charts-sc-legend'>
                                <div className="de-charts-sc-ltext">
                                    RR: 100%
                                </div>
                                <div className="de-charts-sc-colorbar"></div>
                                <div className="de-charts-sc-ltext">
                                    RR: 0%
                                </div>
                            </div>
                        </div>
                        <div className='de-charts-acc'>
                            <BiasAccPlots x_values={['High', 'Medium', 'Low']} y_values={[[75, 10, 81], [45, 35, 85]]} acc_thres={80} />
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
    </div>);
};