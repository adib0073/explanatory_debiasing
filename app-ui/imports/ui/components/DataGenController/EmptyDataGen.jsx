import React from 'react';
import { useRef } from 'react';
import 'antd/dist/antd.css';
import "./DataGenController.css";
import { Empty } from 'antd';

export const EmptyDataGenController = (
    {
    }) => {
    return (
        <>
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
        </>
    )
};