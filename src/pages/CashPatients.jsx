import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Table,
  Typography,
  Pagination,
  Tooltip,
} from "antd";
import { EyeOutlined, TeamOutlined } from "@ant-design/icons";
import { listPatients } from "../actions/patientActions";
import { useNavigate } from "react-router-dom";

const CashPatients = () => {
  const {
    loading: patientsLoading,
    error: patientsError,
    patients,
  } = useSelector((state) => state.patientList);

  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchParams, setSearchParams] = useState({
    SearchNames: "",
    AppointmentNo: "",
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(listPatients());
  }, [dispatch]);

  useEffect(() => {
    // Filter only "Cash" patients and those with isActivated: true
    const cashPatients = patients.filter(
      (patient) => patient.PatientType === "Cash" && patient.Activated === true
    );
    setFilteredPatients(cashPatients);
  }, [patients]);
  
  const handleSearchChange = (e, key) => {
    const value = e.target.value;
    setSearchParams((prev) => ({ ...prev, [key]: value }));
  
    const filtered = patients.filter((patient) => {
      const matchesName = patient.Names.toLowerCase().includes(searchParams.SearchNames.toLowerCase());
      const matchesAppointmentNo = patient.AppointmentNo.toLowerCase().includes(searchParams.AppointmentNo.toLowerCase());
  
      // Ensure the patient is both 'Cash' and 'isActivated: true'
      return (
        matchesName &&
        matchesAppointmentNo &&
        patient.PatientType === "Cash" &&
        patient.isActivated === true
      );
    });
  
    setFilteredPatients(filtered);
  };
  
  const handlePaginationChange = (page, pageSize) => {
    setPagination({ current: page, pageSize });
  };

  useEffect(() => {
    const startIndex = (pagination.current - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    setFilteredPatients((prevPatients) => prevPatients.slice(startIndex, endIndex));
  }, [pagination]);

  const columns = [
    {
      title: "Patient No",
      dataIndex: "PatientNo",
      key: "PatientNo",
      sorter: (a, b) => a.PatientNo - b.PatientNo,
    },
    {
      title: "Patient Name",
      dataIndex: "SearchName",
      key: "SearchName",
      sorter: (a, b) => a.Names.localeCompare(b.SearchName),
    },
    { title: "Gender", dataIndex: "Gender", key: "Gender" },
    { title: "Patient Type", dataIndex: "PatientType", key: "PatientType" },
    { title: "ID Number", dataIndex: "IDNumber", key: "IDNumber" },
    {
      title: "Appointment Date",
      dataIndex: "ActiveAppointmentdate",
      key: "ActiveAppointmentdate",
      render: (text) => new Date(text).toLocaleDateString(),
      sorter: (a, b) => new Date(a.ActiveAppointmentdate) - new Date(b.ActiveAppointmentdate),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Tooltip title="View Details">
            <Button icon={<EyeOutlined />} onClick={() => showModal(record)}>
              View Details
            </Button>
          </Tooltip>
          {/* Action Button to redirect to billing page */}
          <Tooltip title="Bill and Clear">
            <Button
              type="primary"
              onClick={() => navigate(`/billing/${record.AppointmentNo}`)} // Updated to use navigate
            >
              Bill & Clear
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const startIdx = (pagination.current - 1) * pagination.pageSize;
  const endIdx = startIdx + pagination.pageSize;
  const paginatedData = filteredPatients.slice(startIdx, endIdx);

  return (
    <div>
      <h4 className="text-center p-3 text-dark">
        <TeamOutlined style={{ marginRight: "8px", fontSize: "24px" }} />
        Cash Patient List
      </h4>

      <Card className="card-header mb-4 mt-4 p-4">
        <Typography.Text
          style={{
            color: "#003F6D",
            fontWeight: "bold",
            marginBottom: "16px",
          }}
        >
          Find Patient Details by:
        </Typography.Text>
        <Row gutter={16} className="mt-2">
          <Col span={12}>
            <Input
              placeholder="Patient Names"
              value={searchParams.SearchNames}
              onChange={(e) => handleSearchChange(e, "SearchNames")}
            />
          </Col>
          <Col span={12}>
            <Input
              placeholder="Appointment Number"
              value={searchParams.AppointmentNo}
              onChange={(e) => handleSearchChange(e, "AppointmentNo")}
            />
          </Col>
        </Row>
      </Card>

      <div className="mt-4">
        <Table
          columns={columns}
          loading={patientsLoading}
          dataSource={paginatedData.map((patient) => ({
            ...patient,
            key: patient.AppointmentNo,
          }))}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }}
          rowClassName={(record) =>
            record.Status === "New" ? "row-warning" : ""
          }
          pagination={false}
          bordered
          size="small"
        />
        <Pagination
          total={filteredPatients.length}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} of ${total} items`
          }
          defaultPageSize={20}
          current={pagination.current}
          onChange={handlePaginationChange}
          style={{ float: "right", margin: "16px" }}
        />
      </div>

      <style jsx>{`
        .row-warning {
          background-color: #faad14 !important;
        }
      `}</style>
    </div>
  );
};

export default CashPatients;
