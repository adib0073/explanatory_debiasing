import React from 'react';
import { useRef, useState } from 'react';
import 'antd/dist/antd.css';
import "./DataGenController.css";
import { InfoLogo } from '../Icons/InfoLogo.jsx';
import { EmptyDataGenController } from './EmptyDataGen.jsx';
import { GenDataTable } from './GenDataTable.jsx';
import { BiasAwareness } from './BiasAwareness.jsx';
import { Tooltip } from 'antd';

export const DataGenController = (
    {
        userid,
        showGDTable,
        setShowGDTable,
        genData,
        setGenData,
        genDataAcc,
        genDataQuality,
        showBiasScreen,
        setShowBiasScreen,
        augTable,
        phase,
        datenow,
        origDataAcc,
        origDataQuality   
    }) => {


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
                            userid={userid}
                            gen_acc={genDataAcc}
                            gen_dq={genDataQuality}
                            default_acc={origDataAcc}
                            default_dq={origDataQuality}
                            data={genData}
                            setData={setGenData}
                            setShowGDTable={setShowGDTable}
                            setShowBiasScreen={setShowBiasScreen}
                        />
                        :
                        (showGDTable == false && showBiasScreen == true)
                            ?
                            <BiasAwareness
                                userid={userid}
                                setShowGDTable={setShowGDTable}
                                setShowBiasScreen={setShowBiasScreen}
                                genData={genData}
                                augTable={augTable}
                                gen_acc={genDataAcc}
                                gen_dq={genDataQuality}
                                origDataAcc={origDataAcc}
                                origDataQuality={origDataQuality}     
                            />
                            :
                            <EmptyDataGenController
                                userid={userid}
                                setShowGDTable={setShowGDTable}
                                setShowBiasScreen={setShowBiasScreen}
                                phase={phase}
                                datenow={datenow}
                            />
                }
            </div>
        </div>
    </div>)
};