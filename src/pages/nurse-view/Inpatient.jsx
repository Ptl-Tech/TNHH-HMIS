import { Card, Input, Space, Table, Typography } from "antd";
import { ProfileOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPatientListSlice } from "../../actions/nurse-actions/getPatientListSlice";
import useAuth from "../../hooks/useAuth";

const Impatient = () => {
  const dispatch = useDispatch();
  const userDetails = useAuth();  // Use the custom hook to get user info
  const { patients: dataSource } = useSelector((state) => state.patientList);

  const navigate = useNavigate();

  const handleNavigate = (record) => {
   if(userDetails.userData.departmentName === 'Nurse'){
    navigate(`/Nurse/Inpatient/Patient-card?PatientNo=${record?.PatientNo}&AdmNo=${record?.AdmNo}`, {
      state: { patientDetails: record },
    });
   }else{
    navigate(`/Doctor/Inpatient/Patient-card?PatientNo=${record?.PatientNo}&AdmNo=${record?.AdmNo}`, {
      state: { patientDetails: record },
    });
   }
  };

  useEffect(() => {
    dispatch(getPatientListSlice());
  }, [dispatch]);

  const { allPatientLList } = useSelector((state) => state.getPatientList) || {};

  const filterInPatients =
    allPatientLList?.filter((item) => item.Inpatient === true) || [];

  const columns = [
    {
      title: "Adm No",
      dataIndex: "AdmNo",
      key: "AdmNo",
    },
    {
      title: "Patient No",
      dataIndex: "PatientNo",
      key: "PatientNo",
    },
    {
      title: "Names",
      dataIndex: "SearchName",
      key: "SearchName",
      render: (_, record) => (
        <a
          onClick={() => handleNavigate(record)}
          style={{ color: "#0f5689" }}
        >
          {record.SearchName}
        </a>
      ),
    },
    {
      title: "Adm Date",
      dataIndex: "AdmissionsDate",
      key: "AdmissionsDate",
    },
    {
      title: "Ward",
      dataIndex: "ward",
      key: "ward",
      render: (ward) => ward || "Not assigned",
    },
    {
      title: "Bed",
      dataIndex: "bed",
      key: "bed",
    },
    {
      title: "Doctor",
      dataIndex: "doctor",
      key: "doctor",
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
          position: "relative",
        }}
      >
        <ProfileOutlined />
        <Typography.Text
          style={{ fontWeight: "bold", color: "#0f5689", fontSize: "16px" }}
        >
          Current Inpatients
        </Typography.Text>
        <Space
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            right: "3px",
            top: "2px",
          }}
        >
          <span
            style={{ color: "black", fontSize: "14px", fontWeight: "bold" }}
          >
            Total Patients
          </span>
          <span
            style={{
              backgroundColor: "#0f5689",
              borderRadius: "50%",
              width: "25px",
              height: "25px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
            }}
          >
            {filterInPatients.length || 0}
          </span>
        </Space>
      </Space>

      <Card style={{ padding: "10px 10px 10px 10px" }}>
        <div className="admit-patient-filter-container">
          <Input placeholder="search by name" allowClear showCount />
          <span style={{ color: "gray", fontSize: "14px", fontWeight: "bold" }}>
            or
          </span>
          <Input placeholder="search by patient no" allowClear showCount />
          <span style={{ color: "gray", fontSize: "14px", fontWeight: "bold" }}>
            or
          </span>
          <Input placeholder="search by id number" allowClear showCount />
        </div>
      </Card>

      <Table
        columns={columns}
        dataSource={filterInPatients}
        className="admit-patient-table"
        rowKey={(record) => record.PatientNo}
      />
    </div>
  );
};

export default Impatient;
