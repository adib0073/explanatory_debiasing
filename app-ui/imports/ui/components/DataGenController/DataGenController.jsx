import React from 'react';
import { useRef } from 'react';
import 'antd/dist/antd.css';
import "./DataGenController.css";
import { InfoLogo } from '../Icons/InfoLogo.jsx';
import { EmptyDataGenController } from './EmptyDataGen.jsx';
import { GenDataTable } from './GenDataTable.jsx';

export const DataGenController = (
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
                <GenDataTable  gen_acc={85} gen_dq={90} default_acc={80} default_dq={80}/>
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