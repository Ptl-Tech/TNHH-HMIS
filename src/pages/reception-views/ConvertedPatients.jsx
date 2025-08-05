import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Tag,
  Row,
  Col,
  Card,
  Typography,
  message,
} from "antd";
import { ReloadOutlined, TeamOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { getVisitorsList } from "../../actions/visitorsActions";
import { convertPatient, listPatients } from "../../actions/patientActions";
import { useNavigate } from "react-router-dom";
import Loading from "../../partials/nurse-partials/Loading";

const ConvertedPatients = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchParams, setSearchParams] = useState({
    IdNumber: "",
    VisitorName: "",
    VisitorPhone: "",
  });
  const [filteredVisitors, setFilteredVisitors] = useState([]);
  const [filterLoading, setFilterLoading] = useState(false);

  const currentDate = dayjs().format("YYYY-MM-DD");

  const { loading: visitorsLoading, visitors } = useSelector((state) => state.visitorsList);
  const { loading: patientsLoading, patients } = useSelector((state) => state.patientList);

  const loading = visitorsLoading || patientsLoading || filterLoading;

  // Fetch initial data
  useEffect(() => {
    dispatch(getVisitorsList());
    dispatch(listPatients());
  }, [dispatch]);

  // Apply filters
  useEffect(() => {
    const applyFilters = () => {
      setFilterLoading(true);
      const filtered = visitors.filter((visitor) => {
        const isPatientActivated = patients.some(
          (patient) => patient.IDNumber === visitor.IDNumber && patient.Activated
        );

        // Exclude activated patients
        if (isPatientActivated) return false;

        return (
          dayjs(visitor.CreatedDate).isSame(currentDate, "day") &&
          visitor.Status === "Converted to Patient" &&
          (!searchParams.VisitorName ||
            visitor.VisitorName?.toLowerCase().includes(
              searchParams.VisitorName.toLowerCase()
            )) &&
          (!searchParams.IdNumber || visitor.IDNumber?.includes(searchParams.IdNumber)) &&
          (!searchParams.VisitorPhone || visitor.PhoneNumber?.includes(searchParams.VisitorPhone))
        );
      });
      setFilteredVisitors(filtered);


      setFilterLoading(false);
    };

    if (visitors.length && patients.length) {
      applyFilters();
    }
  }, [visitors, patients, searchParams, currentDate]);

  const handleSearchChange = (e, field) => {
    setSearchParams({
      ...searchParams,
      [field]: e.target.value,
    });
  };

  const handleConvertToPatient = async (visitor) => {
    try {
      const patientNo = await dispatch(convertPatient(visitor.No));
      if (patientNo) {
        const existingPatient = patients.find(
          (patient) => patient.PatientNo === patientNo
        );
        if (existingPatient) {
          message.success("Create new Appointment.", 5);
          navigate(`/Dashboard/Add-Appointment/${patientNo}`, {
            state: { existingPatient },
          });
        } else {
          message.warning(
            "Patient not found. Please register the patient first.",
            5
          );
          navigate(`/Dashboard/Patient-Registration/Patient?PatientNo=${patientNo}`, {
            state: { visitorData: visitor },
          });
        }
      } else {
        message.warning("Unable to retrieve patient number.", 5);
      }
    } catch (error) {
      message.error("An error occurred while processing the request.", 5);
    }
  };

  const columns = [
    {
      title: "Index",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    { title: "Visitor No", dataIndex: "No", key: "No" },
    { title: "Visitor Name", dataIndex: "VisitorName", key: "VisitorName" },
    { title: "ID Number", dataIndex: "IDNumber", key: "IDNumber" },
    {
      title: "Phone Number",
      dataIndex: "PhoneNumber",
      key: "PhoneNumber",
    },
    {
      title: "Date of Visit",
      dataIndex: "CreatedDate",
      key: "CreatedDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      render: (status) => {
        const statusColors = {
          Arrived: "orange",
          Entered: "red",
          Received: "blue",
          Cleared: "green",
        };
        return <Tag color={statusColors[status] || "default"}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, visitor) => (
        <Button
          onClick={() => handleConvertToPatient(visitor)}
          type="primary"
        >
          Convert to Patient
        </Button>
      ),
    },
  ];

  return (
    <div className="card mt-4">
      <div className="d-flex justify-content-between align-items-center m-4 text-dark ">
        <h5 style={{ color: "#ac8342", textAlign: "center" }}>
          <TeamOutlined style={{ marginRight: 8 }} />
          Converted Patient List
        </h5>
        <Button
          icon={<ReloadOutlined />}
          type="primary"
          onClick={() => dispatch(getVisitorsList())}
        >
          Refresh
        </Button>
      </div>
      <Card className="card-header mb-4 p-4">
        <Typography.Text style={{ color: "#003F6D", fontWeight: "bold" }}>
          Find Visitor Details by:
        </Typography.Text>
        <Row gutter={16} className="mt-2">
          <Col span={6}>
            <Input
              placeholder="Id Number"
              value={searchParams.IdNumber}
              onChange={(e) => handleSearchChange(e, "IdNumber")}
              allowClear
            />
          </Col>
          <Col span={6}>
            <Input
              placeholder="Visitor Name"
              value={searchParams.VisitorName}
              onChange={(e) => handleSearchChange(e, "VisitorName")}
              allowClear
            />
          </Col>
          <Col span={6}>
            <Input
              placeholder="Visitor Phone"
              value={searchParams.VisitorPhone}
              onChange={(e) => handleSearchChange(e, "VisitorPhone")}
              allowClear
            />
          </Col>
        </Row>
      </Card>
      {
  loading ? (
    <Loading />
  ) : (
    <Table
      columns={columns}
      dataSource={filteredVisitors} // Use the memoized filtered list here
      pagination={{ pageSize: 10 }}
      bordered
      size="small"
      style={{ marginTop: "16px" }}
    />
  )
}

    </div>
  );
};

export default ConvertedPatients;
