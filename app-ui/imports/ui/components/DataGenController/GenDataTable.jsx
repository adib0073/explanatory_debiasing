import React from 'react';
import { useRef } from 'react';
import 'antd/dist/antd.css';
import "./DataGenController.css";
import { Empty, Switch } from 'antd';

export const GenDataTable = (
    {
    }) => {
    const onChange = (checked) => {
        console.log(`switch to ${checked}`);
    };

    return (
        <>
            <div className='gd-subtitle'>
                <div>
                    <div>
                        Prediction accuracy on generated data: 85%
                    </div>
                    <div>
                        Prediction accuracy on generated data: 85%
                    </div>
                </div>
                <div>
                    <div>
                        Sort: <Switch defaultChecked onChange={onChange} />
                    </div>
                    <div>
                        Filter: <Switch defaultChecked onChange={onChange} />
                    </div>
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