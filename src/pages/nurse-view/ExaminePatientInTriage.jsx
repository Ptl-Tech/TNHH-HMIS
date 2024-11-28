import { Card, Col, Row, Tabs, Typography, Button, Modal, Form, Input, Select, DatePicker, TimePicker, Table, Space } from 'antd'
import { useState } from 'react'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import TextArea from 'antd/es/input/TextArea';
const format = 'HH:mm';

const EvaluatePatientInTriage = () => {
  const [onModalOpen, setOnModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

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
  function handleSaveModalData(modalTitle){
    console.log('save modal data')
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
        <Typography.Title level={4}>Triage Examination</Typography.Title>
          <Row>
              <Col span={6}>
                <div style={{ display: 'flex', flexDirection: 'column'}}>
                    <Typography.Text style={{ fontSize: '14px', fontWeight: 'bold'}}>Patient Name</Typography.Text>
                    <Typography.Text style={{ fontSize: '12px', color:'gray', fontWeight: 'bold'}}>Derick Martin</Typography.Text>
                </div>
              </Col>
              <Col span={4}>
                <div style={{ display: 'flex', flexDirection: 'column'}}>
                    <Typography.Text style={{ fontSize: '14px', fontWeight: 'bold'}}>Gender</Typography.Text>
                    <Typography.Text style={{ fontSize: '12px', color:'gray', fontWeight: 'bold'}}>
                      Male
                    </Typography.Text>
                </div>
              </Col>
              <Col span={4}>
                <div style={{ display: 'flex', flexDirection: 'column'}}>
                    <Typography.Text style={{ fontSize: '14px', fontWeight: 'bold'}}>DOB</Typography.Text>
                    <Typography.Text style={{ fontSize: '12px', color:'gray', fontWeight: 'bold'}}>
                      12/03/1990
                    </Typography.Text>
                </div>
              </Col>
              <Col span={4}>
                <div style={{ display: 'flex', flexDirection: 'column'}}>
                    <Typography.Text style={{ fontSize: '14px', fontWeight: 'bold'}}>Age</Typography.Text>
                    <Typography.Text style={{ fontSize: '12px', color:'gray', fontWeight: 'bold'}}>
                      40
                    </Typography.Text>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ display: 'flex', flexDirection: 'column'}}>
                    <Typography.Text style={{ fontSize: '14px', fontWeight: 'bold'}}>DOA</Typography.Text>
                    <Typography.Text style={{ fontSize: '12px', color:'gray', fontWeight: 'bold'}}>
                      12/03/2023
                    </Typography.Text>
                </div>
              </Col>
          </Row>

          <Tabs style={{ padding: '10px 10px' }}>
              <Tabs.TabPane tab="Vitals" key="vitals">
                <Card style={{ padding: '24px 10px 10px 10px' }}>
                  <Button type='primary' onClick={()=>handleOpenModal(
                    'Add vitals',

                    <Form layout="vertical">
                        <Row>
                          <Col span={24}>
                            <Form.Item label="Observation Number" name={['vitals', 'observationNumber']}>
                              <Input type='text' />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item label="Patient Number" name={['vitals', 'patientNumber']}>
                              <Input type='text' />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item label="Pulse Rate" name={['vitals', 'pulseRate']}>
                              <Input type='text' />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item label="Pain" name={['vitals', 'pain']}>
                              <Input type='number' />
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
                          <Row>
                            <Col span={24}>
                              <Form.Item label="Complains" name={['allergy', 'complains']}>
                                <Input type='text' />
                              </Form.Item>
                            </Col>
                            <Col span={24}>
                              <Form.Item label="Reason for visit" name={['allergy', 'reasonForVisit']}>
                              <Select
                                  key={'location'}
                                  style={{ width: '100%' }}
                                  optionFilterProp="label"
                                  options={selectReasonForVisit} 
                              >
                              </Select>
                              </Form.Item>
                            </Col>
                            <Col span={24}>
                              <Form.Item label="Food Allergy" name={['allergy', 'foodAllergy']}>
                                <Input type='text' />
                              </Form.Item>
                            </Col>
                            <Col span={24}>
                              <Form.Item label="Drug Allergy" name={['allergy', 'drugAllergy']}>
                                <Input type='number' />
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
                        <Row>
                          <Col span={24}>
                            <Form.Item label="Injection Quantity" name={['vitals', 'injectionQuantity']}>
                              <Input type='number' />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item label="Injection Date" name="injectionDate">
                            <DatePicker style={{ width: '100%' }} 
                          />
                          </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item label="Pulse Rate" name={['vitals', 'pulseRate']}>
                              <TimePicker defaultValue={dayjs('12:08', format)} format={format} style={{ width: '100%' }} 
                
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
                            <Row>
                              <Col span={24}>
                                <Form.Item label="Dressing" name={['vitals', 'dressing']}>
                                  <Input type='text' />
                                </Form.Item>
                              </Col>
                              <Col span={24}>
                                <Form.Item label="Quantity" name="quantity">
                                <Input type='number' />
                              </Form.Item>
                              </Col>
                              <Col span={24}>
                                <Form.Item label="Injection Remarks" name={['vitals', 'injectionRemarks']}>
                                <TextArea 
                                autoSize={{
                                  minRows: 3,
                                  maxRows: 5,
                                }}
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

    <Modal title={modalTitle} open={onModalOpen} onCancel={() => setOnModalOpen(false)} onOk={()=>handleSaveModalData(modalTitle)}>
    {modalContent}
    </Modal>
    </>
  )
}

export default EvaluatePatientInTriage