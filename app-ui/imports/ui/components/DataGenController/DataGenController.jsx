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

    const [interactData, setInteractData] = useState({
        "component": null,
        "clicks": 0,
        "time": 0,
        "clickList": []
    });

    console.log(interactData);

    return (<div className="dash-container-gen-controller">
        <div className="chart-title-box">
            <div className="chart-title">
                Generated Data Controller
            </div>
            <Tooltip
                placement="top"
                title={"This component allows to validate and modify the generated data."
                    + "\n You can edit each record if you think there are problems in the generated data and unrealistic records are generated."
                    + "\n If the generated data is irrelevant, you can also remove the record completely."
                    + "\n You can filter or sort to explore the records better."
                }
                overlayStyle={{ maxWidth: '500px' }}
            >
                <div className="chart-icons">
                    <InfoLogo />
                </div>
            </Tooltip>
        </div>
        <div className='chart-container'>
            <div className="gd-container" >
                {
                    (showGDTable == true && showBiasScreen == false)
                        ? 
                        <GenDataTable
                            userid={userid}
                            gen_acc={genDataAcc}
                            gen_dq={genDataQuality}
                            default_acc={origDataAcc}
                            default_dq={origDataQuality}
                            data={genData}
                            setData={setGenData}
                            setShowGDTable={setShowGDTable}
                            setShowBiasScreen={setShowBiasScreen}
                            interactData={interactData}
                            setInteractData={setInteractData}
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
                                interactData={interactData}
                                setInteractData={setInteractData}
                            />
                            :
                            <EmptyDataGenController
                                userid={userid}
                                setShowGDTable={setShowGDTable}
                                setShowBiasScreen={setShowBiasScreen}
                                phase={phase}
                                datenow={datenow}
                                setInteractData={setInteractData}
                            />
                }
            </div>
        </div>
    </div>)
};