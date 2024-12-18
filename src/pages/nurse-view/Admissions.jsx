import { Button, Card, DatePicker, Form, Input, Space, Table, Typography } from "antd"
import { ProfileOutlined } from "@ant-design/icons"
import Modal from "antd/es/modal/Modal";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { useDispatch, useSelector } from "react-redux";
import { getConsultationRoomListSlice } from "../../actions/nurse-actions/getConsultationRoomSlice";
import { getTriageWaitingList } from "../../actions/triage-actions/getTriageWaitingListSlice";
import { listDoctors } from "../../actions/DropdownListActions";
import Loading from "../../partials/nurse-partials/Loading";
const Admissions = () => {

    
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
            render: (_, record) => {
                return <Button type="link" onClick={() => showModal(record)} style={{ color: '#0f5689' }}>
                    {record.names}
                </Button>
            }
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
                return <Button type="primary" onClick={() => showModal(record)}>Admission</Button>
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

    const { loadingConsultationRoomList, consultationRoomList } = useSelector(state => state.getConsultationRoom);
    const { triageWaitingList } = useSelector(state => state.getTriageWaitingList);
    const filteredConsultationRooms = consultationRoomList.filter(room => room.Status === 'New');
    const formattedTriageWaitingList = triageWaitingList.map(patient => {
        return {
            PatientNo: patient.PatientNo,
            SearchName: patient.SearchName,
        }
    });

    const { data } = useSelector(state => state.getDoctorsList);
    const formattedDoctorDetails = data.map(doctor => {
        return {
            DoctorID: doctor.DoctorID,
            DoctorsName: doctor.DoctorsName,
        }
    });

    // console.log('triageWaitingList', triageWaitingList);

    const combinedList = filteredConsultationRooms.map(room => {
        // Find the matching patient in the formattedTriageWaitingList
        const matchingPatient = formattedTriageWaitingList.find(patient => patient.PatientNo === room.PatientNo);
    
        // Combine room data with the matching patient's data
        return {
            ...room, // Include all fields from the room object
            PatientNo: room.PatientNo,
            SearchName: matchingPatient ? matchingPatient.SearchName : null, // Add SearchName if patient exists
        };
    });

    const combinedListWithDoctors = combinedList.map(item => {
        // Find the doctor matching the DoctorID in the current item
        const matchingDoctor = formattedDoctorDetails.find(doctor => doctor.DoctorID === item.DoctorID);
    
        // Combine the doctor's data with the current item
        return {
            ...item, // Include all fields from the combinedList item
            DoctorsName: matchingDoctor ? matchingDoctor.DoctorsName : null, // Add DoctorsName if doctor exists
        };
    });

    const dataSource = combinedListWithDoctors.map((item, index) => ({
        key: index + 1,
        treatmentNo: item.TreatmentNo,
        patientNo: item.PatientNo,
        names: item.SearchName,
        treatmentDate: item.TreatmentDate,
        treatmentType: item.TreatmentType,
        doctor: item.DoctorsName,
    })).sort((a, b) => {
        // Sort by treatment date in descending order
        return new Date(b.treatmentDate) - new Date(a.treatmentDate);
    })

    // console.log('combinedList is:', combinedList);

    useEffect(() => {
        if(!data.length) {
            dispatch(listDoctors());
        }
    }, [dispatch, data.length]);

    useEffect(() => {
        
        if(!triageWaitingList.length) {
            dispatch(getTriageWaitingList());
        }
    }, [dispatch, triageWaitingList.length]);

    useEffect(() => {
        if(!consultationRoomList.length) {
            dispatch(getConsultationRoomListSlice());
        }
    }, [dispatch, consultationRoomList.length]);

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: dataSource.length,
    });

    const handleTableChange = (newPagination) => {
        setPagination(newPagination); // Update pagination settings
    };

    const paginatedData = dataSource.slice(
        (pagination.current - 1) * pagination.pageSize,
        pagination.current * pagination.pageSize
    );

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

          {
            loadingConsultationRoomList ? (
                <Loading />
            ):(
                <Table 
                columns={columns} 
                dataSource={dataSource} 
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

export default Admissions