import React from 'react';
import { useRef, useState } from 'react';
import 'antd/dist/antd.css';
import "./DataGenController.css";
import { Form, Input, InputNumber, Popconfirm, Table, Typography, Tag, Space } from 'antd';
import { redFont } from '../../Constants';

const originData = [];
for (let i = 0; i < 99; i++) {
    originData.push({
        key: i.toString(),
        conf: (i % 2 == 0) ? 'High' : 'Low',
        pred: (i % 3 == 0) ? 'Diabetic' : 'Non-diabetic',
        name: `Edward ${i}`,
        age: 32,
        address: `Value. ${i}`,
    });
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
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
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
    }) => {



    const [form] = Form.useForm();
    const [data, setData] = useState(originData);
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record) => record.key === editingKey;
    const handleDelete = (key) => {
        const newData = data.filter((item) => item.key !== key);
        setData(newData);
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
                    <span>
                        <Typography.Link
                            onClick={() => save(record.key)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
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
            ellipsis: true,
            editable: false,
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
            render: (_, record) => {
                let color = 'black'
                if (record.pred === 'Diabetic') {
                    color = '#67A3FF'
                }
                else if (record.pred === 'Non-diabetic') {
                    color = '#999999'
                }
                return (
                    <span style={{color:color}}>
                        {record.pred}
                    </span >)
            }
        },
        {
            title: 'Var1',
            dataIndex: 'name',
            editable: true,
            ellipsis: true,
        },
        {
            title: 'Age',
            dataIndex: 'age',
            editable: true,
            ellipsis: true,
        },
        {
            title: 'Var2',
            dataIndex: 'address',
            editable: true,
            ellipsis: true,
        },
        {
            title: 'Var3',
            dataIndex: 'address',
            editable: true,
            ellipsis: true,
        },
        {
            title: 'Var4',
            dataIndex: 'address',
            editable: true,
            ellipsis: true,
        },
        {
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
        }

    ];
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                //inputType: col.dataIndex === 'age' ? 'number' : 'text',
                inputType: col.dataIndex === 'text',
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
    return (
        <>
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
                        {
                            fontSize: "1.0vh",
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

                    }}
                />
            </Form>
        </>
    )
};