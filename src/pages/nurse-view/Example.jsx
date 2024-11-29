import { Card, Col, Row, Tabs, Button, Modal, Form, Input, Select, DatePicker, TimePicker, Table, Space } from 'antd'
import { useEffect, useState } from 'react'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import TextArea from 'antd/es/input/TextArea';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPatientDetails } from '../../actions/triage-actions/getPatientDetailsSlice';
import PatientDetailPage from './PatientDetailPage';
const format = 'HH:mm';

const EvaluatePatientInTriage = () => {
  const [onModalOpen, setOnModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);
  const dispatch = useDispatch();
  const [ formData, setFormData ] = useState({});

  //getting the patientNo from the url
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const patientNo = searchParams.get('Patient_id');

  const { patientDetails } = useSelector((state) => state.getPatientDetails);

  //dispatch an action to get the patient's details
  useEffect(() => {
      patientNo && dispatch(getPatientDetails(patientNo));
  }, [dispatch, patientNo])


  const selectReasonForVisit = [
    {
      value: 0,
      label: '',
    },

    {
      value: 1,
      label: 'Patient not improving',
    },
    {
      value: 2,
      label: 'Patient Deteriorating',
    },

    {
      value: 3,
      label: 'New Presentation',
    },

    {
      value: 4,
      label: 'Follow Up',
    },

  ]

  const handleOpenModal = (title, formFields) => {
    setModalTitle(title);
    setModalContent(formFields);
    setOnModalOpen(true);
  };

function handleOnChange(event){
  const { name, value } = event.target;
  setFormData((prevFormData) => ({
    ...prevFormData,
    [name]: value,
  }));
}
  function handleSaveModalData(modalTitle){
    console.log(formData)
    console.log(modalTitle)
  }


  const vitalsColumns = [
    {
      title: 'Observation No',
      dataIndex: 'observationNo',
      rowScope: 'row',
    },
    {
      title: 'Patient No',
      dataIndex: 'patientNo',
      rowScope: 'row',
    },
    {
      title: 'Pulse Rate',
      dataIndex: 'pulseRate',
      rowScope: 'row',
    },
    {
      title: 'Pain',
      dataIndex: 'pain',
      rowScope: 'row',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      rowScope: 'row',
      fixed: 'right',
      width: 200,
      render: () => {
        return (
          <Space>
            <Button type='primary' onClick={() => handleOpenModal('Check In', null)}>
              <EditOutlined />
              Edit
            </Button>
            <Button type='secondary' onClick={() => handleOpenModal('Check In', null)}>
              <DeleteOutlined />
              Delete
            </Button>
          </Space>
        )
      }
    },
  ];

  const vitalsData = [
    {
      observationNo: 1,
      patientNo: 1,
      pulseRate: 1,
      pain: 1,
      checkIn: 1
    }
  ]

  const allergyColumns =[
    {
      title: 'Staff No',
      dataIndex: 'staffNo',
      rowScope: 'row',
    },
    {
      title: 'Observation No',
      dataIndex: 'observationNo',
      rowScope: 'row',
    },
    {
      title: 'Complains',
      dataIndex: 'complains',
      rowScope: 'row',
    },
    {
      title: 'Reason for Visit',
      dataIndex: 'reasonForVisit',
      rowScope: 'row',
    },

    {
      title: 'Food Allergy',
      dataIndex: 'foodAllergy',
      rowScope: 'row',
    },
    {
      title: 'Drug Allergy',
      dataIndex: 'drugAllergy',
      rowScope: 'row',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      rowScope: 'row',
      fixed: 'right',
      width: 200,
      render: () => {
        return (
          <Space>
            <Button type='primary' onClick={() => handleOpenModal('Check In', null)}>
              <EditOutlined />
              Edit
            </Button>
            <Button type='secondary' onClick={() => handleOpenModal('Check In', null)}>
              <DeleteOutlined />
              Delete
            </Button>
          </Space>
        )
      }
    },
  ]

  const allergyData = [
    {
      staffNo: 1,
      observationNo: 1,
      complains: 1,
      reasonForVisit: 1,
      foodAllergy: 1,
      drugAllergy: 1,
    }
  ]

  const injectionsColumns = [
    {
      title: 'Staff No',
      dataIndex: 'staffNo',
      rowScope: 'row',
    },
    {
      title: 'Observation No',
      dataIndex: 'observationNo',
      rowScope: 'row',
    },
    {
      title: 'Injections No',
      dataIndex: 'injectionsNo',
      rowScope: 'row',
    },
    {
      title: 'Quantity',
      dataIndex: 'Quantity',
      rowScope: 'row',
    },
    {
      title: 'Injections Date',
      dataIndex: 'injectionsDate',
      rowScope: 'row',
    },
    {
      title: 'Injections Time',
      dataIndex: 'injectionsTime',
      rowScope: 'row',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      rowScope: 'row',
      fixed: 'right',
      width: 200,
      render: () => {
        return (
          <Space>
            <Button type='primary' onClick={() => handleOpenModal('Check In', null)}>
              <EditOutlined />
              Edit
            </Button>
            <Button type='secondary' onClick={() => handleOpenModal('Check In', null)}>
              <DeleteOutlined />
              Delete
            </Button>
          </Space>
        )
      }
    },
  ]

  const injectionsData = [
    {
      staffNo: 432,
      observationNo: 1,
      injectionsNo: 1212,
      Quantity: 1,
      injectionsDate: '12/12/2022',
      injectionsTime: '12:00',
    }
  ]

  const dressingColumns = [
    {
      title: 'Staff No',
      dataIndex: 'staffNo',
      rowScope: 'row',
    },
    {
      title: 'Observation No',
      dataIndex: 'observationNo',
      rowScope: 'row',
    },
    {
      title: 'Process No',
      dataIndex: 'ProcessNo',
      rowScope: 'row',
    },
    {
      title: 'Item No',
      dataIndex: 'itemNo',
      rowScope: 'row',
    },
    {
      title: 'Unit of Measure',
      dataIndex: 'unitOfMeasure',
      rowScope: 'row',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      rowScope: 'row',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      rowScope: 'row',
      fixed: 'right',
      width: 200,
      render: () => {
        return (
          <Space>
            <Button type='primary' onClick={() => handleOpenModal('Check In', null)}>
              <EditOutlined />
              Edit
            </Button>
            <Button type='secondary' onClick={() => handleOpenModal('Check In', null)}>
              <DeleteOutlined />
              Delete
            </Button>
          </Space>
        )}
      }
  ]


  const dressingData = [
    {
      staffNo: 432,
      observationNo: 1,
      ProcessNo: 1212,
      itemNo: 1,
      unitOfMeasure: 1,
      quantity: 1,
    }
  ]

  return (
    <>
    <Card style={{ padding: '24px 10px 10px 10px' }}>
          <PatientDetailPage patientDetails={patientDetails}/>
          <Tabs style={{ padding: '10px 10px' }}>
              <Tabs.TabPane tab="Vitals" key="vitals">
                <Card style={{ padding: '24px 10px 10px 10px' }}>
                  <Button type='primary' onClick={()=>handleOpenModal(
                    'Add vitals',

                    <Form layout="vertical" validateTrigger="onChange">
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item 
                              label="Observation Number"
                              name={['vitals', 'observationNumber']}
                              rules={[{ required: true, message: 'Please input observation number!' }]} 
                            >
                              <Input type='text' 
                                name='observationNumber'
                                onChange={handleOnChange}
                                value={setFormData.observationNumber}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item 
                              label="Patient Number" 
                              name={['vitals', 'patientNumber']}
                              rules={[{ required: true, message: 'Please input patient number!' }]}
                              >
                              <Input type='text' 
                                name='patientNumber'
                                onChange={handleOnChange}
                                value={setFormData.patientNumber}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item label="Pulse Rate"
                              name={['vitals', 'pulseRate']}
                              rules={[{ required: true, message: 'Please input pulse rate!' }]}
                            >
                              <Input type='text'
                                name='pulseRate'
                                onChange={handleOnChange}
                                value={setFormData.pulseRate}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item label="Blood Pressure" name={['vitals', 'bloodPressure']}
                              rules={[{ required: true, message: 'Please input blood pressure!' }]}
                              >
                              <Input type='text' 
                                 name='bloodPressure'
                                 onChange={handleOnChange}
                                 value={setFormData.bloodPressure}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item label="Temperature" name={['vitals', 'temperature']}
                              rules={[{ required: true, message: 'Please input temperature!' }]}
                            >
                              <Input type='text' 
                                name='temperature'
                                onChange={handleOnChange}
                                value={setFormData.temperature}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item label="SPO2" name={['vitals', 'spo2']}
                              rules={[{ required: true, message: 'Please input SOP2!' }]}
                            >
                              <Input type='text' 
                                name='SPO2'
                                onChange={handleOnChange}
                                value={setFormData.SPO2}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item label="Height" name={['vitals', 'height']}
                            
                            rules={[{ required: true, message: 'Please input height!' }]}
                            >
                              <Input type='text' 
                                name='height'
                                onChange={handleOnChange}
                                value={setFormData.height}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item label="Weight" name={['vitals', 'weight']}
                              rules={[{ required: true, message: 'Please input weight!' }]}
                            >
                              <Input type='number' 
                                name='weight'
                                onChange={handleOnChange}
                                value={setFormData.weight}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item label="Respiration Rate" name={['vitals', 'respirationRate']}
                              rules={[{ required: true, message: 'Please input respiration rate!' }]}
                            >
                              <Input type='text' 
                              
                              name='respirationRate'
                              onChange={handleOnChange}
                              value={setFormData.respirationRate}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item label="Pain" name={['vitals', 'pain']}>
                              <Input type='text' 
                                name='pain'
                                onChange={handleOnChange}
                                value={setFormData.pain}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                    </Form>
                      
                  )}>
                      <PlusOutlined />
                      Add vitals
                  </Button>

                  <Table dataSource={vitalsData} columns={vitalsColumns} bordered size='middle' style={{ marginTop: '20px' }} />

                </Card>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Allergy and Medication" key="allergy">
                <Card style={{ padding: '24px 10px 10px 10px' }}>
                <Button type='primary' onClick={

                    ()=>handleOpenModal(
                      'Add Allergy and Medication',

                      <Form layout="vertical">
                          <Row gutter={16}>
                            
                            <Col span={12}>
                              <Form.Item label="Observation No" 
                              name={['allergy', 'observationNo']}
                              rules={[{ required: true, message: 'Please input observation no!' }]}
                              >
                                <Input type='text' 
                                  name='observationNumber'
                                  onChange={handleOnChange}
                                  value={setFormData.observationNumber}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item label="Assessed by" 
                              name={['allergy', 'assessedBy']}
                              rules={[{ required: true, message: 'Please input your name!' }]}
                              >
                              <Input type='text' 
                                name='assessedBy'
                                onChange={handleOnChange}
                                value={setFormData.assessedBy}
                              />
                              </Form.Item>
                            </Col>
                            </Row>

                          <Row gutter={16}>
                            
                            <Col span={12}>
                              <Form.Item label="Complains" 
                              name={['allergy', 'complains']}
                              >
                                <Input type='text' 
                                  name='complains'
                                  onChange={handleOnChange}
                                  value={setFormData.complains}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                            <Form.Item label="Reason for visit" 
                              name={['allergy', 'reasonForVisit']}
                              rules={[{ required: true, message: 'Please input your name!' }]}
                              >
                              <Select
                                  key={'location'}
                                  style={{ width: '100%' }}
                                  optionFilterProp="label"
                                  options={selectReasonForVisit} 
                                  onChange={handleOnChange}
                                  value={setFormData.reasonForVisit}
                                  name='reasonForVisit'
                              >
                              </Select>
                              </Form.Item>
                            </Col>
                            </Row>

                            <Row gutter={16}>
                              <Col span={12}>
                                <Form.Item label="Food Allergy" name={['allergy', 'foodAllergy']}>
                                  <Input type='text' 
                                    onChange={handleOnChange}
                                    value={setFormData.foodAllergy}
                                    name='foodAllergy'
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <Form.Item label="Drug Allergy" name={['allergy', 'drugAllergy']}>
                                  <Input type='number' 
                                    onChange={handleOnChange}
                                    value={setFormData.drugAllergy}
                                    name='drugAllergy'
                                  />
                                </Form.Item>
                              </Col>
                          </Row>
                      </Form>
                        
                    )
                }>
                      <PlusOutlined />
                      Add allergy and medication
                  </Button>

                  <Table dataSource={allergyData} columns={allergyColumns} bordered size='middle' style={{ marginTop: '20px' }} />

                </Card>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Injections" key="injections">
                <Card style={{ padding: '24px 10px 10px 10px' }}>
                <Button type='primary' onClick={
                  
                  ()=>handleOpenModal(
                    'Injections',

                    <Form layout="vertical">
                      <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item label="Observation No" name={['vitals', 'observationNo']}
                               rules={[{ required: true, message: 'Please input observation no!' }]}
                            >
                              <Input type='text' 
                                onChange={handleOnChange}
                                value={setFormData.observationNo}
                                name='observationNo'
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item label="Injection No" name="injectionNo"
                               rules={[{ required: true, message: 'Please input injection no!' }]}
                            >
                            <Input type='text' 
                              onChange={handleOnChange}
                              value={setFormData.injectionNo}
                              name='injectionNo'
                            />
                          </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item label="Injection Quantity" name={['vitals', 'injectionQuantity']}>
                              <Input type='number' 
                                onChange={handleOnChange}
                                value={setFormData.injectionQuantity}
                                name='injectionQuantity'
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item label="Injection Date" name="injectionDate">
                            <DatePicker style={{ width: '100%' }}
                            
                            onChange={handleOnChange}
                            value={setFormData.injectionDate}
                            name='injectionDate'
                            
                          />
                          </Form.Item>
                          </Col>
                          </Row>
                          <Row gutter={16}>
                          <Col span={24}>
                            <Form.Item label="Pulse time" name={['vitals', 'injectionTime']}>
                              <TimePicker defaultValue={dayjs('12:08', format)} format={format} style={{ width: '100%' }} 
                                  onChange={handleOnChange}
                                  value={setFormData.injectionTime}
                                  name='injectionTime'
                              />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item label="Injection Remarks" name={['vitals', 'injectionRemarks']}>
                              <TextArea 
                                autoSize={{
                                  minRows: 3,
                                  maxRows: 5,
                                }}
                                onChange={handleOnChange}
                                value={setFormData.injectionRemarks}
                                name='injectionRemarks'
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                    </Form>
                      
                  )

                }>
                      <PlusOutlined />
                      Add injections
                  </Button>
                  <Table dataSource={injectionsData} columns={injectionsColumns} bordered size='middle' style={{ marginTop: '20px' }} />
                </Card>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Dressings" key="dressings">
                <Card style={{ padding: '24px 10px 10px 10px' }}>
                <Button type='primary' onClick={
                      ()=>handleOpenModal(
                        'Dressings',
    
                        <Form layout="vertical">
                            <Row gutter={16}>
                              <Col span={12}>
                                <Form.Item label="Observation No" name={['vitals', 'observationNo']}
                                   rules={[{ required: true, message: 'Please input observation no!' }]}
                                >
                                  <Input type='text' 
                                  onChange={handleOnChange}
                                  value={setFormData.observationNo}
                                  name='observationNo'
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <Form.Item label="Process No" name="processNo"
                                 rules={[{ required: true, message: 'Please input process no!' }]}
                                >
                                <Input type='text' 
                                   onChange={handleOnChange}
                                   value={setFormData.processNo}
                                   name='processNo'
                                />
                              </Form.Item>
                              </Col>
                              </Row>

                              <Row gutter={16}>
                              <Col span={12}>
                                <Form.Item label="Item No" name={['vitals', 'itemNo']}
                                  rules={[{ required: true, message: 'Please input item no!' }]}
                                >
                                  <Input type='text' 
                                    onChange={handleOnChange}
                                    value={setFormData.itemNo}
                                    name='itemNo'
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                              <Form.Item label="Unit of measure" name={['vitals', 'unitOfMeasure']}>
                                  <Input type='text' 
                                    onChange={handleOnChange}
                                    value={setFormData.unitOfMeasure}
                                    name='unitOfMeasure'
                                  />
                                </Form.Item>
                              </Col>
                              </Row>
                            
                            <Row>
                              <Col span={24}>
                              <Form.Item label="Quantity" name="quantity">
                                <Input type='number' 
                                  onChange={handleOnChange}
                                  value={setFormData.quantity}
                                  name='quantity'
                                />
                              </Form.Item>
                              </Col>
                              </Row>

                              <Row>
                              <Col span={24}>
                              <Form.Item label="Injection Remarks" name={['vitals', 'injectionRemarks']}>
                                <TextArea 
                                autoSize={{
                                  minRows: 3,
                                  maxRows: 5,
                                }}
                                onChange={handleOnChange}
                                value={setFormData.injectionRemarks}
                                name='injectionRemarks'
                                />
                                </Form.Item>
                              </Col>
                              </Row>
                        </Form>
                          
                      )
                    }>
                      <PlusOutlined />
                      Add Dressing
                  </Button>
                  <Table dataSource={dressingData} columns={dressingColumns} bordered size='middle' style={{ marginTop: '20px' }} />
                </Card>
              </Tabs.TabPane>
           </Tabs>
    </Card>

    <Modal 
      title={modalTitle} 
      open={onModalOpen} 
      onCancel={() => setOnModalOpen(false)} 
      onOk={()=>handleSaveModalData(modalTitle)}
      width={1000}
      >
      {modalContent}
    </Modal>
    </>
  )
}

export default EvaluatePatientInTriage