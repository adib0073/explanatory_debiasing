import React from 'react';
import { useRef } from 'react';
import 'antd/dist/antd.css';
import "./DataGenController.css";
import { Empty } from 'antd';

export const GenDataTable = (
    {
    }) => {
    return (
        <>
            <div className='gd-subtitle'>
                <div>
                    Prediction accuracy on generated data: 85%
                    Prediction accuracy on generated data: 85%
                </div>
                <div>
                    Sort - switch
                    filer - switch
                </div>
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
        </>
    )
};