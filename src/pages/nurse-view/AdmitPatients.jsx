import { Card, Col, Row, Space, Typography, Button, Table, Modal, message } from "antd"
import { ProfileOutlined, PlusOutlined, CloseOutlined, PayCircleOutlined, PrinterOutlined, FileExclamationOutlined } from "@ant-design/icons"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchFilters from "./SearchFilters";
import { useDispatch, useSelector } from "react-redux";
import { exportToExcel, printToPDF } from "../../utils/helpers";
import { getPgAdmissionsVerifiedSlice } from "../../actions/nurse-actions/getPgAdmissionsVerifiedSlice";
import { listDoctors } from "../../actions/DropdownListActions";
import Loading from "../../partials/nurse-partials/Loading";
import { POST_CANCEL_ADMISSION_FAILURE, POST_CANCEL_ADMISSION_SUCCESS, postCancelAdmissionSlice } from "../../actions/nurse-actions/postCancelAdmissionSlice";
import useSetTableCheckBoxHook from "../../hooks/useSetTableCheckBoxHook";
import useSetTablePagination from "../../hooks/useSetTablePagination";


const AdmitPatients = () => {


    const navigate = useNavigate();
    const { loadingGetPatientAdmissions, getPatientAdmissions } = useSelector((state) => state.getPgAdmissionVerified);
    const { loading, data } = useSelector(state => state.getDoctorsList);
    const { selectedRow, selectedRowKey, rowSelection } = useSetTableCheckBoxHook();

    const dispatch = useDispatch();
    const { confirm } = Modal;

    const columns = [
        {
            title: 'Adm No',
            dataIndex: 'No',
            key: 'No',
            fixed: 'left',
            width: 100
        },
        {
            title: 'Patient No',
            dataIndex: 'PatientNo',
            key: 'PatientNo',
        },
        {
            title: 'Patient Names',
            dataIndex: 'Names',
            key: 'Names',
            render: (_, record) => {
                return <Typography.Text style={{ color: '#0f5689' }}>
                    {record.Names}
                </Typography.Text>
            }
        },
        {
            title: 'Adm Date',
            dataIndex: 'Date',
            key: 'Date',
        },
        
        {
            title: 'Doctor',
            dataIndex: 'DoctorName',
            key: 'DoctorName',
            render: (_, record) => {
                return <Typography.Text style={{ color: '#0f5689' }}>
                    {record.DoctorName}
                </Typography.Text>
            }
        },
        {
            title: 'Remarks',
            dataIndex: 'Remarks',
            key: 'Remarks',
            fixed: 'right',
            width: 150
        }
    ];

    const formattedDoctorDetails = data?.map(doctor => {
        return {
            DoctorID: doctor.DoctorID,
            DoctorsName: doctor.DoctorsName,
        }
    });

    const formattedPatientAdmissions = getPatientAdmissions?.map(admission => {
        const matchDoctorName = formattedDoctorDetails.find(doctor => doctor.DoctorID === admission.Doctor);
        return {
            ...admission,
            DoctorName: matchDoctorName?.DoctorsName
        }
        
    });

    const { pagination, handleTableChange } = useSetTablePagination(formattedPatientAdmissions);

      const handleAdmitPatient = () => {

        selectedRow[0]?.PatientNo &&  navigate(`/Nurse/Admit-patient/Patient?PatientNo=${selectedRow[0].PatientNo}`, {
          state: { patientDetails: selectedRow[0] }
        });
      }

      const handlePatientCharges = () => {
        selectedRow[0]?.patientNo &&  navigate(`/Nurse/Admit-patient/Charges?PatientNo=${selectedRow[0].patientNo}`);
      }

      const handleCancelAdmission = () => {
        confirm({
            title: 'Confirm Cancel Admission',
            content: `Are you sure you want to cancel admission for ${selectedRow[0]?.Names} ?`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk(){
                return new Promise((resolve, reject) => {
                    handleCancelAdmissionAction()
                    .then(resolve) // Resolve the modal when successful
                    .catch(reject); // Reject on failure
                });
            },
        })
      }

      const handleCancelAdmissionAction = async () => {

        try {
            const result = await dispatch(
              postCancelAdmissionSlice({
                admissionNo: selectedRow[0]?.No,
              })
            );
        
            if (result.type === POST_CANCEL_ADMISSION_SUCCESS) {
              message.success(
                result.payload.message || `You have cancelled admission for ${selectedRow[0]?.Names} successfully!`
              );
              dispatch(getPgAdmissionsVerifiedSlice());
              return Promise.resolve(); // Resolve the Promise to close the modal
            } else if (result.type === POST_CANCEL_ADMISSION_FAILURE) {
              message.error(
                result.payload.message || 'An error occurred while cancelling patient admission, please try again.'
              );
              return Promise.reject(); // Reject the Promise to keep the modal open
            }
          } catch (error) {
            message.error(error.message || 'Unexpected error occurred');
            return Promise.reject(); // Reject on unexpected errors
          }
      }

      useEffect(() => {
        if(!getPatientAdmissions?.length) {
          dispatch(getPgAdmissionsVerifiedSlice());
        }
      }, [dispatch, getPatientAdmissions?.length]);

      useEffect(() => {
        if(!data.length) {
            dispatch(listDoctors());
        }
        }, [dispatch, data.length]);

  return (
        <Row style={{ margin: '20px 10px 10px 10px' }}>
            <Col span={24}>
                <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '10px'}}>
                    <ProfileOutlined />
                    <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '16px'}}>
                        Patient Admissions
                    </Typography.Text>
                </Space>

                <SearchFilters />
                    
                <Card className="admit-patient-card-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Space className="admit-patient-button-container">
                            <Button type="primary" disabled={!selectedRowKey} onClick={handleAdmitPatient}><PlusOutlined /> Admit Patient</Button>
                            <Button color="danger" variant="outlined" disabled={!selectedRowKey}onClick={handleCancelAdmission}><CloseOutlined /> Cancel Admission</Button>
                            <Button type="primary" disabled={!selectedRowKey} onClick={handlePatientCharges}><PayCircleOutlined /> Charges</Button>
                        </Space>
                        <Space className="admit-patient-button-container">
                            <Button type="primary" onClick={()=>exportToExcel(formattedPatientAdmissions, 'Admission request success list', 'admission-request-success-list.xlsx')}><FileExclamationOutlined /> Export Excel</Button>
                            <Button type="primary" onClick={()=>printToPDF(formattedPatientAdmissions, 'Admission request success list')}><PrinterOutlined /> Print PDF</Button>
                        </Space>
                    </div>
                </Card>

               {
                loadingGetPatientAdmissions || loading ? (
                    <Loading />
                ) : (
                    <Table 
                    rowKey="SystemId"
                    scroll={{ x: 'max-content' }}
                    columns={columns} 
                    dataSource={formattedPatientAdmissions} 
                    className="admit-patient-table"
                    rowSelection={rowSelection}
                    bordered size='middle' 
                    pagination={{
                    ...pagination,
                    total: formattedPatientAdmissions?.length,
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
    
            </Col>
        </Row>
  )
}

export default AdmitPatients