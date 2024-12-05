import { Button, Col, DatePicker, Form, Input, message, Row, Select, TimePicker } from 'antd'
import TextArea from 'antd/es/input/TextArea'
const format = 'HH:mm';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getInjectionNumberSlice } from '../../../../actions/triage-actions/getInjectionNumberSlice';
import { postInjectionsSlice } from '../../../../actions/triage-actions/postInjectionsSlice';
import { getInjectionsSlice } from '../../../../actions/triage-actions/getInjectionsSlice';
import Loading from '../../../../partials/nurse-partials/Loading';

const Injections = ({ observationNumber, staffNo }) => {
    const dispatch = useDispatch()
    const { injectionsNumber } = useSelector((state) => state.getInjectionNumber);
    const {loadingInjections, injections} = useSelector((state) => state.getInjections);
    const { injectionsLoading } = useSelector((state) => state.getInjections);

    console.log(injectionsNumber)

    useEffect(() => {
        dispatch(getInjectionNumberSlice())
    }, [dispatch])

    useEffect(() => {
        dispatch(getInjectionsSlice(observationNumber))
    }, [dispatch, observationNumber])

    const onFinish = (values) => {
        const { injectionNo, injectionDate, injectionQuantity, injectionTime, injectionRemarks } = values.injections;

        const createInjection = {
            injectionNo,
            injectionDate: injectionDate
            ? {
                year: injectionDate.year(),
                month: injectionDate.month() + 1, // Month is zero-based
                day: injectionDate.date(),
              }
            : null,
            injectionQuantity,
            injectionTime: injectionTime.format(format),
            injectionRemarks,
            observationNo: observationNumber,
            staffNo: staffNo,
            posted: true,
            myAction: "create"
        }

        const updateInjection = {
            injectionNo,
            injectionDate: values.injectionDate
            ? {
                year: values.injectionDate.year(),
                month: values.injectionDate.month() + 1, // Month is zero-based
                day: values.injectionDate.date(),
              }
            : null,
            injectionQuantity,
            injectionTime: injectionTime.format(format),
            injectionRemarks,
            observationNo: observationNumber,
            staffNo: staffNo,
            posted: true,
            myAction: "create"
        }

        if(Object.keys(injections).length > 0) {
            // update vitals
            dispatch(postInjectionsSlice(updateInjection)).then(()=>{
              message.success('successfully updated allergies');
            })
            
              
            }else{
              // create vitals
              dispatch(postInjectionsSlice(createInjection)).then(()=>{
                
                  message.success('Injections has been saved');
              })
            }
    }


  return (
    <div>
        {
            loadingInjections ? (
                <Loading />
            ):(
                <Form layout="vertical"
        validateTrigger="onChange"
        onFinish={onFinish}
          initialValues={{
            injections: {
              observationNumber: observationNumber,
              injectionNo: injections?.InjectionNo || '',
              injectionDate: injections?.injectionDate || '',
              injectionQuantity: injections?.InjectionQuantity || '',
              injectionTime: injections?.InjectionTime || '',
              injectionRemarks: injections?.InjectionRemarks || '',
            },
          }}
    >
        <Row gutter={16}>
            <Col span={12}>
            <Form.Item label="Observation No" name={['injections', 'observationNumber']}
                rules={[{ required: true, message: 'Please input observation no!' }]}
            >
                <Input type='text' 
              
                name='observationNumber'
                disabled
                />
            </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item label="Injection No" name={['injections', 'injectionNo']}
                rules={[{ required: true, message: 'Please input injection no!' }]}
            >
            <Select 
                key={'location'}
                style={{ width: '100%' }}
                optionFilterProp="label"
                options={injectionsNumber} 
                placeholder="Select Injection No"
                
            >
            </Select>
            </Form.Item>
            </Col>
        </Row>
        <Row gutter={16}>
            <Col span={12}>
            <Form.Item label="Injection Quantity" name={['injections', 'injectionQuantity']}>
                <Input type='number' 
               
                name='injectionQuantity'
                />
            </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item label="Injection Date" name={['injections', 'injectionDate']}>
            <DatePicker style={{ width: '100%' }}
            
            />
            </Form.Item>
            </Col>
            </Row>
            <Row gutter={16}>
            <Col span={24}>
            <Form.Item label="Injection time" name={['injections', 'injectionTime']}>
                <TimePicker defaultValue={dayjs('12:08', format)} format={format} style={{ width: '100%' }} 
                     
                />
            </Form.Item>
            </Col>
            <Col span={24}>
            <Form.Item label="Injection Remarks" name={['injections', 'injectionRemarks']}>
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
                    <Button type="primary" htmlType="submit" loading={injectionsLoading}>Save injections</Button>
                </Form.Item>
              </Col>
            </Col>
        </Row>
    </Form>
            )
        }
    </div>
  )
}

export default Injections

Injections.propTypes = {
    observationNumber: PropTypes.string.isRequired,
    staffNo: PropTypes.string.isRequired
}