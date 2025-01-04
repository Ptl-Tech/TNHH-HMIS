import { Button, Card, DatePicker, Form, Input, Space, Table, Typography } from "antd"
import { ProfileOutlined } from "@ant-design/icons"
import Modal from "antd/es/modal/Modal";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { useDispatch, useSelector } from "react-redux";
import { getTriageWaitingList } from "../../../../actions/triage-actions/getTriageWaitingListSlice";
import { listDoctors } from "../../../../actions/DropdownListActions";
import Loading from "../../../../partials/nurse-partials/Loading";
import { getConsultationRoomListSlice } from "../../../../actions/nurse-actions/getConsultationRoomSlice";
import { getLabList } from "../../../../actions/Doc-actions/getLabList";
import { render } from "react-dom";
import { useNavigate } from "react-router-dom";

const LabOutPatient = () => {
    const navigate=useNavigate();
    const columns = [
        {
            title: 'Lab No',
            dataIndex: 'LaboratoryNo',
            key: 'LaboratoryNo',
        },
        {
            title: 'Patient No',
            dataIndex: 'PatientNo',
            key: 'PatientNo',
        },
        {
            title: 'Patient Names',
            dataIndex: 'Patient_Names',
            key: 'Patient_Names',
            render: (_, record) => {
                return <Button type="link" onClick={() => handleNavigate(record, record.LaboratoryNo)} style={{ color: '#0f5689' }}>
                    {record.Patient_Names}
                </Button>
            }
        },
        {
            title: 'Status',
            dataIndex: 'Status',
            key: 'Status',
            render: (_, record) => {
                let statusColor;
                switch (record.Status) {
                    case 'New':
                        statusColor = 'orange';
                        break;
                    case 'Completed':
                        statusColor = 'green';
                        break;
                    case 'Forwarded':
                        statusColor = 'blue';
                        break;
                    case 'Cancelled':
                        statusColor = 'red';
                        break;
                    default:
                        statusColor = 'gray'; // Default color for unknown statuses
                }
                
                return (
                    <Typography.Text style={{ color: statusColor, fontWeight: 'bold' }}>
                        {record.Status}
                    </Typography.Text>
                );
            }
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (_, record) => {
                return <Button type="primary" onClick={() => handleNavigate(record, record.LaboratoryNo)}>checkIn Lab</Button>
            }
        }
    ];

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

    const dispatch = useDispatch();

    const { loadinglabTreatmentHeaders, data: labTreatmentHeaders } = useSelector(state => state.labList);
   
    useEffect(() => {
        if(!labTreatmentHeaders.length) {
            dispatch(getLabList());
        }
    }, [dispatch, labTreatmentHeaders.length]);

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: labTreatmentHeaders.length,
    });

    const handleTableChange = (newPagination) => {
        setPagination(newPagination); // Update pagination settings
    };

    const handleNavigate=(record,LaboratoryNo )=>{
        navigate(`/Doctor/Lab/Patient?LaboratoryNo=${LaboratoryNo}`, { state: { patientNo: record.PatientNo, labObservationNo: record.LaboratoryNo, patientLabRecord: record } });
    }

    const paginatedData = labTreatmentHeaders.slice(
        (pagination.current - 1) * pagination.pageSize,
        pagination.current * pagination.pageSize
    );

  return (
    <div style={{ margin: '20px 10px 10px 10px' }}>
        <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '10px', position: 'relative'}}>
            <ProfileOutlined />
            <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '16px'}}>
                Laboratory List OutPatients
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

          {
            loadinglabTreatmentHeaders ? (
                <Loading />
            ):(
                <Table 
                columns={columns} 
                dataSource={labTreatmentHeaders} 
                className="admit-patient-table"
                bordered size='middle' 
                pagination={{
                    ...pagination,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    position: ['bottom', 'right'],
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    onChange: (page, pageSize) => handleTableChange({ current: page, pageSize, total: pagination.total }),
                    onShowSizeChange: (current, size) => handleTableChange({ current, pageSize: size, total: pagination.total }),
                    style: {
                        marginTop: '30px',
                    }
                }}
                />
            )
          }

        
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

export default LabOutPatient; 