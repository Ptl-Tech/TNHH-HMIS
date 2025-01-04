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
    </div>
  );
};

export default DischargeRequests;
