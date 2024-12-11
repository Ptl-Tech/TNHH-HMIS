import { Button, Col, DatePicker, Form, Input, message, Row, Select, TimePicker, Divider, Table } from 'antd'
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
import { SaveOutlined } from '@ant-design/icons';

const Injections = ({ observationNumber, staffNo }) => {
    const dispatch = useDispatch()
    const { injectionsNumber } = useSelector((state) => state.getInjectionNumber);
    const {getInjectionsLoading, getInjections} = useSelector((state) => state.getInjections);
    const { postInjectionsLoading } = useSelector((state) => state.postInjections);

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
      

        dispatch(postInjectionsSlice(createInjection)).then(()=>{
                
          message.success('Injections has been saved');
        }).catch((error)=>{
            message.error(error.message);
        })

        
      }

      const columns = [
        {
          title: 'Injection No',
          dataIndex: 'InjectionNo',
          key: 'InjectionNo',
        },
        {
          title: 'Injection Date',
          dataIndex: 'InjectionDate',
          key: 'InjectionDate',
        },
        {
          title: 'Injection Quantity',
          dataIndex: 'InjectionQuantity',
          key: 'InjectionQuantity',
        },
      ];
      
      
      const [ InjectionNo, InjectionDate, InjectionTime, InjectionQuantity, InjectionRemarks, ObservationNo] = getInjections
      const dataSource = [
        {
          key: ObservationNo,
          InjectionNo,
          InjectionDate,
          InjectionTime,
          InjectionQuantity,
          InjectionRemarks,
          ObservationNo
        }
    ]


  return (
    <div>
        {
            getInjectionsLoading ? (
                <Loading />
            ):(

        <div>
        <Form layout="vertical"
        validateTrigger="onChange"
        onFinish={onFinish}
          initialValues={{
            injections: {
              observationNumber: '',
              injectionNo: '',
              injectionDate: '',
              injectionQuantity: '',
              injectionTime: '',
              injectionRemarks: '',
            },
          }}
          >
      
        <Row gutter={16}>
            <Col span={12}>
                <Form.Item label="Injection Quantity" name={['injections', 'injectionQuantity']}>
                    <Input type='number' 
                
                    name='injectionQuantity'
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
            <Form.Item label="Injection time" name={['injections', 'injectionTime']}>
                <TimePicker defaultValue={dayjs('12:08', format)} format={format} style={{ width: '100%' }} 
                     
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
                    <Button type="primary" htmlType="submit" loading={postInjectionsLoading}>
                        <SaveOutlined />
                        Save injections
                    </Button>
                </Form.Item>
              </Col>
            </Col>
        </Row>
        </Form>

        {
          getInjections && Object.keys(getInjections).length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <Divider />
            <Table columns={columns} 
            dataSource={dataSource} 
            pagination={false}
            expandable={{
              expandedRowRender: (record) => (
                <p style={{ margin: 0 }}>

                  Injection Remarks : {record.InjectionRemarks},
                  Injection Time : {record.InjectionTime},
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
    </div>
  )
}

export default Injections

Injections.propTypes = {
    observationNumber: PropTypes.string.isRequired,
    staffNo: PropTypes.string.isRequired
}