import React from 'react';
import { useRef, useState } from 'react';
import 'antd/dist/antd.css';
import "./DataGenController.css";
import { Form, Input, InputNumber, Popconfirm, Table, Typography, Tag, Space } from 'antd';
import { redFont } from '../../Constants';

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
                <div className='datagen-holder'>
                    Collapse here
                </div>
            </div>
            <div className='gd-buttons'>
                <button
                    className="cancel-button"
                    type="submit"
                >
                    Go Back
                </button>
                <button
                    className="train-button"
                    type="submit"
                >
                    Confirm
                </button>

            </div>
        </>
    )
};