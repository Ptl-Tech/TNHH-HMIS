import { Button, Table } from "antd";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const PastDoctorNotesTable = ({
  combinedPatients,
  loadingDoctors,
  loadingEncounters,
}) => {
  const navigate = useNavigate();

  const columns = [
    {
      title: "Encounter Number",
      dataIndex: "TreatmentNo",
      key: "TreatmentNo",
      fixed: "left",
      width: 150,
      render: (text, record) => {
        return (
          <span
            onClick={() => handleNavigate(record)}
            className="fw-bold"
            style={{ color: "#0f5689", cursor: "pointer" }}
          >
            {text.toUpperCase()}
          </span>
        );
      },
    },
    {
      title: "Date",
      dataIndex: "TreatmentDate",
      key: "TreatmentDate",
    },
    {
      title: "Patient Type",
      dataIndex: "TreatmentType",
      key: "TreatmentType",
    },
    {
      title: "Clinic",
      dataIndex: "Clinic",
      key: "Clinic",
    },
    {
      title: "Doctor Name",
      dataIndex: "DoctorsName",
      key: "DoctorsName",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 200,
      render: (_, record) => (
        <Button
          style={{ color: "#0f5689" }}
          onClick={() => handleNavigate(record)}
        >
          Encounter Summary
        </Button>
      ),
    },
  ];

  const handleNavigate = (record) => {
    navigate(
      `Dashboard/Inpatient/Encounter?TreatmentNo=${record?.TreatmentNo}&PatientNo=${record?.PatientNo}`,
      {
        state: {
          patientDetails: record,
        },
      }
    );
  };
  return (
    <div style={{ paddingTop: "30px" }}>
      <Table
        columns={columns}
        dataSource={combinedPatients}
        loading={loadingDoctors || loadingEncounters}
        scroll={{ x: "max-content" }}
        bordered
        size="small"
      />
    </div>
  );
};

export default PastDoctorNotesTable;

//props validation
PastDoctorNotesTable.propTypes = {
  combinedPatients: PropTypes.array,
  loadingDoctors: PropTypes.bool,
  loadingEncounters: PropTypes.bool,
};
