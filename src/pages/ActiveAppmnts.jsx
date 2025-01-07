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
  message,
} from "antd";
import { EyeOutlined, TeamOutlined, DownOutlined } from "@ant-design/icons";
import { appmntList, postTriageVisit } from "../actions/patientActions";
import dayjs from "dayjs";
import { getAppmntDetails } from "../actions/getAppmntDetails";
import { useNavigate } from "react-router-dom";

const ActiveAppmnts = () => {
  const { loading, patients } = useSelector((state) => state.appmntList);
  const currentDate = dayjs().format("YYYY-MM-DD");
  const {  data:visitData } = useSelector((state) => state.getPatientVisit);
const navigate=useNavigate();

  const {
    loading: postTriageVisitLoading,
    error: postTriageVisitError,
    success: postTriageVisitSuccess,
    payload: postTriageVisitPayload,
  } = useSelector((state) => state.postTriageVisit);

  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchParams, setSearchParams] = useState({
    SearchNames: "",
    AppointmentNo: "",
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);  // Keeping AppointmentNo as selected key
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(appmntList());
  }, [dispatch]);

  useEffect(() => {
    const filtered = patients.filter((patient) => {
      const appointmentDate = new Date(patient.AppointmentDate)
        .toISOString()
        .split("T")[0];
      return appointmentDate === currentDate && patient.Status === "New";
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

  const handleMenuClick = async ({ key }) => {
    if (key === "Triage") {
      if (selectedRowKeys.length === 0) {
        message.error("Please select a patient first.");
        return;
      }

      const appointmentId = selectedRowKeys[0]; // Using AppointmentNo as Appointment ID
      console.log(`Dispatching patient with ID: ${appointmentId}`);
     
      await dispatchPatient(appointmentId);
    } else {
      console.log(`Dispatching patients to: ${key}`);
      console.log("Selected Patients:", selectedRowKeys);
      // Handle dispatch logic for other menu options
    }
  };

  const dispatchPatient = async (appointmentId) => {
    if (!appointmentId) {
      message.error("Appointment ID is required!");
      return;
    }
  
    try {
      // Fetch appointment details
      const visitDetails = await dispatch(getAppmntDetails(appointmentId));
      
      // Validate patient type and special clinics
      if (!visitDetails?.PatientType || !visitDetails?.SpecialClinics) {
        message.error("Please ensure Patient Type and Special Clinics are filled before dispatching.");
        navigate(`/reception/Add-Appointment/${appointmentId}`, {
          state: { existingPatient: visitDetails },
        });
      }
  
      // Dispatch Triage Visit
      await dispatch(postTriageVisit(appointmentId));
      message.success("Patient has been dispatched successfully!");
  
      // Remove dispatched patient from the filtered list
      setFilteredPatients((prev) =>
        prev.filter((patient) => patient.AppointmentNo !== appointmentId)
      );
    } catch (error) {
      console.error("Error dispatching patient:", error);
      message.error("Failed to dispatch patient!");
    }
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
      title: "Appointment No",  // Using AppointmentNo as key
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
            key: patient.AppointmentNo,  // Set AppointmentNo as the unique key
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
