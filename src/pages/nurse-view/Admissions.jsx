
import { Button, Card, DatePicker, Form, Input, message, Space, Table, Typography } from "antd"
import { ProfileOutlined } from "@ant-design/icons"

import Modal from "antd/es/modal/Modal";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { useDispatch, useSelector } from "react-redux";
import { getConsultationRoomListSlice } from "../../actions/nurse-actions/getConsultationRoomSlice";
import { getTriageWaitingList } from "../../actions/triage-actions/getTriageWaitingListSlice";
import { listDoctors } from "../../actions/DropdownListActions";
import Loading from "../../partials/nurse-partials/Loading";

import useAuth from "../../hooks/useAuth";
import { POST_PATIENT_ADMISSION_FAILURE, POST_PATIENT_ADMISSION_SUCCESS, postPatientAdmissionSlice } from "../../actions/nurse-actions/postPatientAdmissionSlice";
import { POST_REQUEST_PATIENT_ADMISSION_FAILURE, POST_REQUEST_PATIENT_ADMISSION_SUCCESS, postRequestPatientAdmissionSlice } from "../../actions/nurse-actions/postRequestPatientAdmissionSlice";

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
                return <Button type="primary" onClick={() => showModal(record)}>Place Admission Request</Button>
            }
        }
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const { loadingAdmission } = useSelector(state => state.postPatientAdmission);


    const [ form ] = Form.useForm();
    const userDetails = useAuth();
    const showModal = (record) => {
        setSelectedRecord(record);
        setIsModalOpen(true);
    };
    const handleOk = async () => {

    const formData = await form.validateFields();
    
    const { admissionRemarks, dateOfAdmission } = formData;
    const admissionDetails = {
        admissionReason: admissionRemarks,
        dateOfAdmission: dateOfAdmission.format('YYYY-MM-DD'),
        treatmentNo: selectedRecord?.treatmentNo,
        myAction: "create",
        staffNo: userDetails.userData.no
    }

    if(formData && selectedRecord) {
        // dispatch action to save admission details
        await dispatch(postPatientAdmissionSlice('/Doctor/PatientAdmission', admissionDetails)).then((res) => {
            if(res.type === POST_PATIENT_ADMISSION_SUCCESS) {

                dispatch(postRequestPatientAdmissionSlice('/Doctor/RequestPatientAdmission',{treatmentNo: selectedRecord?.treatmentNo, staffNo: userDetails.userData.no})).then((res) => {
                    if(res.type === POST_REQUEST_PATIENT_ADMISSION_SUCCESS) {
                        message.success(res.payload.message || 'Admission request placed successfully');
                    }else if(res.type === POST_REQUEST_PATIENT_ADMISSION_FAILURE) {
                        message.error(res.payload.message || 'Error placing admission request');
                    }
                }).catch((err) => {
                    message.error(err.message || "Internal server error, please try again later.");
                });
                message.success('Admission request placed successfully');
                
            }else if(res.type === POST_PATIENT_ADMISSION_FAILURE) {
                message.error('Error placing admission request');
            }
        }).then(() => {
            setIsModalOpen(false);
            form.resetFields();
        }).catch((err) => {
            message.error(err.message || "Internal server error, please try again later.");
        });
    }
    }



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
    };
    });

    const { data } = useSelector(state => state.getDoctorsList);
    const formattedDoctorDetails = data.map(doctor => {
    return {
    DoctorID: doctor.DoctorID,
    DoctorsName: doctor.DoctorsName,

    };
    });

    const combinedList = filteredConsultationRooms.map(room => {
    const matchingPatient = formattedTriageWaitingList.find(patient => patient.PatientNo === room.PatientNo);
    return {
    ...room,
    PatientNo: room.PatientNo,
    SearchName: matchingPatient ? matchingPatient.SearchName : null,
    };
    });

    const combinedListWithDoctors = combinedList.map(item => {
    const matchingDoctor = formattedDoctorDetails.find(doctor => doctor.DoctorID === item.DoctorID);
    return {
    ...item,
    DoctorsName: matchingDoctor ? matchingDoctor.DoctorsName : null,
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
    })).sort((a, b) => new Date(b.treatmentDate) - new Date(a.treatmentDate));

    useEffect(() => {
    if (!data.length) {
    dispatch(listDoctors());
    }
    }, [dispatch, data.length]);

    useEffect(() => {
    if (!triageWaitingList.length) {
    dispatch(getTriageWaitingList());
    }
    }, [dispatch, triageWaitingList.length]);

    useEffect(() => {
    if (!consultationRoomList.length) {
    dispatch(getConsultationRoomListSlice());
    }
    }, [dispatch, consultationRoomList.length]);


return (
<div style={{ margin: '20px 10px 10px 10px' }}>
  <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '10px', position: 'relative'}}>
      <ProfileOutlined />
      <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '16px'}}>
          Place Admission Request
      </Typography.Text>
    </Space>


    <Card style={{ padding: '10px 10px 10px 10px' }}>
    <div className='admit-patient-filter-container'>
        <Input placeholder="search by name" 
        allowClear
        showCount
        showSearch
        />
        <span style={{ color: 'gray', fontSize: '14px', fontWeight: 'bold' }}>or</span>
        <Input placeholder="search by patient no" 
        allowClear
        showCount
        showSearch
        />
        <span style={{ color: 'gray', fontSize: '14px', fontWeight: 'bold' }}>or</span>
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
    ) : (
        <Table 
        columns={columns} 
        dataSource={dataSource} 
        className="admit-patient-table"
        bordered size='middle' 
        />
    )
    }
    <Modal 
        title="Patient Admissions" 
        open={isModalOpen} onOk={handleOk} 
        onCancel={handleCancel} 
        okText="Place Admission Request">
        <Form layout="vertical" 
        style={{ paddingTop: '10px'}} 
        form={form}
        okButtonProps={{ loading: loadingAdmission }}
        initialValues={
            {
                dateOfAdmission: null,
                admissionRemarks: '',
            }
        }
        >
            <Form.Item 
                label="Date of Admission" 
                name="dateOfAdmission"
                rules={[{ required: true, message: 'Please enter the date of admission!' }]}
                hasFeedback
            >
                <DatePicker style={{ width: '100%'}}
                />
            </Form.Item>
            <Form.Item 
                label="Admission Remarks" 
                name="admissionRemarks"
                hasFeedback
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
);
}

export default Admissions;
