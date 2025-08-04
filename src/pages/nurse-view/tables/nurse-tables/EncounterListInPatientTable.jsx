import { Button, Table } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
// import useAuth from "../../../../hooks/useAuth";
import PropTypes from "prop-types";
import { useAuth } from "../../../../hooks/auth";

const EncounterListInPatientTable = ({
  filteredList,
  loadingConsultationRoomList,
}) => {
  const navigate = useNavigate();

  const columns = [
    {
      title: "admission Date",
      dataIndex: "admissionDate",
      key: "admissionDate",
      fixed: "left",
      width: 150,
    },
    {
      title: "Discharge Date",
      dataIndex: "dischargeDate",
      key: "dischargeDate",
    },
    {
      title: "Admission Number",
      dataIndex: "admissionNo",
      key: "admissionNo",
    },
    {
      title: "Primary Doctor",
      dataIndex: "doctorsName",
      key: "doctorsName",
    },
    {
      title: "Bed Number",
      dataIndex: "bedNo",
      key: "bedNo",
    },
    {
      title: "Ward Name",
      dataIndex: "wardNo",
      key: "wardNo",
    },
    {
      title: "Action",
      dataIndex: "PrintOut",
      key: "PrintOut",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <Button
          icon={<FilePdfOutlined />}
          onClick={() => handleOnClick(record)}
        >
          Encounter Summary
        </Button>
      ),
    },
  ];

  const handleOnClick = (record) => {
    navigate(
      `/Dashboard/Past-doctor-visit/Encounter?AdmNo=${record?.admissionNo}`,
      {
        state: { patientDetails: record },
      }
    );
  };

  return (
    <div>
      <Table
        scroll={{ x: "max-content" }}
        pagination={false}
        size="small"
        style={{ marginTop: "30px" }}
        rowKey={"TreatmentDate"}
        columns={columns}
        bordered
        dataSource={filteredList}
        loading={loadingConsultationRoomList}
      />
    </div>
  );
};

export default EncounterListInPatientTable;
// props validation
EncounterListInPatientTable.propTypes = {
  filteredList: PropTypes.array,
  loadingConsultationRoomList: PropTypes.bool,
  patientNo: PropTypes.string,
};
