import { Button, Card, DatePicker, Form, Input, Modal, Space, Table, Typography } from "antd";
import { ProfileOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";

const DischargeRequests = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const [ form ] = Form.useForm();
    const showModal = (record) => {
        setSelectedRecord(record);
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        const formData = await form.validateFields();
        console.log(selectedRecord);
    //   setIsModalOpen(false);
    };
    const handleCancel = () => {
      form.resetFields();
      setIsModalOpen(false);
    };

    const columns = [
        {
            title: 'Discharge No',
            dataIndex: 'dischargeNo',
            key: 'dischargeNo',
        },
        {
            title: 'Patient No',
            dataIndex: 'patientNo',
            key: 'patientNo',
        },
        {
            title: 'Patient Names',
            dataIndex: 'names',
            key: 'names',
            render: (_, record) => {
                return <Button type="link" onClick={() => showModal(record)} style={{ color: '#0f5689' }}>
                    {record.names}
                </Button>
            }
        },
        {
            title: 'Discharge Date',
            dataIndex: 'dischargeDate',
            key: 'dischargeDate',
        },
        {
            title: 'Treatment Type',
            dataIndex: 'treatmentType',
            key: 'treatmentType',
           
        },
        {
            title: 'Doctor',
            dataIndex: 'doctor',
            key: 'doctor',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (_, record) => {
                return <Button type="primary" onClick={() => showModal(record)}>Discharge</Button>
            }
        }
    ];

    const dataSource =[
        {
            dischargeNo: '12345',
            patientNo: '12345',
            names: 'John Doe',
            dischargeDate: '2023-07-15',
            treatmentType: 'General',
            doctor: 'Dr. Smith',
        },
        {
            dischargeNo: '12345',
            patientNo: '12345',
            names: 'John Doe',
            dischargeDate: '2023-07-15',
            treatmentType: 'General',
            doctor: 'Dr. Smith',
        },
    ]

  return (
    <div style={{ margin: '20px 10px 10px 10px' }}>
        <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '10px', position: 'relative'}}>
            <ProfileOutlined />
            <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '16px'}}>
                Discharge Requests
            </Typography.Text>
          </Space>

          <Card style={{ padding: '10px 10px 10px 10px'}}>
            
              <div className='admit-patient-filter-container'>
                  <Input placeholder="search by name" 
                      allowClear
                      showCount
                      showSearch
                  />
                  <span style={{ color: 'gray', fontSize: '14px', fontWeight: 'bold'}}>or</span>
                  <Input placeholder="search by patient no" 
                      allowClear
                      showCount
                      showSearch
                  />
                  <span style={{ color: 'gray', fontSize: '14px', fontWeight: 'bold'}}>or</span>
                  <Input placeholder="search by id number" 
                      allowClear
                      showCount
                      showSearch
                  />
              </div>
          </Card>      
           
        <Table 
        columns={columns} 
        dataSource={dataSource} 
        className="admit-patient-table"
        bordered size='middle' 
        />
            
          {/* modal contents */}

        <Modal title="Patient Discharge Requests" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="Submit">
                <Form layout="vertical" 
                style={{ paddingTop: '10px'}} 
                form={form}
                initialValues={
                    {
                        dateOfDischargeRequest: null,
                        dischargeReason: '',
                        dischargeRemarks: '',
                    }
                }
                >
                    <Form.Item 
                        label="Date of Discharge Request" 
                        name="dateOfDischargeRequest"
                        rules={[{ required: true, message: 'Please enter the date of discharge request!' }]}
                    >
                        <DatePicker style={{ width: '100%'}}
                        />
                    </Form.Item>
                    <Form.Item 
                        label="Reason of Discharge Request" 
                        name="dischargeReason"
                        rules={[
                            { required: true, message: 'Please enter the discharge reason!' },
                            {
                                validator: (_, value) => {
                                  if (value && value.length > 100) {
                                    return Promise.reject(new Error('Discharge reason cannot exceed 150 characters!'));
                                  }
                                  return Promise.resolve();
                                },
                            }
                        ]}
                    >
                        
                        <Input placeholder="Discharge Reason" 
                        />
                    </Form.Item>
                    <Form.Item 
                        label="Discharge Remarks" 
                        name="dischargeRemarks"
                        rules={[
                            {
                                validator: (_, value) => {
                                  if (value && value.length > 200) {
                                    return Promise.reject(new Error('Discharge remarks cannot exceed 150 characters!'));
                                  }
                                  return Promise.resolve();
                                },
                            }
                        ]}
                    >
                        <TextArea placeholder="Discharge Remarks" name="dischargeRemarks"
                            rows={3}
                        />
                    </Form.Item>
                </Form>
        </Modal>
    </div>
  )
}

export default DischargeRequests