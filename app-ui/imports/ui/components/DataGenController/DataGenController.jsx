import React from 'react';
import { useRef, useState } from 'react';
import 'antd/dist/antd.css';
import "./DataGenController.css";
import { InfoLogo } from '../Icons/InfoLogo.jsx';
import { EmptyDataGenController } from './EmptyDataGen.jsx';
import { GenDataTable } from './GenDataTable.jsx';
import { BiasAwareness } from './BiasAwareness.jsx';

export const DataGenController = (
    {
        showGDTable,
        setShowGDTable,
        genData,
        setGenData,
        genDataAcc,
        genDataQuality,
        showBiasScreen,
        setShowBiasScreen
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
                {
                    (showGDTable == true && showBiasScreen == false)
                        ? <GenDataTable
                            gen_acc={genDataAcc}
                            gen_dq={genDataQuality}
                            default_acc={80}
                            default_dq={80}
                            data={genData}
                            setData={setGenData}
                            setShowGDTable={setShowGDTable}
                            setShowBiasScreen={setShowBiasScreen}
                        />
                        :
                        (showGDTable == false && showBiasScreen == true)
                            ?
                            <BiasAwareness
                                setShowGDTable={setShowGDTable}
                                setShowBiasScreen={setShowBiasScreen}
                            />
                            :
                            <EmptyDataGenController />
                }
            </div>
        </div>
    </div>)
};