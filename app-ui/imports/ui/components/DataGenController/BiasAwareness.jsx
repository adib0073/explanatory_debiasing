import React from 'react';
import { useRef, useState } from 'react';
import 'antd/dist/antd.css';
import "./DataGenController.css";
import { Collapse, Select } from 'antd';
import { redFont } from '../../Constants';
import { SelectionBiasPlots } from './SelectionBiasPlots';

const { Panel } = Collapse;

export const BiasAwareness = (
    {
        setShowGDTable,
        setShowBiasScreen,
    }) => {
    const handleChange = (value) => {
        console.log(`selected ${value}`);
    };

    const handleCancelButton = (value) => {
        // Return to previous screen
        setShowGDTable(true);
        setShowBiasScreen(false);
    };

    return (
        <>
            <div className='ba-subtitle'>
                <div>
                    Warning: Your suggested changes may introduce the following biases into the training data.
                    <br />
                    Please take a look at the following bias explanations and confirm again if you want to proceed.
                </div>
            </div>
            <div className='generated-data-holder'>
                <div className='ba-holder'>
                    <div className='ba-holder-header'>
                        Awareness for potential biases that may get introduced during the data generation process:
                    </div>
                    <Collapse accordion defaultActiveKey={['1']}>
                        <Panel header={"Selection Bias"} key="1"
                            className="collapse-panel-custom"
                            style={{ ["--header-border"]: "2px dashed #C4C4C4" }}>
                            <div className='ba-r1'>
                                <span>
                                    The augmentation process might have introduced selection bias for these variables:
                                </span>
                                &nbsp;
                                &nbsp;
                                <Select
                                    defaultValue="BMI"
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
                            </div>
                            <div className='ba-r2'>
                                <SelectionBiasPlots x_values={['High', 'Low']} y_values={[2500, 1500]} coverage={[2500, 1500]} rr={[60, 40]} cov_thres={2000} />
                            </div>
                            <div className='ba-r3'>
                                <p>
                                    Selection bias occurs when you have selected only one sub-category for the data generation process.
                                    To avoid this bias, please click on 'Go Back' and 'Clear Unsaved Data' to start the data generation process again.
                                </p>
                            </div>
                        </Panel>
                        <Panel
                            header={"Generation Bias"}
                            key="2"
                            className="collapse-panel-custom"
                            style={{ ["--header-border"]: "2px dashed #C4C4C4" }}
                        >
                            <div className='ba-r1'>
                                <span>
                                    Potential outliers have been found in the training dataset.
                                </span>
                                Options Here
                            </div>
                            <div className='ba-r2'>
                                Graph Here
                            </div>
                            <div className='ba-r3'>
                                <p>
                                    {"Description Here"}
                                </p>
                            </div>
                        </Panel>
                    </Collapse>
                </div>
            </div>
            <div className='ba-button-message'>
                Are you sure that you want to re-train the model with the generated data?
            </div>
            <div className='ba-buttons'>
                <button
                    className="ba-cancel-button"
                    type="submit"
                    onClick={handleCancelButton}
                >
                    Go Back
                </button>
                <button
                    className="ba-train-button"
                    type="submit"
                >
                    Confirm
                </button>
            </div>
        </>
    )
};