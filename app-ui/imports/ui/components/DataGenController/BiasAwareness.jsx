import React from 'react';
import { useRef, useState } from 'react';
import 'antd/dist/antd.css';
import "./DataGenController.css";
import { Collapse, Select } from 'antd';
import { redFont } from '../../Constants';

const { Panel } = Collapse;

export const BiasAwareness = (
    {

    }) => {
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
                            <div className='data-issue-r1'>
                                <span>
                                    Potential outliers have been found in the training dataset.
                                </span>
                                Options Here
                            </div>
                            <div className='data-issue-r2'>
                                Graph Here
                            </div>
                            <div className='data-issue-r3'>
                                <p>
                                    {"Description Here"}
                                </p>
                            </div>
                        </Panel>
                        <Panel
                            header={"Generation Bias"}
                            key="2"
                            className="collapse-panel-custom"
                            style={{ ["--header-border"]: "2px dashed #C4C4C4" }}
                        >
                            <div className='data-issue-r1'>
                                <span>
                                    Potential outliers have been found in the training dataset.
                                </span>
                                Options Here
                            </div>
                            <div className='data-issue-r2'>
                                Graph Here
                            </div>
                            <div className='data-issue-r3'>
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