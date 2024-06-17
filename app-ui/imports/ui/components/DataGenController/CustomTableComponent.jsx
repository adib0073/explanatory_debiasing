import React from 'react';
import { useRef, useState } from 'react';
import 'antd/dist/antd.css';
import "./DataGenController.css";
import { Form, Input, InputNumber, Popconfirm, Table, Typography, Tag, Space } from 'antd';
import { ALL_FEATURES, AUGMENT_VARIABLES, FRIENDLY_NAMES_ENG, redFont } from '../../Constants';

function titleCase(str) {
    return str.toLowerCase().split(' ').map(function (word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
}

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number'
        ? <InputNumber />
        : <Input onInput={e => e.target.value = titleCase(e.target.value)} />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

export const CustomTableComponent = (
    {
        isSort,
        isFilter,
        data,
        setData
    }) => {



    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record) => record.key === editingKey;
    const handleDelete = (key) => {
        const newData = data.filter((item) => item.key !== key);
        setData(newData);
    };

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };


    const edit = (record) => {
        form.setFieldsValue({
            name: '',
            age: '',
            address: '',
            ...record,
        });
        setEditingKey(record.key);
    };
    const cancel = () => {
        setEditingKey('');
    };
    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };
    const columns = [
        {
            title: 'Edit',
            dataIndex: 'edit',
            fixed: 'left',
            width: "5vw",
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span style={{ display: 'flex', flexWrap: 'wrap' }}>
                        <Typography.Link
                            onClick={() => save(record.key)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a style={{ color: 'gray' }}>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Edit
                    </Typography.Link>
                );
            },
        },
        {
            title: 'Confidence',
            dataIndex: 'conf',
            width: "8vw",
            ellipsis: true,
            editable: false,
            filters: (isFilter) ? [
                {
                    text: 'HIGH',
                    value: 'High',
                },
                {
                    text: 'MEDIUM',
                    value: 'Medium',
                },
                {
                    text: 'LOW',
                    value: 'Low',
                }
            ] : null,
            showSorterTooltip: {
                target: 'full-header',
            },
            onFilter: (value, record) => record.conf.indexOf(value) === 0,
            sorter: (isSort) ? (a, b) => a.conf.length - b.conf.length : null,
            render: (_, record) => {
                let color = 'red'
                if (record.conf === 'High') {
                    color = 'green'
                }
                else if (record.conf === 'Medium') {
                    color = 'geekblue'
                }
                return (
                    <span>
                        <Tag color={color} key={record.conf}>
                            {record.conf.toUpperCase()}
                        </Tag>
                    </span >)
            },
        },
        {
            title: 'Prediction',
            dataIndex: 'pred',
            editable: false,
            ellipsis: true,
            sorter: (isSort) ? (a, b) => a.pred.length - b.pred.length : null,
            render: (_, record) => {
                let color = 'black'
                if (record.pred === 'Diabetic') {
                    color = '#244CB1'
                }
                else if (record.pred === 'Non-diabetic') {
                    color = '#999999'
                }
                return (
                    <span style={{ color: color, fontWeight: 500 }}>
                        {record.pred}
                    </span >)
            }
        },
    ];

    for (let i = 0; i < ALL_FEATURES.length; i++) {
        columns.push({
            title: FRIENDLY_NAMES_ENG[ALL_FEATURES[i]],
            dataIndex: ALL_FEATURES[i],
            editable: true,
            ellipsis: true,
            width: "10vw",
            sorter: (isSort)
                ?
                (AUGMENT_VARIABLES[ALL_FEATURES[i]].type == "categorical")
                    ?
                    (a, b) => a[ALL_FEATURES[i]].length - b[ALL_FEATURES[i]].length
                    :
                    (a, b) => a[ALL_FEATURES[i]] - b[ALL_FEATURES[i]]
                : null,
        })
    }
    // Add Remove Option
    columns.push({
        title: 'Remove',
        dataIndex: 'remove',
        width: "6vw",
        fixed: 'right',
        render: (_, record) =>
            data.length >= 1 ? (
                <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                    <a>
                        <span style={{ color: redFont, fontSize: "1.5vh", textDecoration: "underline" }}>
                            Remove
                        </span>
                    </a>
                </Popconfirm>
            ) : null,
    });

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType:
                    ["Gender", "smoking", "drinking", "family_history"].includes(col.dataIndex)
                        ? 'text' : 'number',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    /*
    <Form form={form} component={false}>

        <Table
            components={{
                body: {
                    cell: EditableCell,
                },
            }}
            bordered
            dataSource={data}
            columns={mergedColumns}
            rowClassName="editable-row"
            style={
                { fontSize: "1.0vh" }
            }
            scroll={{
                x: "max-content",
                y: "30vh"
            }}
            pagination={{
                position: ["bottomLeft"],
                size: 'small',
                pageSize: 5,

            }}
        />
    </Form>
    */
    /*
    const col = []
    const colN = 15
    for (let i = 0; i < colN; i++) {
        col.push({
            title: `Col ${i + 1}`,
            dataIndex: `Col_${i + 1}`,
            fixed: (i < 2) ? 'left' : (i === colN - 1) ? 'right' : null
        })
    }

    const dataS = []
    const dsN = 20
    for (let i = 0; i < dsN; i++) {
        const rowdata = {}
        for (let colIndex = 0; colIndex < colN; colIndex++) {
            rowdata[`Col_${colIndex + 1}`] = `R${i + 1}C${colIndex + 1}`
        }
        dataS.push(rowdata)
    }
    <Table
        style={{ maxWidth: "45vw" }}
        bordered={true}
        columns={col}
        dataSource={dataS}
        scroll={{
            x: true,
            y: "30vh"
        }}
    />
    */
    console.log(data);
    return (
        <>
            <Form form={form} component={false}>

                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered={true}
                    dataSource={data}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    style={
                        {
                            maxWidth: "45vw"
                        }
                    }
                    scroll={{
                        x: "max-content",
                        y: "30vh"
                    }}
                    pagination={{
                        position: ["bottomLeft"],
                        size: 'small',
                        pageSize: 5,
                        showSizeChanger: false,

                    }}
                    showSorterTooltip={{
                        target: 'sorter-icon',
                    }}
                //onChange={onChange}
                />
            </Form>
        </>
    )
};