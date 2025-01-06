import { Button, Card, message, Modal, Space, Table, Typography } from "antd"
import { ProfileOutlined, FileExclamationOutlined, PrinterOutlined, CheckSquareOutlined } from "@ant-design/icons"
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getPgAdmissionsPendingVerificationSlice } from "../../actions/nurse-actions/getPgAdmissionsPendingVerificationSlice";
import { listDoctors } from "../../actions/DropdownListActions";
import Loading from "../../partials/nurse-partials/Loading";
import SearchFilters from "./SearchFilters";
import { exportToExcel, printToPDF } from "../../utils/helpers";
import { POST_VERIFY_ADMISSION_FAILURE, POST_VERIFY_ADMISSION_SUCCESS, postVerifyAdmissionSlice } from "../../actions/nurse-actions/postVerifyAdmissionSlice";
import useSetTableCheckBoxHook from "../../hooks/useSetTableCheckBoxHook";

const AdmissionRequests = () => {

const columns = [
    {
        title: 'Admission No',
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
        dataIndex: 'Patient_Name',
        key: 'Patient_Name',
        render: (_, record) => {
            return <Typography.Text style={{ color: '#0f5689' }}>
                {record.Patient_Name}
            </Typography.Text>
        }
    },
    {
        title: 'Date',
        dataIndex: 'Date',
        key: 'Date',
    },
    {
        title: 'Doctor',
        dataIndex: 'DoctorName',
        key: 'DoctorName',
       
    },
    {
        title: 'Admission Remarks',
        dataIndex: 'Remarks',
        key: 'Remarks',
        fixed: 'right',
        width: 150
    },
];


const { confirm } = Modal;

const {loadingPendingAdmissionVerification, pendingAdmissionVerification} = useSelector(state => state.getPgAdmissionsPendingVerification);

const { loading, data } = useSelector(state => state.getDoctorsList);
const { selectedRow, selectedRowKey, rowSelection } = useSetTableCheckBoxHook();

const dispatch = useDispatch();


const formattedDoctorDetails = data.map(doctor => {
    return {
        DoctorID: doctor.DoctorID,
        DoctorsName: doctor.DoctorsName,
    }
});

const formattedList = pendingAdmissionVerification.map(discharge => {
    const matchDoctorName = formattedDoctorDetails.find(doctor => doctor.DoctorID === discharge.Doctor);
    return {
        ...discharge,
        DoctorName: matchDoctorName?.DoctorsName
    }
    
});


const [pagination, setPagination] = useState({
            current: 1,
            pageSize: 10,
            total: formattedList?.length,
        });
              
    const handleTableChange = (newPagination) => {
        setPagination(newPagination); // Update pagination settings
    };


    const handleVerifyAdmission = () => {
        confirm({
            title: 'Confirm Verify Patient Admission',
            content: `Are you sure you want to verify ${selectedRow[0]?.Patient_Name} admission ?`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk(){
                return new Promise((resolve, reject) => {
                    handleVerifyPatientAdmissionAction()
                    .then(resolve) // Resolve the modal when successful
                    .catch(reject); // Reject on failure
                });
            },
        })
    }


    const handleVerifyPatientAdmissionAction = async () => {
        try {
            const result = await dispatch(
              postVerifyAdmissionSlice({
                admissionNo: selectedRow[0]?.No,
              })
            );
        
            if (result.type === POST_VERIFY_ADMISSION_SUCCESS) {
              message.success(
                result.payload.message || `${selectedRow[0]?.Patient_Name} discharge initiated successfully!`
              );
              dispatch(getPgAdmissionsPendingVerificationSlice());
              return Promise.resolve(); // Resolve the Promise to close the modal
            } else if (result.type === POST_VERIFY_ADMISSION_FAILURE) {
              message.error(
                result.payload.message || 'An error occurred while verifying patient admission, please try again.'
              );
              return Promise.reject(); // Reject the Promise to keep the modal open
            }
          } catch (error) {
            message.error(error.message || 'Unexpected error occurred');
            return Promise.reject(); // Reject on unexpected errors
          }
    }


useEffect(() => {
    if(!pendingAdmissionVerification?.length){
        dispatch(getPgAdmissionsPendingVerificationSlice());
    }
}, [dispatch, pendingAdmissionVerification?.length]);

 useEffect(() => {
        if(!data.length) {
            dispatch(listDoctors());
        }
    }, [dispatch, data.length]);

  return (
    <div style={{ margin: '20px 10px 10px 10px' }}>
        <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '10px', position: 'relative'}}>
            <ProfileOutlined />
            <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '16px'}}>
                Admission Requests
            </Typography.Text>
          </Space>

          <SearchFilters />

        <Card className="admit-patient-card-container">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Space className="admit-patient-button-container">
                <Button type="primary" disabled={!selectedRowKey} onClick={handleVerifyAdmission}><CheckSquareOutlined />
                    Verify Patient Admission
                </Button>
            </Space>
            <Space className="admit-patient-button-container">
                <Button type="primary" onClick={()=>exportToExcel(formattedList, 'Admission request success list', 'admission-request-success-list.xlsx')}><FileExclamationOutlined /> Export Excel</Button>
                <Button type="primary" onClick={()=>printToPDF(formattedList, 'Admission request success list')}><PrinterOutlined /> Print PDF</Button>
            </Space>
        </div>
        </Card>


          {
              loadingPendingAdmissionVerification || loading ? (
                    <Loading />
                ) : (
                    <Table 
                    rowKey="SystemId"
                    scroll={{ x: 'max-content' }}
                    rowSelection={rowSelection}
                    columns={columns} 
                    dataSource={formattedList} 
                    className="admit-patient-table"
                    bordered size='middle' 
                    pagination={{
                    ...pagination,
                    total: formattedList?.length,
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
    </div>
  )
}

export default AdmissionRequests