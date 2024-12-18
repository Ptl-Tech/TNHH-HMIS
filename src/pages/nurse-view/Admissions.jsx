import { Button, Card, DatePicker, Form, Input, Space, Table, Typography } from "antd"
import { ProfileOutlined } from "@ant-design/icons"
import Modal from "antd/es/modal/Modal";
import { useState } from "react";
import TextArea from "antd/es/input/TextArea";
const Admissions = () => {

    const dataSource = [
        {
            key: '1',
            treatmentNo: 'ADM0001',
            patientNo: 'PAT0001',
            names: 'John Brown',
            treatmentDate: '2023-01-01',
            treatmentType: 'Ward 1',
            doctor: 'B101',
        },
    ];
    const columns = [
        {
            title: 'Treatment No',
            dataIndex: 'treatmentNo',
            key: 'treatmentNo',
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
        },
        {
            title: 'Treatment Date',
            dataIndex: 'treatmentDate',
            key: 'treatmentDate',
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
                return <Button type="primary" onClick={showModal}>Admission</Button>
            }
        }
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ form ] = Form.useForm();
    const showModal = () => {
      setIsModalOpen(true);
    };
    const handleOk = async () => {
        const formData = await form.validateFields();
        console.log(formData);
    //   setIsModalOpen(false);
    };
    const handleCancel = () => {
      setIsModalOpen(false);
    };

  return (
    <div style={{ margin: '20px 10px 10px 10px' }}>
        <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '10px', position: 'relative'}}>
            <ProfileOutlined />
            <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '16px'}}>
                Admissions
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
          />

          {/* modal contents */}

        <Modal title="Patient Admissions" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="Submit">
                <Form layout="vertical" 
                style={{ paddingTop: '10px'}} 
                form={form}
                initialValues={
                    {
                        dateOfAdmission: null,
                        admissionReason: '',
                        admissionRemarks: '',
                    }
                }
                >
                    <Form.Item 
                        label="Date of Admission" 
                        name="dateOfAdmission"
                        rules={[{ required: true, message: 'Please enter the date of admission!' }]}
                    >
                        <DatePicker style={{ width: '100%'}}
                        />
                    </Form.Item>
                    <Form.Item 
                        label="Admission Reason" 
                        name="admissionReason"
                        rules={[
                            { required: true, message: 'Please enter the admission reason!' },
                            {
                                validator: (_, value) => {
                                  if (value && value.length > 100) {
                                    return Promise.reject(new Error('Admission reason cannot exceed 150 characters!'));
                                  }
                                  return Promise.resolve();
                                },
                            }
                        ]}
                    >
                        
                        <Input placeholder="Admission Reason" 
                        />
                    </Form.Item>
                    <Form.Item 
                        label="Admission Remarks" 
                        name="admissionRemarks"
                        rules={[
                            {
                                validator: (_, value) => {
                                  if (value && value.length > 200) {
                                    return Promise.reject(new Error('Admission remarks cannot exceed 150 characters!'));
                                  }
                                  return Promise.resolve();
                                },
                            }
                        ]}
                    >
                        <TextArea placeholder="Admission Remarks" name="admissionRemarks"
                            rows={3}
                        />
                    </Form.Item>
                </Form>
        </Modal>
    </div>
  )
}

export default Admissions