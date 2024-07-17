import React from 'react';
import { useRef, useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import "./DataGenController.css";
import { InfoLogo } from '../Icons/InfoLogo.jsx';
import { EmptyDataGenController } from './EmptyDataGen.jsx';
import { GenDataTable } from './GenDataTable.jsx';
import { BiasAwareness } from './BiasAwareness.jsx';
import { Tooltip } from 'antd';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';

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
        origDataQuality,
        tabHeight,
        tabWidth,
        setTabHeight,
        setTabWidth,
    }) => {

    const [interactData, setInteractData] = useState({
        "component": null,
        "clicks": 0,
        "time": 0,
        "clickList": []
    });

    //console.log(interactData);


    // Handle full screen
    const [isFullscreen, setIsFullscreen] = useState(false);
    const divRef = useRef(null);

    const toggleFullscreen = () => {
        if (!isFullscreen) {
            enterFullscreen();
        } else {
            exitFullscreen();
        }
    };
    const enterFullscreen = () => {
        if (divRef.current.requestFullscreen) {
            divRef.current.requestFullscreen();
        } else if (divRef.current.mozRequestFullScreen) { // Firefox
            divRef.current.mozRequestFullScreen();
        } else if (divRef.current.webkitRequestFullscreen) { // Chrome, Safari, and Opera
            divRef.current.webkitRequestFullscreen();
        } else if (divRef.current.msRequestFullscreen) { // IE/Edge
            divRef.current.msRequestFullscreen();
        }
        setIsFullscreen(true);
        setTabWidth(95);
        setTabHeight(75);
    };
    const exitFullscreen = () => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari, and Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
        setTabWidth(45)
        setTabHeight(45)
        setIsFullscreen(false);
    };


    useEffect(() => {
        const handleFullscreenChange = () => {
            console.log(document.fullscreenElement === divRef.current);
            if (document.fullscreenElement === divRef.current) {
                setTabWidth(95)
                setTabHeight(75)
            }
            else {
                setTabWidth(45);
                setTabHeight(45);
            }
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
        };
    }, []);

    return (
        <div className="dash-container-gen-controller"
            ref={divRef}
            style={{
                width: `${tabWidth + 5}vw`,
                position: 'relative',
                zIndex: 1000
            }}
        >
            <div className="chart-title-box">
                <div className="chart-title">
                    Generated Data Controller
                </div>

                <div className="chart-icons">
                    {
                        (showGDTable == true && showBiasScreen == false)
                            ?
                            <div>
                                {(isFullscreen)
                                    ?
                                    <FullscreenExitOutlined onClick={toggleFullscreen} />
                                    :
                                    <FullscreenOutlined onClick={toggleFullscreen} />
                                }
                            </div>
                            :
                            <Tooltip
                                placement="top"
                                title={"This component allows to validate and modify the generated data."
                                    + "\n You can edit each record if you think there are problems in the generated data and unrealistic records are generated."
                                    + "\n If the generated data is irrelevant, you can also remove the record completely."
                                    + "\n You can filter or sort to explore the records better."
                                }
                                overlayStyle={{ maxWidth: '500px' }}
                            >
                                <div>

                                    <InfoLogo />
                                </div>
                            </Tooltip>
                    }
                </div>
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
                                isFullscreen={isFullscreen}
                                tabWidth={tabWidth}
                                tabHeight={tabHeight}
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