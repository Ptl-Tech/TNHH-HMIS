import { Table, Typography, Spin, Input, Button } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getBillingList } from "../../actions/Charges-Actions/getBillingList";
import { useAuth } from "../../hooks/auth";
const formatKES = (amount) => {
  const parsed = parseFloat(amount);
  if (isNaN(parsed)) return "KES 0.00";
  return parsed.toLocaleString("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
  });
};

const InsurancePatients = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate(); // React Router navigation
  
  const { loading, patients } = useSelector((state) => state.getBillingList);
  const branchCode = user?.branchCode;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const pageSize = 25; // Number of patients per page

  useEffect(() => {
    dispatch(getBillingList()); // Fetch data only once
  }, [dispatch]);

  // Process patient list: filter inactive patients
  const filteredPatients = patients
    ?.filter(
      (patient) =>
        patient?.Activated &&
        !patient?.Inpatient &&
        patient?.PatientType === "Corporate" &&
        patient?.Global_Dimension_1_Code === branchCode
    )
    .map((patient) => ({
      ...patient,
      key: patient.PatientNo,
      Balance: `KSH ${parseFloat(patient.Balance || 0).toFixed(2)}`,
    }))
    .filter(
      (patient) =>
        patient.Names.toLowerCase().includes(searchText.toLowerCase()) ||
        patient.PatientNo.toLowerCase().includes(searchText.toLowerCase())
    );

  // Navigate to view charges page with patient ID
  const handleViewCharges = (patientId) => {
    navigate(`/Dashboard/CorporatePatient-Charges?PatientNo=${patientId}`);
  };

  const columns = [
     {
      title:"#",
      //index: "index",
      render: (text, record, index) => index + 1.,
    },
    {
      title: "Patient No",
      dataIndex: "PatientNo",
      key: "PatientNo",
    },
    {
      title: "Patient Name",
      dataIndex: "Names",
      key: "Names",
      render: (text, record) => (
        <Typography.Text
          style={{ cursor: "pointer", color: "#0f5689" }}
          onClick={() => handleViewCharges(record.ActiveVisitNo)}
        >
          {text.toUpperCase()}
        </Typography.Text>
      ),
    },
    {
      title: "Active Visit No",
      dataIndex: "ActiveVisitNo",
      key: "ActiveVisitNo",
    },
    {
      title: "Payment Type",
      dataIndex: "PatientType",
      key: "PatientType",
    },
    {
      title: "Branch Code",
      dataIndex: "Global_Dimension_1_Code",
      key: "Global_Dimension_1_Code",
    },
    {
      title: "Balance",
      dataIndex: "Balance",
      key: "Balance",
      render: (_, record) => {
        const numericBalance =
          parseFloat(record.Balance?.toString().replace(/[^0-9.-]+/g, "")) || 0;
        const isZero = numericBalance === 0;

        return (
          <span
            style={{ color: isZero ? "black" : "#0f5689", fontWeight: "600" }}
          >
            {formatKES(numericBalance)}
          </span>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => handleViewCharges(record.ActiveVisitNo)}
        >
          View Charges
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Typography.Title level={4}>Insurance Patients</Typography.Title>

      {/* Search Input */}
      <Input
        placeholder="Search by Patient Name or No..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: "100%", marginBottom: 16 }}
      />

      {loading ? (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredPatients}
          size="small"
          bordered
                  pagination={{
  position: ["bottomRight"],
  showSizeChanger: true,
  pageSizeOptions: ["25", "50", "100", "200"], // user can pick
  defaultPageSize: 35, // least page size
}}
          rowKey="PatientNo"
          locale={{ emptyText: "No patients found" }}
          style={{ marginTop: "10px", borderRadius: "8px" }}
        />
      )}
    </div>
  );
};

export default InsurancePatients;
