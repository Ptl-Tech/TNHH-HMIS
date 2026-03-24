import { Button, Table, Tag } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";
import Loading from "../../../../partials/nurse-partials/Loading";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAbility } from "../../../../hooks/casl";
// import useAuth from "../../../../hooks/useAuth";

const InpatientTable = ({
  loading,
  searchName,
  handleNavigate,
  filterInPatients,
  loadingPatientList,
  searchPatientNumber,
  searchAdmissionNumber,
}) => {
  const ability = useAbility();

  const canCreateAssignBed = ability.can("create", "assignBed");
  const canCreateAssignWard = ability.can("create", "assignWard");

  const columns = [
    {
      title: "#",
      key: "key",
      dataIndex: "key",
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
          style={{ color: "#b96000", fontWeight: "bold" }}
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
        ) : canCreateAssignWard ? (
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
          <span style={{ color: "#b96000" }}>Not yet assigned</span>
        ),
    },
    {
      title: "Room",
      dataIndex: "WardRoom",
      key: "WardRoom",
    },
    {
      title: "Bed",
      dataIndex: "Bed",
      key: "Bed",
      render: (bed, record) =>
        bed ? (
          bed
        ) : canCreateAssignBed ? (
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
          <span style={{ color: "#b96000" }}>Not yet assigned</span>
        ),
    },
    {
      title: "Doctor",
      dataIndex: "Doctors_Name",
      key: "Doctors_Name",
      render: (doctor, record) =>
        record.Doctors_Name || record.DoctorsName || "Not assigned",
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
      navigate(
        `/Dashboard/Admit-patient/Patient?PatientNo=${record?.Patient_No}`,
        {
          state: { patientDetails: record },
        }
      );
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
