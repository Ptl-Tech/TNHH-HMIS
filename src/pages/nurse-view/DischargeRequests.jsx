<<<<<<< HEAD
import { Button, Card, Input, Space, Table, Typography, Modal, message } from "antd";
import { ProfileOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getPgInpatientDischargeRequestsSlice } from "../../actions/nurse-actions/getPgInpatientDischargeRequestsSlice";
import { listDoctors } from "../../actions/DropdownListActions";
import Loading from "../../partials/nurse-partials/Loading";
import { POST_INITIATE_DISCHARGE_FAILURE, POST_INITIATE_DISCHARGE_SUCCESS, postInitiateDischargeSlice } from "../../actions/nurse-actions/postInitiateDischargeSlice";

const DischargeRequests = () => {
    
    const columns = [
        {
            title: 'Admission No',
            dataIndex: 'AdmissionNo',
            key: 'AdmissionNo',
            fixed: 'left',
            width: 100
        },
        {
            title: 'Patient Names',
            dataIndex: 'Search_Name',
            key: 'Search_Name',
            render: (_, record) => {
                return <Typography.Text style={{ color: '#0f5689' }}>
                    {record.Search_Name}
                </Typography.Text>
            }
        },
        {
            title: 'Admission Date',
            dataIndex: 'AdmissionDate',
            key: 'AdmissionDate',
        },
        {
            title: 'Ward',
            dataIndex: 'Ward',
            key: 'Ward',
           
        },
        {
            title: 'Bed',
            dataIndex: 'Bed',
            key: 'Bed',
           
        },
        {
            title: 'Doctor',
            dataIndex: 'DoctorName',
            key: 'DoctorName',
        },
        {
            title: 'Admission Reason',
            dataIndex: 'AdmissionReason',
            key: 'AdmissionReason',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            fixed: 'right',
            width: 150,
            render: (_, record) => {
                return <Button type="primary" onClick={() => handleInitiateDischarge(record)}>Initiate Discharge</Button>
            }
        }
    ];

    const {loadingGetInpatientDischargeRequests, getInpatientDischargeRequest} = useSelector(state => state.getPgInpatientDischargeRequests);
    const dispatch = useDispatch();
    const { loading, data } = useSelector(state => state.getDoctorsList);
    const { confirm } = Modal;

    const formattedDoctorDetails = data.map(doctor => {
        return {
            DoctorID: doctor.DoctorID,
            DoctorsName: doctor.DoctorsName,
        }
    });

    const formattedPatientDischargeRequests = getInpatientDischargeRequest.map(discharge => {
        const matchDoctorName = formattedDoctorDetails.find(doctor => doctor.DoctorID === discharge.Doctor);
        return {
            ...discharge,
            DoctorName: matchDoctorName?.DoctorsName
        }
        
    });

    const [pagination, setPagination] = useState({
            current: 1,
            pageSize: 10,
            total: formattedPatientDischargeRequests?.length,
        });
              
    const handleTableChange = (newPagination) => {
        setPagination(newPagination); // Update pagination settings
    };

    const handleInitiateDischarge = (record) => {
        confirm({
            title: 'Confirm Initiate Discharge',
            content: `Are you sure you want to initiate discharge for ${record?.Search_Name} ?`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk(){
                return new Promise((resolve, reject) => {
                    handleInitiateDischargeAction(record)
                    .then(resolve) // Resolve the modal when successful
                    .catch(reject); // Reject on failure
                });
            },
        })
    }

    const handleInitiateDischargeAction = async (record) => {
        try {
            const result = await dispatch(
              postInitiateDischargeSlice('/Inpatient/InitiateDischarge', {
                admissionNo: record?.AdmissionNo,
              })
            );
        
            if (result.type === POST_INITIATE_DISCHARGE_SUCCESS) {
              message.success(
                result.payload.message || `${record?.Search_Name} discharge initiated successfully!`
              );
              dispatch(getPgInpatientDischargeRequestsSlice());
              return Promise.resolve(); // Resolve the Promise to close the modal
            } else if (result.type === POST_INITIATE_DISCHARGE_FAILURE) {
              message.error(
                result.payload.message || 'An error occurred while initiating patient discharge, please try again.'
              );
              return Promise.reject(); // Reject the Promise to keep the modal open
            }
          } catch (error) {
            message.error(error.message || 'Unexpected error occurred');
            return Promise.reject(); // Reject on unexpected errors
          }
    }

    useEffect(() => {
        if(!getInpatientDischargeRequest?.length)
            dispatch(getPgInpatientDischargeRequestsSlice());
    }, [dispatch, getInpatientDischargeRequest?.length]);

    useEffect(() => {
        if(!data.length) {
            dispatch(listDoctors());
        }
    }, [dispatch, data.length]);
=======
import { Card, Input, Space, Table, Typography } from "antd";
import { ProfileOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {  getDischargeRequestList } from "../../actions/Doc-actions/Admission/getdischargeList";
import { getPatientDetails } from "../../actions/Doc-actions/OutPatientAction";
import useAuth from "../../hooks/useAuth";

const DischargeRequests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
const userDetails = useAuth();  // Use the custom hook to get user info
  const { loading, data } = useSelector((state) => state.getDischargeListRequests);
  const { loading: loadingPatientDetails, patientDetails } = useSelector(
    (state) => state.getPatientDetails
  );

  const [selectedRecord, setSelectedRecord] = useState(null);

  // Fetch discharge list on component mount
  useEffect(() => {
    dispatch(getDischargeRequestList());
  }, [dispatch]);

  // Fetch patient details when `selectedRecord` changes
  useEffect(() => {
    if (selectedRecord?.PatientNo) {
      dispatch(getPatientDetails(selectedRecord.PatientNo));
    }
  }, [dispatch, selectedRecord]);

  const handleNavigate = () => {
    if(userDetails.userData.departmentName === 'Nurse'){
       navigate(`/Nurse/Inpatient/Patient-card?PatientNo=${record?.PatientNo}&AdmNo=${record?.AdmissionNo}`, {
         state: { patientDetails: record },
       });
      }else{
       navigate(`/Doctor/Inpatient/Patient-card?PatientNo=${record?.PatientNo}&AdmNo=${record?.AdmissionNo}`, {
         state: { patientDetails: record },
       });
      }
  };

  const columns = [
    {
      title: "Adm No",
      dataIndex: "AdmissionNo",
      key: "AdmissionNo",
    },
    {
      title: "Patient No",
      dataIndex: "PatientNo",
      key: "PatientNo",
    },
    {
      title: "Names",
      dataIndex: "Search_Names",
      key: "Search_Names",
      render: (_, record) => (
        <a
          onClick={() => setSelectedRecord(record)}
          style={{ color: "#0f5689" }}
        >
          {record.Search_Names}
        </a>
      ),
    },
    {
      title: "Adm Date",
      dataIndex: "DateofAdmission",
      key: "DateofAdmission",
    },
    {
      title: "Ward",
      dataIndex: "WardNo",
      key: "WardNo",
    },
    {
      title: "Bed",
      dataIndex: "BedNo",
      key: "BedNo",
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "Action",
      render: (_, record) => (
        <Space size="middle">
          <a
            style={{ color: "#0f5689" }}
            onClick={() => handleNavigate(record.PatientNo, record.AdmissionNo)}
          >
            Discharge
          </a>
        </Space>
      ),
    },
  ];
>>>>>>> main

  return (
    <div style={{ margin: "20px 10px 10px 10px" }}>
      <Space
        style={{
          color: "#0f5689",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          paddingBottom: "10px",
        }}
      >
        <ProfileOutlined />
        <Typography.Text
          style={{ fontWeight: "bold", color: "#0f5689", fontSize: "16px" }}
        >
          Discharge Request List
        </Typography.Text>
      </Space>

<<<<<<< HEAD
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
            loadingGetInpatientDischargeRequests || loading ? 

            <Loading /> 

            :

            <Table 
            rowKey="SystemId"
            scroll={{ x: 'max-content' }}
            columns={columns} 
            dataSource={formattedPatientDischargeRequests} 
            className="admit-patient-table"
            bordered size='middle' 
            pagination={{
            ...pagination,
            total: formattedPatientDischargeRequests?.length,
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
        }
            
=======
      <Card style={{ padding: "10px" }}>
        <div className="admit-patient-filter-container">
          <Input placeholder="Search by name" allowClear />
          <span style={{ color: "gray", fontSize: "14px", fontWeight: "bold" }}>
            or
          </span>
          <Input placeholder="Search by patient no" allowClear />
          <span style={{ color: "gray", fontSize: "14px", fontWeight: "bold" }}>
            or
          </span>
          <Input placeholder="Search by ID number" allowClear />
        </div>
      </Card>

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        className="admit-patient-table"
        rowKey="AdmissionNo"
      />
>>>>>>> main
    </div>
  );
};

<<<<<<< HEAD
export default DischargeRequests
=======
export default DischargeRequests;
>>>>>>> main
