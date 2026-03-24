import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Table,
  Pagination,
  Typography,
} from "antd";
import { TeamOutlined } from "@ant-design/icons";
import { appmntList } from "../../actions/patientActions";
import { useNavigate } from "react-router-dom";

const DispatchedAppmnts = () => {
  const { loading, patients } = useSelector((state) => state.appmntList);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchParams, setSearchParams] = useState({
    SearchNames: "",
    AppointmentNo: "",
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(appmntList());
  }, [dispatch]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayDispatchedPatients = patients?.filter(
      (patient) =>
        patient.AppointmentDate === today && patient.Status === "Dispatched"
    );
    setFilteredPatients(todayDispatchedPatients);
  }, [patients]);
  
  const handleSearchChange = (e, key) => {
    const value = e.target.value;
    setSearchParams((prev) => ({ ...prev, [key]: value }));

    const filtered = filteredPatients.filter((patient) => {
      const matchesName =
        key === "SearchNames"
          ? patient.SearchNames.toLowerCase().includes(value.toLowerCase())
          : true;
      const matchesAppointmentNo =
        key === "AppointmentNo"
          ? patient.AppointmentNo.toLowerCase().includes(value.toLowerCase())
          : true;

      return matchesName && matchesAppointmentNo;
    });

    setFilteredPatients(filtered);
  };

  const handlePaginationChange = (page, pageSize) => {
    setPagination({ current: page, pageSize });
  };

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
      render: (text, record) => {
        return (
          <span
            className="fw-bold"
            style={{ color: "#b96000", cursor: "pointer" }}
          >
            {text.toUpperCase()}
          </span>
        );
      },
    },
    {
      title: "Appointment No",
      dataIndex: "AppointmentNo",
      key: "AppointmentNo",
      render: (text, record) => {
        return (
          <span
            className="fw-bold"
            style={{ color: "red", cursor: "pointer" }}
          >
            {text.toUpperCase()}
          </span>
        );
      },
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
        const dateTimeString = `${record.AppointmentDate}T${record.AppointmentTime}`;
        const dateTime = new Date(dateTimeString);
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
      title:"Doctor Name",
      dataIndex:"DoctorsName",
      key:"DoctorsName"
    },
    // {
    //   title: "Waiting At",
    //   dataIndex: "WaitingAt",
    //   key: "WaitingAt",
    // },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      render: (text) => {
        const color = text === "New" ? "#1890ff" : text === "Dispatched" ? "#52c41a" : "black";
        return (
          <span style={{ fontWeight: "bold", color }}>
            {text.toUpperCase()}
          </span>
        );
      },
    }
    
  ];

  const startIdx = (pagination.current - 1) * pagination.pageSize;
  const endIdx = startIdx + pagination.pageSize;
  const paginatedData = filteredPatients?.slice(startIdx, endIdx);

  return (
    <div>
      <h4 className="text-center p-3 text-dark">
        <TeamOutlined style={{ marginRight: "8px", fontSize: "24px" }} />
        Dispatched Patients List
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
    <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold",            color: "#003F6D",
 }}>
      Patient Names:
    </label>
    <Input
      placeholder="Search by Patient Names"
      value={searchParams.SearchNames}
      onChange={(e) => handleSearchChange(e, "SearchNames")}
    />
  </Col>
  <Col span={12}>
    <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold",            color: "#003F6D",
 }}>
      Appointment Number:
    </label>
    <Input
      placeholder="Search by Appointment Number"
      value={searchParams.AppointmentNo}
      onChange={(e) => handleSearchChange(e, "AppointmentNo")}
    />
  </Col>
</Row>

      </Card>

      <Table
        columns={columns}
        loading={loading}
        dataSource={paginatedData?.map((patient) => ({
          ...patient,
          key: patient.AppointmentNo,
        }))}
        pagination={false}
        bordered
        size="small"
      />
      <Pagination
        total={filteredPatients?.length}
        showTotal={(total, range) =>
          `${range[0]}-${range[1]} of ${total} items`
        }
        defaultPageSize={20}
        current={pagination.current}
        onChange={handlePaginationChange}
        style={{ float: "right", margin: "16px" }}
      />
    </div>
  );
};

export default DispatchedAppmnts;
