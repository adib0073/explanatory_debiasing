import React from 'react';
import { useRef, useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import { Empty, InputNumber, Table, Select } from 'antd';
import './dash.css'
import { NavBar } from '../components/NavBar/NavBar.jsx';
import axios from 'axios';
import { InfoLogo } from '../components/Icons/InfoLogo.jsx';
import { HollowBullet } from '../components/Icons/HollowBullet.jsx';
import { UpGreenArrow } from '../components/Icons/UpGreenArrow.jsx';
import { UpRedArrow } from '../components/Icons/UpRedArrow.jsx';
import { DownRedArrow } from '../components/Icons/DownRedArrow.jsx';
import { DoughnutChart } from '../components/EstimatedRiskChart/DoughnutChart.jsx';
import { SystemOverview } from '../components/SystemOverview/SystemOverview.jsx';
import { DataExplorer } from '../components/DataExplorer/DataExplorer.jsx';
import { DataQuality } from '../components/DataQuality/DataQuality.jsx';


export const DASH = ({ user }) => {
    var userid = user.id;
    if (userid == null || userid == "") {
        userid = window.localStorage.getItem('userid');
    }

    useEffect(() => {
    }, []);

    const handleChange = (value) => {
        console.log(`selected ${value}`);
    };
    const ac_columns = [
        {
            title: 'Predictor Variable',
            dataIndex: 'feature',
            key: 'feature',
            width: '30%',
            render: (_, record) => (
                <>
                    <div className='ac-inner-cell-li'>
                        <div>
                            {record.feature}
                        </div>
                    </div>
                </>
            )
        },
        {
            title: 'Variable Type',
            dataIndex: 'type',
            key: 'type',
            hidden: true
        },
        {
            title: 'Variable Values',
            dataIndex: 'values',
            key: 'values',
            render: (_, record) => (
                (record.type == "categorical")
                    ?
                    <>
                        <div className='ac-inner-cell-cat'>
                            <div>
                                Select Category:&nbsp;
                            </div>

                            <div>
                                <Select
                                    mode="multiple"
                                    allowClear
                                    style={{
                                        width: '16vw',
                                    }}
                                    placeholder="Please select from the following:"
                                    onChange={handleChange}
                                    options={record.values.map((item) => ({
                                        value: item,
                                        label: item,
                                    }))}
                                />
                            </div>
                        </div>
                    </>
                    :
                    <>
                        <div className='ac-inner-cell'>
                            <div>
                                Select Range:
                            </div>
                            <div>
                                Lower Limit &nbsp;- &nbsp; <InputNumber min={0} defaultValue={record.values[0]} size='small' style={{ width: '4vw', fontSize: '1.8vh' }} />
                            </div>
                            <div>
                                Upper Limit &nbsp; - &nbsp; <InputNumber min={0} defaultValue={record.values[1]} size='small' style={{ width: '4vw', fontSize: '1.8vh' }} />
                            </div>
                        </div>
                    </>
            ),
        },
    ].filter(item => !item.hidden);

    const ac_data = [
        {
            key: '1',
            feature: 'Age',
            type: 'continuous',
            values: [0, 100],
        },
        {
            key: '2',
            feature: 'BMI',
            type: 'continuous',
            values: [10, 50],
        },
        {
            key: '3',
            feature: 'Gender',
            type: 'categorical',
            values: ['Male', 'Female'],
        },
        {
            key: '4',
            feature: 'Cholesterol',
            type: 'continuous',
            values: [1, 12],
        },
        {
            key: '5',
            feature: 'Family history of diabetes',
            type: 'categorical',
            values: ['Yes', 'No'],
        },
        {
            key: '6',
            feature: 'Blood Pressure',
            type: 'continuous',
            values: [100, 200],
        },
    ];

    return (
        <>
            <NavBar user={user} />
            <div className="dash-container">
                <div className="dash-container-left">
                    <SystemOverview />
                    <DataExplorer />
                    <DataQuality />
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
                            <div className="ac-subtitle">
                                Apply constraints to the generated data
                            </div>
                            <div className="ac-info-label">
                                <div className='ac-info-label-sub'>
                                    Number of samples: &nbsp; <InputNumber min={0} defaultValue={100} size='small' style={{ width: '4vw', fontSize: '1.8vh' }} />
                                </div>
                                <div className='ac-info-label-sub'>
                                    Prediction category: &nbsp;
                                    <Select
                                        defaultValue="both"
                                        onChange={handleChange}
                                        options={[
                                            {
                                                value: 'both',
                                                label: 'Both',
                                            },
                                            {
                                                value: 'diabetic',
                                                label: 'Diabetic',
                                            },
                                            {
                                                value: 'non-diabetic',
                                                label: 'Non-diabetic',
                                            }
                                        ]}
                                        size='small'
                                        style={{ width: '6vw', backgroundColor: '#E5E5E5', fontSize: '1.8vh' }}
                                    />
                                </div>
                            </div>
                            <div className='ac-feature-table'>
                                <Table
                                    columns={ac_columns}
                                    dataSource={ac_data}
                                    size='small'
                                    pagination={false}
                                    style={
                                        { fontSize: "1.5vh" }
                                    }
                                    scroll={{
                                        y: "25vh",
                                    }}
                                />
                            </div>
                            <div className='ac-buttons'>
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
                                <div className='gd-subtitle'>
                                    Please use the augmentation controller to generate data.
                                </div>
                                <div className='generated-data-holder'>
                                    <div className='empty-holder'>
                                        <Empty description={
                                            <span className='gd-empty-text'>
                                                There is no unsaved generated data.
                                                <br />
                                                Please use the Augmentation Controller to generate new data.
                                            </span>
                                        } />
                                    </div>
                                </div>
                                <div className='gd-buttons'>
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