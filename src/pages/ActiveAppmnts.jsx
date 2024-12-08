import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Input,
  Menu,
  Row,
  Table,
  Typography,
  Pagination,
} from "antd";
import { EyeOutlined, TeamOutlined, DownOutlined } from "@ant-design/icons";
import { appmntList } from "../actions/patientActions";

const ActiveAppmnts = () => {
  const { loading, patients } = useSelector((state) => state.appmntList);
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

  useEffect(() => {
    dispatch(appmntList());
  }, [dispatch]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Current date in YYYY-MM-DD format
    const filtered = patients.filter((patient) => {
      const appointmentDate = new Date(patient.AppointmentDate)
        .toISOString()
        .split("T")[0];
      return appointmentDate === today;
    });
    setFilteredPatients(filtered);
  }, [patients]);

  const handleSearchChange = (e, key) => {
    const value = e.target.value;
    setSearchParams((prev) => ({ ...prev, [key]: value }));

    const filtered = patients.filter((patient) => {
      const matchesName = patient.SearchNames.toLowerCase().includes(
        searchParams.SearchNames.toLowerCase()
      );
      const matchesAppointmentNo = patient.AppointmentNo.toLowerCase().includes(
        searchParams.AppointmentNo.toLowerCase()
      );

      return matchesName && matchesAppointmentNo;
    });

    setFilteredPatients(filtered);
  };

  const handleMenuClick = ({ key }) => {
    console.log(`Dispatching patients to: ${key}`);
    console.log("Selected Patients:", selectedRowKeys);
    // Implement your dispatch logic here.
  };

  const handlePaginationChange = (page, pageSize) => {
    setPagination({ current: page, pageSize });
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="Triage">Triage</Menu.Item>
      <Menu.Item key="Pharmacy">Pharmacy</Menu.Item>
      <Menu.Item key="Clinic">Clinic</Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "Patient No",
      dataIndex: "PatientNo",
      key: "PatientNo",
    },
    {
      title: "Patient Name",
      dataIndex: "SearchNames",
      key: "SearchNames",
    },
    {
      title: "Appointment No",
      dataIndex: "AppointmentNo",
      key: "AppointmentNo",
    },
    {
      title: "Appointment Date",
      dataIndex: "AppointmentDate",
      key: "AppointmentDate",
      render: (text) => {
        const date = new Date(text);
        return date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      },
    },
    {
    title: "Appointment Time",
    dataIndex: "AppointmentTime",
    key: "AppointmentTime",
    render: (text, record) => {
      // Combine AppointmentDate and AppointmentTime to create a valid Date object
      const dateTimeString = `${record.AppointmentDate}T${record.AppointmentTime}`;
      const dateTime = new Date(dateTimeString);

      // Format time to AM/PM
      return dateTime.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true, 
      });
    },
  },
    {
      title: "Gender",
      dataIndex: "Gender",
      key: "Gender",
    },
    {
      title: "Patient Type",
      dataIndex: "PatientType",
      key: "PatientType",
    },
    {
      title: "Visit Type",
      dataIndex: "VisitType",
      key: "VisitType",
    },
    {
      title: "Waiting At",
      dataIndex: "WaitingAt",
      key: "WaitingAt",
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
    },
  ];
  
  const startIdx = (pagination.current - 1) * pagination.pageSize;
  const endIdx = startIdx + pagination.pageSize;
  const paginatedData = filteredPatients.slice(startIdx, endIdx);

  return (
    <div>
      <h4 className="text-center p-3 text-dark">
        <TeamOutlined style={{ marginRight: "8px", fontSize: "24px" }} />
        Appointment List
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
        <Dropdown overlay={menu}>
          <Button type="primary" style={{ marginBottom: "16px" }}>
            Dispatch to <DownOutlined />
          </Button>
        </Dropdown>
        <Table
          columns={columns}
          loading={loading}
          dataSource={paginatedData.map((patient) => ({
            ...patient,
            key: patient.PatientNo,
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

export default ActiveAppmnts;
