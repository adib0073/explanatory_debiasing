import React from 'react';
import { useRef, useState } from 'react';
import 'antd/dist/antd.css';
import "./DataGenController.css";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Table, Switch, Tag, Space } from 'antd';
import { greenFont, redFont } from '../../Constants.jsx';
import { CustomTableComponent } from './CustomTableComponent.jsx';

export const GenDataTable = (
    {
        gen_acc,
        default_acc,
        gen_dq,
        default_dq,
        data,
        setData,
        setShowGDTable,
        setShowBiasScreen,
    }) => {

    const onChangeSortSwitch = (checked) => {
        setSortSwitch(!sortSwitch);
    };

    const onChangeFilterSwitch = (checked) => {
        setFilterSwitch(!filterSwitch);
    };

    const [sortSwitch, setSortSwitch] = useState(false);
    const [filterSwitch, setFilterSwitch] = useState(false);

    const handleTrainButton = (value) => {
        // Show Bias Awareness Screen First
        if (window.confirm("Are you ready to proceed?")) {
            setShowGDTable(false);
            setShowBiasScreen(true);
        }
    };

    const handleCancelButton = (value) => {
        // Show Bias Awareness Screen First
        if (window.confirm("Are you sure to discard the generated data? You have to generate new data again using the augmentation controller if you press ok.")) {
            setShowGDTable(false);
            setShowBiasScreen(false);
        }
    };

    return (
        <>
            <div className='gd-subtitle'>
                <div className='gd-subtitle-left'>
                    <div>
                        Estimated prediction accuracy on generated data:
                        <span style={{ color: (gen_acc > default_acc) ? greenFont : redFont }}>
                            &nbsp;{gen_acc} %
                        </span>
                    </div>
                    <div>
                        Estimated data quality of generated data:
                        <span style={{ color: (gen_dq > default_dq) ? greenFont : redFont }}>
                            &nbsp;{gen_dq} %
                        </span>
                    </div>
                </div>
                <div className='gd-subtitle-right'>
                    <div className='gd-subtitle-right-row'>
                        Sort:
                        <div className='gd-subtitle-right-switch'>
                            <Switch
                                size="small"
                                onChange={onChangeSortSwitch} />
                        </div>
                    </div>
                    <div className='gd-subtitle-right-row'>
                        Filter:
                        <div className='gd-subtitle-right-switch'>
                            <Switch
                                size="small"
                                onChange={onChangeFilterSwitch} />
                        </div>
                    </div>
                </div>
            </div>
            <div className='generated-data-holder'>
                <div className='datagen-holder'>
                    <CustomTableComponent
                        isSort={sortSwitch}
                        isFilter={filterSwitch}
                        data={data}
                        setData={setData}
                    />
                </div>
            </div>
            <div className='gd-buttons'>
                <button
                    className="reset-button"
                    type="submit"
                >
                    Restore to defaults
                </button>
                <button
                    className="cancel-button"
                    type="submit"
                    onClick={handleCancelButton}
                >
                    Cancel changes
                </button>
                <button
                    className="train-button"
                    type="submit"
                    onClick={handleTrainButton}
                >
                    Save and Re-train
                </button>

            </div>
        </>
    )
};