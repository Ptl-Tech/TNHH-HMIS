import { Table, Typography, Spin, Input, Button, Tooltip } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getBillingList } from "../../actions/Charges-Actions/getBillingList";
import { getPgAdmissions } from "../../actions/nurse-actions/getPgAdmissionsAdmittedSlice";
import moment from "moment";
import { CgEyeAlt } from "react-icons/cg";
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
  const branchCode = user?.branchCode;

  const { loading, patients } = useSelector((state) => state.getBillingList);
  const { loading: loadingAdmittedPatients, admittedPatients } = useSelector(
    (state) => state.getAdmissionList
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const pageSize = 25; // Number of patients per page

  useEffect(() => {
    dispatch(getBillingList()); // Fetch data only once
    dispatch(getPgAdmissions()); // Fetch admitted patients
  }, [dispatch]);

  // Process patient list: filter inactive patients
  const filteredPatients = patients
    ?.filter(
      (patient) =>
        patient?.Activated &&
        patient?.Inpatient &&
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
  //formatted list joining details from admittedPatients using usememo
  const formattedPatients = useMemo(() => {
    return filteredPatients.map((patient) => {
      const admittedPatient = admittedPatients.find(
        (admitted) => admitted.Patient_No === patient.PatientNo
      );
      return {
        ...patient,
        AdmissionDate: admittedPatient?.Admission_Date,
        DoctorsName: admittedPatient?.Doctors_Name,
        RoomNo: admittedPatient?.WardRoom,
        WardNo: admittedPatient?.Ward,
      };
    });
  }, [filteredPatients, admittedPatients]);
  // Navigate to view charges page with patient ID
  const handleViewCharges = (patientId) => {
    console.log("Patient ID:", patientId); // Log the patient ID for debugging
    navigate(`/Dashboard/Corporate-Inpatient-Charges?PatientNo=${patientId}`);
  };

  const columns = [
    {
      title: "Admission No  ",
      dataIndex: "ActiveVisitNo",
      key: "ActiveVisitNo",
      render: (text) => (
        <span
          style={{
            textTransform: "capitalize",
            fontWeight: "bold",
            color: "#0f5689",
          }}
        >
          {text || "-"}
        </span>
      ),
    },

    {
      title: "Gender",
      dataIndex: "Gender",
      key: "Gender",
      render: (text) => <span>{text || "-"}</span>,
    },
    {
      title: "Patient Name",
      dataIndex: "Names",
      key: "Names",
      render: (text, record) => (
        <Typography.Text
          style={{ cursor: "pointer", color: "#0f5689", fontWeight: "bold" }}
          onClick={() => handleViewCharges(record.ActiveVisitNo)}
        >
          {text.toUpperCase()}
        </Typography.Text>
      ),
    },

    {
      title: "Billing Type",
      dataIndex: "PatientType",
      key: "PatientType",
    },
    {
      title: "Covered By",
      dataIndex: "Insurance_Name",
      key: "Insurance_Name",
    },
    {
      title: "Branch Code",
      dataIndex: "Global_Dimension_1_Code",
      key: "Global_Dimension_1_Code",
    },
    {
      title: "Admission Date",
      dataIndex: "AdmissionDate",
      key: "AdmissionDate",
      render: (date) => (date ? moment(date).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "Consulting Doctor",
      dataIndex: "DoctorsName",
      key: "DoctorsName",
      render: (text) => <span>{text || "-"}</span>,
    },
    {
      title: "Room No",
      dataIndex: "RoomNo",
      key: "RoomNo",
      render: (text) => <span>{text || "-"}</span>,
    },
    {
      title: "Ward No",
      dataIndex: "WardNo",
      key: "WardNo",
      render: (text) => <span>{text || "-"}</span>,
    },
    {
      title: " Insurance Amount",
      dataIndex: "Open_Insurance_Amount",
      key: "Open_Insurance_Amount",
      render: (text) => {
        const numericLimit =
          parseFloat(text?.toString().replace(/[^0-9.-]+/g, "")) || 0;
        return (
          <span
            style={{
              color: numericLimit === 0 ? "black" : "#0f5689",
              fontWeight: "600",
            }}
          >
            {formatKES(numericLimit)}
          </span>
        );
      },
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
        <Tooltip title="View Patient Details">
          <Button
            type="primary"
            onClick={() => handleViewCharges(record.ActiveVisitNo)}
          >
            <CgEyeAlt />
          </Button>
        </Tooltip>
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
          dataSource={formattedPatients}
          size="small"
          bordered
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: formattedPatients?.length || 0,
            onChange: (page) => setCurrentPage(page),
            showSizeChanger: false,
          }}
        />
      )}
    </div>
  );
};

export default InsurancePatients;
