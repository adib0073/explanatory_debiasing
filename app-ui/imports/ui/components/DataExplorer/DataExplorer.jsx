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
import { Select, Empty } from 'antd';
const { Option } = Select;
import { BASE_API, FRIENDLY_NAMES_ENG } from '../../Constants.jsx';
import axios from 'axios';

const GetDataExplorerInfo = ({ userid, setDeChartVals, setRRDiff, setCRDiff }) => {
    axios.get(BASE_API + '/getdataexplorer/?user=test' + userid)
        .then(function (response) {
            console.log(response.data["OutputJson"]);
            setDeChartVals({
                "overall_rr": response.data["OutputJson"]["overall_rr"],
                "threshold_rr": response.data["OutputJson"]["threshold_rr"],
                "overall_cr": response.data["OutputJson"]["overall_cr"],
                "threshold_cr": response.data["OutputJson"]["threshold_cr"],
                "threshold_cov": response.data["OutputJson"]["threshold_cov"],
                "acc_threshold": response.data["OutputJson"]["acc_threshold"],
                "feature_info": response.data["OutputJson"]["feature_info"],
            });
            setRRDiff(response.data["OutputJson"]["overall_rr"] - response.data["OutputJson"]["threshold_rr"]);
            setCRDiff(response.data["OutputJson"]["overall_cr"] - response.data["OutputJson"]["threshold_cr"]);

        }).catch(function (error) {
            console.log(error);
        });
}

export const DataExplorer = (
    {
        userid,
    }) => {

    const variableFilter = (value) => {
        setVarName(value)
    };

    const [varName, setVarName] = useState(null);
    const [rrDiff, setRRDiff] = useState(0.0);
    const [crDiff, setCRDiff] = useState(0.0);

    const [deChartVals, setDeChartVals] = useState({
        "overall_rr": 0.0,
        "threshold_rr": 0.0,
        "overall_cr": 0.0,
        "threshold_cr": 0.0,
        "threshold_cov": 0.0,
        "acc_threshold": 0.0,
        "feature_info": {},
    });

    useEffect(() => {
        GetDataExplorerInfo({ userid, setDeChartVals, setRRDiff, setCRDiff });
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
                            (rrDiff > 0) ?
                                <>
                                    <UpGreenArrow />
                                    &nbsp;
                                    {`${rrDiff}% above threshold`}
                                </>
                                :
                                <>
                                    <DownRedArrow />
                                    &nbsp;
                                    {`${rrDiff}% below threshold`}
                                </>
                        }
                    </div>
                    <div className='de-info'>
                        {"Overall data coverage is"} :
                        &nbsp; <b>{deChartVals["overall_cr"]}</b> &nbsp;
                        {
                            (crDiff > 0) ?
                                <>
                                    <UpGreenArrow />
                                    &nbsp;
                                    {`${crDiff}% above threshold`}
                                </>
                                :
                                <>
                                    <DownRedArrow />
                                    &nbsp;
                                    {`${crDiff}% below threshold`}
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
                            defaultValue={"Please select:"}
                            size='small'
                            style={{ width: '6vw', backgroundColor: '#E5E5E5', fontSize: '1.8vh' }}
                            onChange={variableFilter}>
                            {
                                (Object.keys(deChartVals["feature_info"]).length > 0)
                                    ?
                                    Object.keys(deChartVals["feature_info"]).map((item, index) => {
                                        return (
                                            <Option key={index} value={item}>{FRIENDLY_NAMES_ENG[item]}</Option>
                                        );
                                    })
                                    :
                                    null
                            }
                        </Select>
                        {(varName != null)
                            ?
                            <>
                                {
                                    (deChartVals["feature_info"][varName]["avg_rr"] > deChartVals["threshold_rr"]) ?
                                        <>
                                            &nbsp;
                                            <UpGreenArrow />
                                            &nbsp;
                                            {`RR: ${deChartVals["feature_info"][varName]["avg_rr"]}%`}
                                        </>
                                        :
                                        <>
                                            &nbsp;
                                            <DownRedArrow />
                                            &nbsp;
                                            {`RR: ${deChartVals["feature_info"][varName]["avg_rr"]}%`}
                                        </>
                                }
                                {
                                    (deChartVals["feature_info"][varName]["cr"] > deChartVals["threshold_cr"]) ?
                                        <>
                                            &nbsp;
                                            <UpGreenArrow />
                                            &nbsp;
                                            {`CR: ${deChartVals["feature_info"][varName]["cr"]}%`}
                                        </>
                                        :
                                        <>
                                            &nbsp;
                                            <DownRedArrow />
                                            &nbsp;
                                            {`CR: ${deChartVals["feature_info"][varName]["cr"]}%`}
                                        </>
                                }
                            </>
                            :
                            null
                        }
                    </div>
                    <div className='de-charts'>
                        <div className='de-charts-sc'>
                            {(varName == null)
                                ?
                                <Empty description={"Please select a variable."} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                :
                                <>
                                    <BiasCountPlots x_values={Object.values(deChartVals.feature_info[varName]['categories'])}
                                        y_values={Object.values(deChartVals.feature_info[varName]['counts'])}
                                        coverage={Object.values(deChartVals.feature_info[varName]['counts'])}
                                        rr={Object.values(deChartVals.feature_info[varName]['RR'])}
                                        cov_thres={deChartVals.threshold_cov} />

                                    <div className='de-charts-sc-legend'>
                                        <div className="de-charts-sc-ltext">
                                            RR: 100%
                                        </div>
                                        <div className="de-charts-sc-colorbar"></div>
                                        <div className="de-charts-sc-ltext">
                                            RR: 0%
                                        </div>
                                    </div>
                                </>
                            }
                        </div>
                        <div className='de-charts-acc'>
                            {(varName == null)
                                ?
                                <Empty description={"Please select a variable."} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                :
                                <BiasAccPlots
                                    x_values={Object.values(deChartVals.feature_info[varName]['categories'])}
                                    y_values={
                                        [Object.values(deChartVals.feature_info[varName]['d_acc']),
                                        Object.values(deChartVals.feature_info[varName]['nd_acc'])]}
                                    acc_thres={deChartVals.acc_threshold} />
                            }
                        </div>
                    </div>
                    {(varName != null)
                        ?
                        <>
                            <div className="de-insights-container" >
                                Insights:
                                <div className='chart-container-info'>
                                    <HollowBullet /> &nbsp;
                                    {"RR is lowest for sub-category:"}
                                    &nbsp;
                                    <b>
                                        {Object.keys(deChartVals.feature_info[varName]['key_insights'][0])}
                                    </b>
                                </div>
                                <div className='chart-container-info'>
                                    <HollowBullet /> &nbsp;
                                    {"CR is lowest for sub-category:"}
                                    &nbsp;
                                    <b>
                                        {Object.keys(deChartVals.feature_info[varName]['key_insights'][1])}
                                    </b>
                                </div>
                                <div className='chart-container-info'>
                                    <HollowBullet /> &nbsp;
                                    {
                                        (Object.values(deChartVals.feature_info[varName]['key_insights'][2])
                                            >=
                                            Object.values(deChartVals.feature_info[varName]['key_insights'][3])
                                        )
                                            ?
                                            <>
                                                {"Accuracy is lowest for "} <b>{"diabetic patients "}</b>
                                                {"with sub-category"}
                                                &nbsp;
                                                <b>
                                                    {Object.keys(deChartVals.feature_info[varName]['key_insights'][2])}
                                                </b>
                                                &nbsp;
                                                {`for variable ${FRIENDLY_NAMES_ENG[varName]}`}
                                            </>
                                            :
                                            <>
                                                {"Accuracy is lowest for "} <b>{"non-diabetic patients "}</b>
                                                {"with sub-category"}
                                                &nbsp;
                                                <b>
                                                    {Object.keys(deChartVals.feature_info[varName]['key_insights'][3])}
                                                </b>
                                                &nbsp;
                                                {`for variable ${FRIENDLY_NAMES_ENG[varName]}`}
                                            </>
                                    }

                                </div>
                            </div>
                        </>
                        :
                        null
                    }
                </div>
            </div>
        </div>
    </div>);
};