import React from 'react';
import { useRef } from 'react';
import 'antd/dist/antd.css';
import "./DataGenController.css"
import { InfoLogo } from '../Icons/InfoLogo.jsx';
import { Empty } from 'antd';

export const EmptyDataGenController = (
    {
    }) => {
    console.log('Empty Data Gen Controller');
    const handleChange = (value) => {
        console.log(`selected ${value}`);
    };



    return (<div className="dash-container-gen-controller">
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
    </div>)
};