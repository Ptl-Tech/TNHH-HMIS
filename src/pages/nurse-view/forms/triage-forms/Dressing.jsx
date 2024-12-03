import { Button, Col, Form, Input, message, Row, Select } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getStoreRequisitionHeadersSlice } from '../../../../actions/triage-actions/getStoreRequisitionHeadersSlice'
import { getItemsSlice } from '../../../../actions/triage-actions/getItemsSlice'
import { getItemUnitsOfMeasureSlice } from '../../../../actions/triage-actions/getItemUnitsOfMeasureSlice'
import { getDressingSlice } from '../../../../actions/triage-actions/getDressingSlice'
import { postDressingsReducer } from '../../../../reducers/triage-reducers/postDressingsReducer'

const Dressing = ({ observationNumber, staffNo }) => {

    const dispatch = useDispatch();
    const { requisitionHeaders } = useSelector((state) => state.getStoreRequisitionHeaders);
    const { items } = useSelector((state) => state.getItems);
    const { itemUnitsOfMeasure } = useSelector((state) => state.getItemUnits);
    const { dressing } = useSelector((state) => state.getDressing);

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

        const updateDressing = {
            processNo: processNumber,
            itemNo: itemNumber,
            unitOfMeasure: unitsOfMeasure,
            quantity,
            remarks: injectionRemarks,
            observationNo: observationNumber,
            staffNo: staffNo,
            myAction: "update"
        }

         //check if vitals exists ifs so update else create
    
      if(Object.keys(dressing).length > 0) {
        // update vitals
        dispatch(postDressingsReducer(updateDressing)).then(()=>{
          message.success('successfully updated vitals');
        })
        
          
        }else{
          // create vitals
          dispatch(postDressingsReducer(createDressing)).then((data)=>{
            if(data?.status === "success"){
              message.success(data?.status);
              // dispatch(getVitalsLinesSlice(patientNo));
            }else{
              message.error('Error saving vitals data');
            }
          })
        }
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

  return (
    <Form layout="vertical"
    
        onFinish={onFinish}
        initialValues={{
        dressing: {
            observationNumber: observationNumber,
            processNumber: dressing?.processNo,
            itemNumber: dressing?.itemNo,
            unitsOfMeasure: dressing?.unitOfMeasure,
            quantity: dressing?.quantity,
            injectionRemarks: dressing?.remarks,
        },
        }}
    
    >
        <Row gutter={16}>
            <Col span={12}>
            <Form.Item label="Observation No" name={['dressing', 'observationNumber']}
                rules={[{ required: true, message: 'Please input observation no!' }]}
            >
                <Input type='text'
                disabled 
                />
            </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item label="Process No" name={['dressing', 'processNumber']}
                rules={[{ required: true, message: 'Please input process no!' }]}
            >
             <Select 
                key={'location'}
                style={{ width: '100%' }}
                optionFilterProp="label"
                options={requisitionHeaders} 
                placeholder="Select process number"
                
            >
            </Select>
            </Form.Item>
            </Col>
            </Row>

            <Row gutter={16}>
            <Col span={12}>
            <Form.Item label="Item No" name={['dressing', 'itemNumber']}
                rules={[{ required: true, message: 'Please input item no!' }]}
            >
                 <Select 
                key={'location'}
                style={{ width: '100%' }}
                optionFilterProp="label"
                options={items.map((item)=>({label: item.Description, value: item.No}))} 
                placeholder="Select item number"
                showSearch
                
            >
            </Select>
            </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item label="Unit of measure" name={['dressing', 'unitsOfMeasure']}>
            <Select 
                key={'location'}
                style={{ width: '100%' }}
                optionFilterProp="label"
                options={itemUnitsOfMeasure.map((itemUnit)=>({label: itemUnit.ItemNo, value: itemUnit.ItemNo}))} 
                placeholder="Select units of measure"
                showSearch
                
            >
            </Select>
                
            </Form.Item>
            </Col>
            </Row>
        
        <Row>
            <Col span={24}>
            <Form.Item label="Quantity" name={['dressing', 'quantity']}>
            <Input type='number' 
        
            />
            </Form.Item>
            </Col>
            </Row>

            <Row>
            <Col span={24}>
            <Form.Item label="Dressing Remarks" name={['dressing', 'injectionRemarks']}>
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
                    <Button type="primary" htmlType="submit">Save</Button>
                </Form.Item>
              </Col>
            </Col>
            </Row>
    </Form>
  )
}

export default Dressing

//propTypes validation

Dressing.propTypes = {
    observationNumber: PropTypes.string.isRequired,
    staffNo: PropTypes.string.isRequired,
}

