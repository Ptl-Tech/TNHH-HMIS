import { Button, Table } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";

const EncounterListInPatientTable = () => {
const navigate = useNavigate();
const userDetails = useAuth();
const user = userDetails.userData.departmentName
  const columns = [
    {
      title: "Encounter Date",
      dataIndex: "TreatmentDate",
      key: "TreatmentDate",
      fixed: "left",
      width: 150,
    },
    {
      title: "Treatment Number",
      dataIndex: "TreatmentNo",
      key: "TreatmentNo",
    },
    {
      title: "Primary Doctor",
      dataIndex: "DoctorsName",
      key: "DoctorsName",
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
      title: "Action",
      dataIndex: "PrintOut",
      key: "PrintOut",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <Button icon={<FilePdfOutlined />} onClick={() => handleOnClick(record)}>
          Discharge summary
        </Button>
      ),
    },
  ];

  const handleOnClick = (record) => {
    if(user === 'Nurse'){
        navigate(`/Nurse/Past-doctor-visit/Patient/Encounter?AdmissionNo=${record?.AdmissionNo}`, {
          state: { patientDetails: record },
        });
       }else if(user === 'Doctor'){
           navigate(`/Doctor/Past-doctor-visit/Patient/Encounter?AdmissionNo=${record?.AdmissionNo}`, {
               state: { patientDetails: record },
           });
       }else{
           navigate(`/Psychology/Past-doctor-visit/Patient/Encounter?AdmissionNo=${record?.AdmissionNo}`, {
               state: { patientDetails: record },
           });
       }
  };

  return (
    <div>
      <Table
        style={{ marginTop: "30px" }}
        rowKey={"TreatmentDate"}
        columns={columns}
        bordered
        dataSource={[]}
      />
    </div>
  );
};

export default EncounterListInPatientTable;
