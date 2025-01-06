
import { Button, Card, DatePicker, Form, message, Space, Table, Typography, Modal } from "antd"
import { ProfileOutlined, FileExclamationOutlined, PrinterOutlined, CheckSquareOutlined, FolderAddOutlined } from "@ant-design/icons"
import { useEffect, useMemo, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { useDispatch, useSelector } from "react-redux";
import { getConsultationRoomListSlice } from "../../actions/nurse-actions/getConsultationRoomSlice";
import { getTriageWaitingList } from "../../actions/triage-actions/getTriageWaitingListSlice";
import { listDoctors } from "../../actions/DropdownListActions";
import Loading from "../../partials/nurse-partials/Loading";

import useAuth from "../../hooks/useAuth";
import { POST_PATIENT_DOCTOR_ADMISSION_FAILURE, POST_PATIENT_DOCTOR_ADMISSION_SUCCESS, postPatientDoctorAdmissionSlice } from "../../actions/nurse-actions/postPatientDoctorAdmissionSlice";
import { POST_REQUEST_PATIENT_ADMISSION_FAILURE, POST_REQUEST_PATIENT_ADMISSION_SUCCESS, postRequestPatientAdmissionSlice } from "../../actions/nurse-actions/postRequestPatientAdmissionSlice";
import useSetTableCheckBoxHook from "../../hooks/useSetTableCheckBoxHook";
import SearchFilters from "./SearchFilters";
import { exportToExcel, printToPDF } from "../../utils/helpers";
import useSetTablePagination from "../../hooks/useSetTablePagination";

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
            title: 'Clinic',
            dataIndex: 'clinic',
            key: 'clinic',
        },
        {
            title: 'Date',
            dataIndex: 'treatmentDate',
            key: 'treatmentDate',
        }
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const { selectedRow, selectedRowKey, rowSelection, setSelectedRowKey, setSelectedRow, setIsButtonDisabled } = useSetTableCheckBoxHook();

    const { loadingConsultationRoomList, consultationRoomList } = useSelector(state => state.getConsultationRoom);
    const { triageWaitingList } = useSelector(state => state.getTriageWaitingList);
    const { loadingAdmission } = useSelector(state => state.postPatientDoctorAdmission);
    const { data } = useSelector(state => state.getDoctorsList);

    const [ form ] = Form.useForm();
    const { confirm } = Modal;
    const userDetails = useAuth();
    const dispatch = useDispatch();

    const showModal = () => {
        if(selectedRow?.length === 0) {
            message.error("Please select a patient to add admission details");
            return;
        }
        setIsModalOpen(true);
    };
    
    const handleOk = () => {
        form.submit();
    }

    const handleOnFinish = async (values) => {
        
        try{

            const admissionDetails = {
                admissionReason: values?.admissionRemarks,
                dateOfAdmission: values?.dateOfAdmission.format('YYYY-MM-DD'),
                treatmentNo: selectedRow[0]?.treatmentNo,
                myAction: "create",
                staffNo: userDetails.userData.no
            }
            
            const result = await dispatch(postPatientDoctorAdmissionSlice('/Doctor/PatientAdmission', admissionDetails))

            if(result.type === POST_PATIENT_DOCTOR_ADMISSION_SUCCESS) {
                message.success(result.payload.message || "Admission details added successfully");
                setIsModalOpen(false);
            }else if(result.type === POST_PATIENT_DOCTOR_ADMISSION_FAILURE) {
                message.error(result.payload.message || "Failed to add admission details");
            }

        }catch(error){
            console.log(error);
        }
    }

    const handleAddAdmissionDetails = () => {
        showModal();
    }

    const handleAdmissionRequest = () => {
        confirm({
          title: 'Confirm Patient Admission Request?',
          content: `Are you sure you want to send admission request for ${selectedRow[0]?.names}?`,
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk() {
            return new Promise((resolve, reject) => {
              handleAdmissionRequestAction()
                .then(resolve) // Resolve the modal when successful
                .catch(reject); // Reject on failure
            });
          },
        });
      };

      const handleAdmissionRequestAction = async () => {
         try {
              const result = await dispatch(
                postRequestPatientAdmissionSlice('/Doctor/RequestPatientAdmission', 
                    {treatmentNo: selectedRow[0]?.treatmentNo, staffNo: userDetails.userData.no}
                )
              );
          
              if (result.type === POST_REQUEST_PATIENT_ADMISSION_SUCCESS) {
                message.success(
                  result.payload.message || `Admission request for ${selectedRow[0]?.names} has been placed successfully.`
                );
                
                setSelectedRowKey(null);
                setSelectedRow([]);
                setIsButtonDisabled(true);
                dispatch(getConsultationRoomListSlice());
                return Promise.resolve(); // Resolve the Promise to close the modal
              } else if (result.type === POST_REQUEST_PATIENT_ADMISSION_FAILURE) {
                message.error(
                  result.payload.message || 'Error placing admission request.'
                );
                return Promise.reject(); // Reject the Promise to keep the modal open
              }
            } catch (error) {
              message.error(error.message || 'Unexpected error occurred');
              return Promise.reject(); // Reject on unexpected errors
            }
      }

    const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
    };

    
    const filteredConsultationRooms = useMemo(
        () => consultationRoomList.filter(room => room?.Status === 'New'),
        [consultationRoomList]
    );
    
    const formattedTriageWaitingList = useMemo(() => {
        return triageWaitingList?.map(patient => ({
            PatientNo: patient?.PatientNo,
            SearchName: patient?.SearchName,
        }));
    }, [triageWaitingList]);
    
    const formattedDoctorDetails = useMemo(() => {
        return data?.map(doctor => ({
            DoctorID: doctor?.DoctorID,
            DoctorsName: doctor?.DoctorsName,
        }));
    }, [data]);

    const combinedList = useMemo(() => {
        return filteredConsultationRooms?.map(room => {
            const matchingPatient = formattedTriageWaitingList?.find(patient => patient?.PatientNo === room?.PatientNo);
            return {
                ...room,
                PatientNo: room?.PatientNo,
                SearchName: matchingPatient ? matchingPatient?.SearchName : null,
            };
        });
    }, [filteredConsultationRooms, formattedTriageWaitingList]);
    
    const combinedListWithDoctors = useMemo(() => {
        return combinedList?.map(item => {
            const matchingDoctor = formattedDoctorDetails?.find(doctor => doctor?.DoctorID === item?.DoctorID);
            return {
                ...item,
                DoctorsName: matchingDoctor ? matchingDoctor?.DoctorsName : null,
            };
        });
    }, [combinedList, formattedDoctorDetails]);

    const { pagination, handleTableChange } = useSetTablePagination(combinedListWithDoctors);

    const dataSource = combinedListWithDoctors?.map((item, index) => ({
    key: index + 1,
    treatmentNo: item?.TreatmentNo,
    patientNo: item?.PatientNo,
    names: item?.SearchName,
    treatmentDate: item?.TreatmentDate,
    treatmentType: item?.TreatmentType,
    clinic: item?.Clinic,
    doctor: item?.DoctorsName,
    })).sort((a, b) => new Date(b?.treatmentDate) - new Date(a?.treatmentDate));

    

    useEffect(() => {
    if (!data?.length) {
    dispatch(listDoctors());
    }
    }, [dispatch, data?.length]);

    useEffect(() => {
    if (!triageWaitingList?.length) {
    dispatch(getTriageWaitingList());
    }
    }, [dispatch, triageWaitingList?.length]);

    useEffect(() => {
    if (!consultationRoomList?.length) {
    dispatch(getConsultationRoomListSlice());
    }
    }, [dispatch, consultationRoomList?.length]);
    


return (
<div style={{ margin: '20px 10px 10px 10px' }}>
  <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '10px', position: 'relative'}}>
      <ProfileOutlined />
      <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '16px'}}>
          Admissions
      </Typography.Text>
    </Space>

    <SearchFilters />

    <Card className="admit-patient-card-container">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>

            <Space className="admit-patient-button-container">
                <Button type="primary" disabled={!selectedRowKey} onClick={handleAddAdmissionDetails}><FolderAddOutlined />

                    Add Admission Details

                </Button>

                <Button type="primary" disabled={!selectedRowKey} onClick={handleAdmissionRequest}><CheckSquareOutlined />

                    Place Admission Request

                </Button>

            </Space>
            <Space className="admit-patient-button-container">
                <Button type="primary" onClick={()=>exportToExcel(combinedListWithDoctors, 'Admission request request', 'admission-request-list.xlsx')}><FileExclamationOutlined /> Export Excel</Button>
                <Button type="primary" onClick={()=>printToPDF(combinedListWithDoctors, 'Admission request request')}><PrinterOutlined /> Print PDF</Button>
            </Space>
        </div>
        </Card>

    {
    loadingConsultationRoomList ? (
        <Loading />
    ) : (
        <Table 
        columns={columns} 
        rowSelection={rowSelection}
        scroll={{ x: 'max-content' }}
        dataSource={dataSource} 
        className="admit-patient-table"
        bordered size='middle' 
        pagination={{
            ...pagination,
            total: combinedListWithDoctors?.length,
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
    <Modal 
        title="Patient Admissions" 
        open={isModalOpen} 
        onOk={handleOk} 
        onCancel={handleCancel} 
        okText="Save Admission Details"
        okButtonProps={{
            loading: loadingAdmission,
            disabled: loadingAdmission,
        }}
        >

        <Form 
        layout="vertical" 
        style={{ paddingTop: '10px'}} 
        form={form}
        onFinish={handleOnFinish}
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
