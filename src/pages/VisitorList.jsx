import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Card,
  Row,
  Col,
  Input,
  Tag,
  Typography,
  message,
} from "antd";
import { ReloadOutlined, TeamOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getVisitorsList } from "../actions/visitorsActions";
import { convertPatient, listPatients } from "../actions/patientActions";
import { useNavigate } from "react-router-dom";
import Loading from "../partials/nurse-partials/Loading";
import dayjs from "dayjs";

const VisitorList = () => {
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

  const { loading: visitorsLoading, visitors } = useSelector(
    (state) => state.visitorsList
  );
  const { loading: patientsLoading, patients } = useSelector(
    (state) => state.patientList
  );

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

      // Filter visitors based on the criteria
      const filtered = visitors.filter((visitor) => {
        const isToday = visitor.InitiatedDate === currentDate;
        const allowedStatuses = visitor.Status === "Entered";

        if(!isToday ){
          return false 
        }

        if(!allowedStatuses){
          return false 
        }

        const isPatient = patients.some(
          (patient) => patient.IDNumber === visitor.IDNumber
        );

        if(isToday && !isPatient && allowedStatuses){
          return true
        }

        // Filter logic: visitor initiated today, has entered status, and matches search params
        return (
          isToday &&
          allowedStatuses &&
          (!searchParams.VisitorName ||
            visitor.VisitorName?.toLowerCase().includes(
              searchParams.VisitorName.toLowerCase()
            )) &&
          (!searchParams.IdNumber ||
            visitor.IDNumber?.includes(searchParams.IdNumber)) &&
          (!searchParams.VisitorPhone ||
            visitor.PhoneNumber?.includes(searchParams.VisitorPhone)) &&
            visitor.Status !== "Converted to Patient"&&

          (isPatient || visitor.Status !== "Converted to Patient") 
        );
      });

      setFilteredVisitors(filtered);
      setFilterLoading(false);
    };

    // Run filters when visitors or patients data change
    if (visitors.length && patients.length) {
      applyFilters();
    }
  }, [visitors, patients, searchParams, currentDate]);

  // Trigger search change and update search parameters
  const handleSearchChange = (e, field) => {
    const value = e.target.value;
    const updatedSearchParams = {
      ...searchParams,
      [field]: value,
    };
    setSearchParams(updatedSearchParams);
  };

  // Determine button text based on visitor status
  const getButtonText = (visitor) => {
    const patient = patients.find(
      (patient) => patient.IDNumber === visitor.IDNumber
    );
    return patient ? "Create New Visit" : "Convert to Patient";
  };

  // Handle conversion of visitor to patient
  const handleConvertToPatient = async (visitor) => {
    try {
      const patientNo = await dispatch(convertPatient(visitor.No));

      if (patientNo) {
        const existingPatient = patients.find(
          (patient) => patient.PatientNo === patientNo
        );
        if (existingPatient) {
          message.success("Create New Patient Visit.", 5);
          navigate(`/reception/Add-Appointment/${patientNo}`, {
            state: { existingPatient },
          });
        } else {
          message.warning(
            "Patient not found. Please register the patient first.",
            5
          );
          navigate("/reception/Patient-Registration", {
            state: { visitorData: visitor, patientNumber: patientNo },
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
      dataIndex: "InitiatedDate",
      key: "InitiatedDate",
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
      render: (_, visitor) => {
        const buttonText = getButtonText(visitor);
        const isCreatedVisit = buttonText === "Create New Visit";
        const ghost = isCreatedVisit;

        return (
          <Button
            ghost={ghost}
            onClick={() => handleConvertToPatient(visitor)}
            type="primary"
          >
            {buttonText}
          </Button>
        );
      },
    },
  ];

  return (
    <div className="card mt-4">
      <div className="d-flex justify-content-between align-items-center m-4 text-dark ">
        <h5 style={{ color: "#ac8342", textAlign: "center" }}>
          <TeamOutlined style={{ marginRight: 8 }} />
          Current Visitors List
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
      {loading ? (
        <Loading />
      ) : (
        <Table
          columns={columns}
          dataSource={filteredVisitors}
          bordered
          size="small"
          style={{ marginTop: "16px" }}
        />
      )}
    </div>
  );
};

export default VisitorList;
