import React from 'react';
import { useRef } from 'react';
import 'antd/dist/antd.css';
import "./DataGenController.css";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Empty, Switch } from 'antd';
import { greenFont, redFont } from '../../Constants.jsx';

export const GenDataTable = (
    {
        gen_acc,
        default_acc,
        gen_dq,
        default_dq
    }) => {
    const onChange = (checked) => {
        console.log(`switch to ${checked}`);
    };

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
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={<CloseOutlined />}
                                size="small"
                                onChange={onChange} />
                        </div>
                    </div>
                    <div className='gd-subtitle-right-row'>
                        Filter:
                        <div className='gd-subtitle-right-switch'>
                            <Switch
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={<CloseOutlined />}
                                size="small"
                                onChange={onChange} />
                        </div>
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