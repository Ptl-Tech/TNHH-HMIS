import { Button, Table, Tag } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";
import Loading from "../../../../partials/nurse-partials/Loading";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";

const InpatientTable = ({
  loadingPatientList,
  handleNavigate,
  filterInPatients,
  loading,
  searchName,
  searchPatientNumber,
  searchAdmissionNumber,
}) => {
  const role = useAuth().userData.departmentName;
  const columns = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Adm No",
      dataIndex: "Admission_No",
      key: "Admission_No",
      filteredValue: searchAdmissionNumber ? [searchAdmissionNumber] : null,
      onFilter: (value, record) =>
        record?.Admission_No
          ? record.Admission_No.toLowerCase().includes(value.toLowerCase())
          : false,
    },
    {
      title: "Patient No",
      dataIndex: "Patient_No",
      key: "Patient_No",
      filteredValue: searchPatientNumber ? [searchPatientNumber] : null,
      onFilter: (value, record) =>
        record?.Patient_No
          ? record.Patient_No.toLowerCase().includes(value.toLowerCase())
          : false,
    },
    {
      title: "Patient Names",
      dataIndex: "PatientName",
      key: "PatientName",
      filteredValue: searchName ? [searchName] : null,
      onFilter: (value, record) =>
        record?.PatientName
          ? record.PatientName.toLowerCase().includes(value.toLowerCase())
          : false,
      render: (_, record) => (
        <a
          onClick={() => handleNavigate(record)}
          style={{ color: "#0f5689", fontWeight: "bold" }}
        >
          {record.PatientName}
        </a>
      ),
    },
    {
      title: "Branch",
      dataIndex: "Branch",
      key: "Branch",
    },
    {
      title: "Adm Date",
      dataIndex: "Admission_Date",
      key: "Admission_Date",
      sorter: (a, b) => new Date(b.Admission_Date) - new Date(a.Admission_Date),
      defaultSortOrder: "ascend", // Ensure default sorting is newest to oldest
      //format to dd//MM//yyyy
      render: (date) => {
        const formattedDate = new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        return formattedDate;
      },
    },
    {
      title: "Ward",
      dataIndex: "Ward",
      key: "Ward",
      render: (ward, record) =>
        ward ? (
          ward
        ) : role === "Nurse" ? (
          <Button
            variant="link"
            style={{ color: "red", textDecoration: "none" }}
            onClick={() => handleClick(record)}
          >
            <ExclamationCircleOutlined
              style={{ color: "red", marginRight: 8 }}
            />
            <span>Assign Ward</span>
          </Button>
        ) : (
          <span style={{ color: "#0f5689" }}>Not yet assigned</span>
        ), // Renders nothing for roles other than Nurse
    },
    {
      title: "Room",
      dataIndex: "Ward_Room",
      key: "Ward_Room",
    },
    {
      title: "Bed",
      dataIndex: "Bed",
      key: "Bed",
      render: (bed, record) =>
        bed ? (
          bed
        ) : role === "Nurse" ? (
          <Button
            variant="link"
            style={{ color: "red", textDecoration: "none" }}
            onClick={() => handleClick(record)}
          >
            <ExclamationCircleOutlined
              style={{ color: "red", marginRight: 8 }}
            />
            <span>Assign Bed</span>
          </Button>
        ) : (
          <span style={{ color: "#0f5689" }}>Not yet assigned</span>
        ), // Renders nothing for roles other than Nurse
    },
    {
      title: "Doctor",
      dataIndex: "DoctorsName",
      key: "DoctorsName",
      render: (doctor) => doctor || "Not assigned",
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      render: (value) => {
        let color = null;
        switch (value) {
          case "Admitted":
            color = "#00CC66";
            break;
          case "Discharge Pending":
            color = "#FFBF00";
            break;
        }
        return color ? <Tag color={color}>{value}</Tag> : null;
      },
    },
  ];
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: filterInPatients?.length,
  });

  const handleTableChange = (newPagination) => {
    setPagination(newPagination); // Update pagination settings
  };

  const navigate = useNavigate();
  const handleClick = (record) => {
    record?.Patient_No &&
      navigate(`/Nurse/Admit-patient/Patient?PatientNo=${record?.Patient_No}`, {
        state: { patientDetails: record },
      });
  };

  return (
    <>
      {loadingPatientList || loading ? (
        <Loading />
      ) : (
        <Table
          columns={columns}
          dataSource={filterInPatients}
          className="admit-patient-table"
          bordered
          size="middle"
          rowKey={(record) => record.PatientNo}
          pagination={{
            ...pagination,
            total: filterInPatients?.length,
            showSizeChanger: true,
            showQuickJumper: true,
            position: ["bottom", "right"],
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
            onChange: (page, pageSize) =>
              handleTableChange({
                current: page,
                pageSize,
                total: pagination.total,
              }),
            onShowSizeChange: (current, size) =>
              handleTableChange({
                current,
                pageSize: size,
                total: pagination.total,
              }),
            style: {
              marginTop: "30px",
            },
          }}
        />
      )}
    </>
  );
};

export default InpatientTable;

// props validation
InpatientTable.propTypes = {
  loadingPatientList: PropTypes.bool,
  handleNavigate: PropTypes.func,
  filterInPatients: PropTypes.array,
  loading: PropTypes.bool,
  searchName: PropTypes.string,
  searchPatientNumber: PropTypes.string,
  searchAdmissionNumber: PropTypes.string,
};
