import { Button, Col, Divider, Form, Input, message, Row, Select, Table } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getStoreRequisitionHeadersSlice } from '../../../../actions/triage-actions/getStoreRequisitionHeadersSlice'
import { getItemsSlice } from '../../../../actions/triage-actions/getItemsSlice'
import { getItemUnitsOfMeasureSlice } from '../../../../actions/triage-actions/getItemUnitsOfMeasureSlice'
import { getDressingSlice } from '../../../../actions/triage-actions/getDressingSlice'
import { postDressingsReducer } from '../../../../reducers/triage-reducers/postDressingsReducer'
import { SaveOutlined } from '@ant-design/icons'

const Dressing = ({ observationNumber, staffNo }) => {

    const dispatch = useDispatch();
    const { requisitionHeaders } = useSelector((state) => state.getStoreRequisitionHeaders);
    const { items } = useSelector((state) => state.getItems);
    const { itemUnitsOfMeasure } = useSelector((state) => state.getItemUnits);
    const { dressing } = useSelector((state) => state.getDressing);
    const { dressingsLoading } = useSelector((state) => state.postDressings);

    const onFinish = (values) => {
        const { processNumber, itemNumber, unitsOfMeasure, quantity, injectionRemarks } = values.dressing;

        const createDressing = {
            processNo: processNumber,
            itemNo: itemNumber,
            unitOfMeasure: unitsOfMeasure,
            quantity,
            remarks: injectionRemarks,
            observationNo: observationNumber,
            staffNo: staffNo,
            myAction: "create"
        }

        //check if vitals exists ifs so update else create
        dispatch(postDressingsReducer(createDressing)).then((data) => {
            if (data?.status === "success") {
                message.success(data?.status);
                // dispatch(getVitalsLinesSlice(patientNo));
            } else {
                message.error('Error saving dressings');
            }
        })

        dispatch(getDressingSlice(observationNumber));

    }

    useEffect(() => {
        dispatch(getStoreRequisitionHeadersSlice())
    }, [dispatch])

    useEffect(() => {
        dispatch(getItemsSlice())
    }, [dispatch])

    useEffect(() => {
        dispatch(getItemUnitsOfMeasureSlice())
    }, [dispatch])

    useEffect(() => {
        dispatch(getDressingSlice(observationNumber))
    }, [dispatch, observationNumber])


    const columns = [
        {
            title: 'Item Number',
            dataIndex: 'itemNo',
            key: 'itemNo',
        },
        {
            title: 'Unit of Measure',
            dataIndex: 'unitOfMeasure',
            key: 'unitOfMeasure',
        },
    ]

    const [ItemNo, ProcessNo, UnitOfMeasure, Remarks, ObservationNo, Quantity] = dressing

    const dataSource = [
        {
            key: ObservationNo,
            quantity: Quantity,
            itemNo: ItemNo,
            processNumber: ProcessNo,
            unitOfMeasure: UnitOfMeasure,
            remarks: Remarks
        }
    ]

    return (
        <div>
            <Form layout="vertical"

                onFinish={onFinish}
                initialValues={{
                    dressing: {
                        processNumber: '',
                        itemNumber: '',
                        unitsOfMeasure: '',
                        quantity: '',
                        injectionRemarks: '',
                    },
                }}
                autoComplete="off"

            >

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Item No" name={['dressing', 'itemNumber']}
                            hasFeedback
                            rules={[{ required: true, message: 'Please input item no!' }]}
                        >
                            <Select
                                key={'location'}
                                style={{ width: '100%' }}
                                optionFilterProp="label"
                                options={items.map((item) => ({ label: item.Description, value: item.No }))}
                                placeholder="Select item number"
                                showSearch

                            >
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Quantity" name={['dressing', 'quantity']}
                            hasFeedback
                        >
                            <Input type='number'

                            />
                        </Form.Item>
                    </Col>
                    {/* <Col span={12}>
                        <Form.Item label="Unit of measure" name={['dressing', 'unitsOfMeasure']}
                            hasFeedback
                        >
                            <Select
                                key={'location'}
                                style={{ width: '100%' }}
                                optionFilterProp="label"
                                options={itemUnitsOfMeasure.map((itemUnit) => ({ label: itemUnit.ItemNo, value: itemUnit.ItemNo }))}
                                placeholder="Select units of measure"
                                showSearch

                            >
                            </Select>

                        </Form.Item>
                    </Col> */}
                </Row>
                <Row gutter={16}>
                    {/* <Col span={12}>
                        <Form.Item label="Quantity" name={['dressing', 'quantity']}
                            hasFeedback
                        >
                            <Input type='number'

                            />
                        </Form.Item>
                    </Col> */}
                    <Col span={12}>
                        {/* <Form.Item label="Process No" name={['dressing', 'processNumber']}
            rules={[{ required: true, message: 'Please input process no!' }]}
            hasFeedback
        >
         <Select 
            key={'location'}
            style={{ width: '100%' }}
            optionFilterProp="label"
            options={requisitionHeaders} 
            placeholder="Select process number"
            
        >
        </Select>
        </Form.Item> */}
                    </Col>
                </Row>


                <Row>
                    <Col span={24}>
                        <Form.Item label="Dressing Remarks" name={['dressing', 'injectionRemarks']}
                            hasFeedback
                        >
                            <TextArea
                                autoSize={{
                                    minRows: 3,
                                    maxRows: 5,
                                }}

                                name='injectionRemarks'
                            />
                        </Form.Item>
                        <Col span={12}>
                            <Form.Item >
                                <Button type="primary" htmlType="submit" loading={dressingsLoading}>
                                    <SaveOutlined /> Save dressings</Button>
                            </Form.Item>
                        </Col>
                    </Col>
                </Row>
            </Form>

            {
                dressing && Object.keys(dressing).length > 0 && (
                    <div style={{ marginTop: '10px' }}>
                        <Divider />
                        <Table columns={columns}
                            dataSource={dataSource}
                            pagination={false}
                            expandable={{
                                expandedRowRender: (record) => (
                                    <p style={{ margin: 0 }}>

                                        Quantity : {record.quantity},
                                        Remarks : {record.remarks},
                                    </p>
                                ),
                                rowExpandable: (record) => record.name !== 'Not Expandable',
                            }}
                        />
                    </div>
                )
            }

        </div>
    )
}

export default Dressing

//propTypes validation

Dressing.propTypes = {
    observationNumber: PropTypes.string.isRequired,
    staffNo: PropTypes.string.isRequired,
}

