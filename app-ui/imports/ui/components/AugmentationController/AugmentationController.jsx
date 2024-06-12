import React from 'react';
import { useRef, useState } from 'react';
import 'antd/dist/antd.css';
import "./AugmentationController.css"
import { InfoLogo } from '../Icons/InfoLogo.jsx';
import { Select, Table, InputNumber } from 'antd';
import { AUGMENT_VARIABLES, FRIENDLY_NAMES_ENG } from '../../Constants.jsx';

export const AugmentationController = (
    {
        showGDTable,
        setShowGDTable,
        userid
    }) => {

    const [augSettings, setAugSettings] = useState({
        "numSamples": 100,
        "predCategory": "Both",
        "repThres": 80,
        "covThres": 300,
        "covRateThres": 80
    })

    const [augTable, setAugTable] = useState({
        "Age": {
            "type": "numerical",
            "selectedOptions": []
        },
        "Gender": {
            "type": "categorical",
            "selectedOptions": []
        },
        "BMI": {
            "type": "numerical",
            "selectedOptions": []
        },
        "SBP": {
            "type": "numerical",
            "selectedOptions": []
        },
        "DBP": {
            "type": "numerical",
            "selectedOptions": []
        },
        "FPG": {
            "type": "numerical",
            "selectedOptions": []
        },
        "Chol": {
            "type": "numerical",
            "selectedOptions": []
        },
        "Tri": {
            "type": "numerical",
            "selectedOptions": []
        },
        "HDL": {
            "type": "numerical",
            "selectedOptions": []
        },
        "LDL": {
            "type": "numerical",
            "selectedOptions": []
        },
        "ALT": {
            "type": "numerical",
            "selectedOptions": []
        },
        "BUN": {
            "type": "numerical",
            "selectedOptions": []
        },
        "CCR": {
            "type": "numerical",
            "selectedOptions": []
        },
        "FFPG": {
            "type": "numerical",
            "selectedOptions": []
        },
        "smoking": {
            "type": "categorical",
            "selectedOptions": []
        },
        "drinking": {
            "type": "categorical",
            "selectedOptions": []
        },
        "family_history": {
            "type": "categorical",
            "selectedOptions": []
        },
    })

    const handleAugSetting = (settingType, value) => {
        setAugSettings({
            ...augSettings,
            [settingType]: value
        });
    }

    const handleAugTableChange = (feature, value) => {
        const updatedFeature = {
            ...augTable[feature],
            "selectedOptions": value
        }

        setAugTable({
            ...augTable,
            [feature]: updatedFeature
        });
    };

    console.log(augTable)

    const handleGenButton = (value) => {
        console.log(showGDTable);
        setShowGDTable(!showGDTable); // #TO-DO: Temporary Toggle Set
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
                                    onChange={(value) => {
                                        handleAugTableChange(feature = record.key, value = value)
                                    }}
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

    const ac_data = []
    for (const [key, value] of Object.entries(AUGMENT_VARIABLES)) {
        ac_data.push({
            "key": key,
            "feature": FRIENDLY_NAMES_ENG[key],
            "type": 'categorical',
            "values": value["options"]
        })
    }

    return (<div className="dash-container-aug-controller">
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
                    <div className='label-sub-left'>
                        Number of samples: &nbsp;
                        <InputNumber
                            min={0}
                            defaultValue={augSettings.numSamples}
                            onChange={(value) => {
                                handleAugSetting(settingType = "numSamples", value = value)
                            }}
                            size='small'
                            style={{ width: '4vw', fontSize: '1.8vh' }} />
                    </div>
                    <div className='label-sub-right'>
                        Prediction category: &nbsp;
                        <Select
                            defaultValue={augSettings.predCategory}
                            onChange={(value) => {
                                handleAugSetting(settingType = "predCategory", value = value)
                            }}
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
            </div>
            <div className="ac-info-label">
                <div className='ac-info-label-sub'>
                    <div>
                        Representation Rate Threshold: &nbsp;
                        <InputNumber
                            min={0}
                            max={100}
                            defaultValue={augSettings.repThres}
                            onChange={(value) => {
                                handleAugSetting(settingType = "repThres", value = value)
                            }}
                            size='small'
                            formatter={(value) => `${value}%`}
                            parser={(value) => value?.replace('%', '')}
                            style={{ width: '4vw', fontSize: '1.8vh' }} />
                    </div>
                </div>
                <div className='ac-info-label-sub'>
                    <div>
                        Coverage Threshold: &nbsp;
                        <InputNumber
                            min={0}
                            defaultValue={augSettings.covThres}
                            onChange={(value) => {
                                handleAugSetting(settingType = "covThres", value = value)
                            }}
                            size='small'
                            style={{ width: '4vw', fontSize: '1.8vh' }} />
                    </div>
                </div>
                <div className='ac-info-label-sub'>
                    <div>
                        Coverage Rate Threshold: &nbsp;
                        <InputNumber
                            min={0}
                            max={100}
                            defaultValue={augSettings.covRateThres}
                            onChange={(value) => {
                                handleAugSetting(settingType = "covRateThres", value = value)
                            }}
                            size='small'
                            formatter={(value) => `${value}%`}
                            parser={(value) => value?.replace('%', '')}
                            style={{ width: '4vw', fontSize: '1.8vh' }} />
                    </div>
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
                    onClick={handleGenButton}
                >
                    Generate
                </button>
            </div>
        </div>
    </div>);
};