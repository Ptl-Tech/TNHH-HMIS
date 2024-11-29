import React, { useEffect, useState } from "react";
import { Button, Tooltip, Table, Card, Input, Row, Col, Typography } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { TriageWaitingList } from "../actions/TriageActions";
import { listPatients } from "../actions/patientActions";

const WaitingList = () => {
  const { loading, error, data } = useSelector((state) => state.triageWaitingList);
  const { patients } = useSelector((state) => state.patientList); // Assuming you have a patientList state

  const [searchParams, setSearchParams] = useState({
    firstName: "",
    lastName: "",
    patientId: "",
    patientNo: "",
  });

  const dispatch = useDispatch();

  // Fetch Triage Waiting List and Patients List
  useEffect(() => {
    dispatch(TriageWaitingList()); // Fetch Triage Waiting List
    dispatch(listPatients());     // Fetch Patients List
  }, [dispatch]);

  const handleSearchChange = (e, key) => {
    setSearchParams({
      ...searchParams,
      [key]: e.target.value,
    });
  };

  // Helper function to get patient details using LinkNo
  const getPatientDetails = (linkNo) => {
    const patient = patients?.find((p) => p.ActiveVisitNo === linkNo);
    return patient ? patient.SearchName : "Unknown Patient";
  };

  const columns = [
    {
      title: "Serial No",
      dataIndex: "SerialNo",
      key: "PatientID",
      sorter: (a, b) => a.PatientID - b.PatientID,
    },
    {
      title: "First Name",
      dataIndex: "Names",
      key: "Names",
      sorter: (a, b) => a.SearchName.localeCompare(b.Names),
    },
    {
      title: "Last Name",
      dataIndex: "LastName",
      key: "LastName",
      sorter: (a, b) => a.LastName.localeCompare(b.LastName),
    },
    {
      title: "Patient No",
      dataIndex: "PatientNo",
      key: "PatientNo",
      sorter: (a, b) => a.PatientNo - b.PatientNo,
    },
    { title: "Sex", dataIndex: "Gender", key: "Gender" },
    { title: "Patient Type", dataIndex: "PatientType", key: "PatientType" },
    { title: "ID Number", dataIndex: "idNumber", key: "IDNumber" },
    {
      title: "Date Registered",
      dataIndex: "DateRegistered",
      key: "DateRegistered",
      render: (text) => new Date(text).toLocaleDateString(),
      sorter: (a, b) => new Date(a.DateRegistered) - new Date(b.DateRegistered),
    },
    { title: "Status", dataIndex: "Status", key: "Status" },
    {
      title: "Triage Check In",
      key: "actions",
      render: (_, record) => (
        <div style={{ gap: "8px" }}>
          <Tooltip title="Check In">
            <Button icon={<SendOutlined />}>Check In</Button>
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Patient Details",
      key: "patientDetails",
      render: (_, record) => (
        <div>
          <Typography.Text>{getPatientDetails(record.No)}</Typography.Text>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ textAlign: "center", color: "#E89641" }}>Waiting List</h2>
      
      <Card className="card-header mb-4">
        <Typography.Text level={4} style={{ color: "#ac8342", fontWeight: "bold", marginBottom: "16px" }}>
          Search Patient By:
        </Typography.Text>
        <Row gutter={16}>
          <Col span={6}>
            <Input
              placeholder="First Name"
              value={searchParams.firstName}
              onChange={(e) => handleSearchChange(e, "firstName")}
              allowClear
            />
          </Col>
          <Col span={6}>
            <Input
              placeholder="Last Name"
              value={searchParams.lastName}
              onChange={(e) => handleSearchChange(e, "lastName")}
              allowClear
            />
          </Col>
          <Col span={6}>
            <Input
              placeholder="Patient ID"
              value={searchParams.patientId}
              onChange={(e) => handleSearchChange(e, "patientId")}
              allowClear
            />
          </Col>
          <Col span={6}>
            <Input
              placeholder="Patient No"
              value={searchParams.patientNo}
              onChange={(e) => handleSearchChange(e, "patientNo")}
              allowClear
            />
          </Col>
        </Row>
      </Card>

      <Table
        columns={columns}
        dataSource={patients}
        rowKey="PatientNo"
        pagination={false}
      />
    </div>
  );
};

export default WaitingList;
