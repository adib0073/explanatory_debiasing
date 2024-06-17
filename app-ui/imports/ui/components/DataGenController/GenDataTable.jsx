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
        setData
    }) => {

    const onChangeSortSwitch = (checked) => {
        setSortSwitch(!sortSwitch);
    };

    const onChangeFilterSwitch = (checked) => {
        setFilterSwitch(!filterSwitch);
    };

    const [sortSwitch, setSortSwitch] = useState(false);
    const [filterSwitch, setFilterSwitch] = useState(false);

    return (
        <>
            <div className='gd-subtitle'>
                <div className='gd-subtitle-left'>
                    <div>
                        Prediction accuracy on generated data:
                        <span style={{ color: (gen_acc > default_acc) ? greenFont : redFont }}>
                            &nbsp;{gen_acc} %
                        </span>
                    </div>
                    <div>
                        Data quality of generated data:
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
                >
                    Cancel changes
                </button>
                <button
                    className="train-button"
                    type="submit"
                >
                    Save and Re-train
                </button>

            </div>
        </>
    )
};