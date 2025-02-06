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
  Modal,
  Form,
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
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const currentDate = dayjs().format("YYYY-MM-DD");

  const { loading: visitorsLoading, visitors } = useSelector(
    (state) => state.visitorsList
  );
  const { loading: patientsLoading, patients } = useSelector(
    (state) => state.patientList
  );

  const loading = visitorsLoading || patientsLoading || filterLoading;

  useEffect(() => {
    dispatch(getVisitorsList());
    dispatch(listPatients());
  }, [dispatch]);

  //console where visitors are existing patients
  if (
    visitors?.IDNumber === patients.IDNumber &&
    visitors?.Status === "Entered" &&
    visitors?.InitiatedDate === currentDate
  ) {
    console.log("visitors are existing patients", visitors);
  }

  //filter the visitors based on date and status only
  useEffect(() => {
    const filtered = visitors.filter((visitor) => {
      return (
        dayjs(visitor?.InitiatedDate).isSame(currentDate, "day") &&
        visitor?.Status === "Entered"
      );
    });
    setFilteredVisitors(filtered);
  }, [visitors, currentDate]);

  const handleSearchChange = (e, field) => {
    setSearchParams({ ...searchParams, [field]: e.target.value });
  };

  const getButtonText = (visitor) => {
    // Check if the visitor is already a patient
    const isPatient = patients.some(
      (patient) => patient.IDNumber === visitor.IDNumber
    );

    if (isPatient) {
      return "Create Visit"; // Show 'Create Visit' if the visitor is a patient
    } else {
      return "Convert to Patient"; // Show 'Convert to Patient' if the visitor is not yet a patient
    }
  };

  const getWalkInButtonText = (visitor) => {
    // Check if the visitor is already a patient
    const isPatient = patients.some(
      (patient) => patient.IDNumber === visitor.IDNumber
    );

    if (isPatient) {
      return "Create Visit"; // Show 'Create Visit' if the visitor is a patient
    } else {
      return "Register Walk In "; // Show 'Convert to Patient' if the visitor is not yet a patient
    }
  };

  const handleVisitCreation = (visitor) => {
    // Check if visitor is already a patient
    const existingPatient = patients.find(
      (patient) => patient.IDNumber === visitor.IDNumber
    );

    if (existingPatient) {
      // If found, create a new visit and navigate
      message.success("Create a New Visit.");
      navigate(`/reception/Add-Appointment/${existingPatient.PatientNo}`, {
        state: { existingPatient },
      });
    } else {
      // If not found, convert to patient
      openModal(visitor);
    }
  };

  const handleWalkInCreation = (visitor) => {
    // Check if visitor is already a patient
    const existingPatient = patients.find(
      (patient) => patient.IDNumber === visitor.IDNumber
    );

    if (existingPatient) {
      // If found, create a new visit and navigate
      message.success("Create a New Visit.");
      navigate(`/reception/Add-Appointment/${existingPatient.PatientNo}`, {
        state: { existingPatient },
      });
    } else {
      // If not found, convert to patient
      message.success("Create a New Patient.");
      navigate("/reception/Register-walkin", {
        state: { visitorData: selectedVisitor },
      });
    }
  };

  const openModal = (visitor) => {
    setSelectedVisitor({
      ...visitor,
      FirstName: visitor.FirstName || "",
      MiddleName: visitor.MiddleName || "",
      LastName: visitor.LastName || "",
    });
    setIsModalVisible(true);
  };

  const handleConvertToPatient = async () => {
    if (!selectedVisitor) return;

    try {
      const patientNo = await dispatch(convertPatient(selectedVisitor.No));
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
          message.success("Register Patient First.", 5);
          navigate("/reception/Patient-Registration", {
            state: { visitorData: selectedVisitor, patientNumber: patientNo },
          });
        }
      } else {
        message.warning("Unable to retrieve patient number.", 5);
      }
    } catch (error) {
      message.error("An error occurred while processing the request.", 5);
    }
    setIsModalVisible(false);
  };

  const columns = [
    { title: "Index", dataIndex: "index", render: (_, __, index) => index + 1 },
    { title: "Visitor No", dataIndex: "No" },
    {
      title: "Visitor Name",
      dataIndex: "VisitorName",
      render: (_, visitor) =>
        visitor.VisitorName?.trim()
          ? visitor.VisitorName
          : `${visitor.FirstName || ""} ${visitor.MiddleName || ""} ${visitor.LastName || ""}`.trim(),
    },
    { title: "ID Number", dataIndex: "IDNumber" },
    { title: "Phone Number", dataIndex: "PhoneNumber" },
    {
      title: "Date of Visit",
      dataIndex: "InitiatedDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (status) => (
        <Tag color={status === "Entered" ? "red" : "default"}>{status}</Tag>
      ),
    },
    {
      title: "Action",
      render: (_, visitor) => (
       <div className="d-flex flex-column gap-3">
        <Button type="primary" onClick={() => handleVisitCreation(visitor)}>
          {getButtonText(visitor)}
        </Button>
        <Button type="default" onClick={() => handleWalkInCreation(visitor)}>
          {getWalkInButtonText(visitor)}
        </Button>
       </div>
      ),
    },
  ];

  return (
    <div className="card mt-4">
      <div className="d-flex justify-content-between align-items-center m-4">
        <h5>
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
      <Card className="mb-4">
        <Row gutter={16}>
          <Col span={6}>
            <Input
              placeholder="ID Number"
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
        <Table columns={columns} dataSource={filteredVisitors} bordered />
      )}
      <Modal
        title="Visitor Details"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        style={{ top: 20 }}
        width={750}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="convert"
            type="primary"
            disabled={!selectedVisitor}
            loading={loading}
            onClick={handleConvertToPatient}
          >
            Convert to Patient
          </Button>,
        ]}
      >
        {selectedVisitor && (
          <Form layout="vertical">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Visitor Number">
                  <Input
                    value={selectedVisitor.No}
                    readOnly
                    style={{ fontWeight: "bold" }}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="First Name">
                  <Input value={selectedVisitor.FirstName} readOnly />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Middle Name">
                  <Input value={selectedVisitor.MiddleName} readOnly />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Last Name">
                  <Input value={selectedVisitor.LastName} readOnly />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Category">
                  <Input value={selectedVisitor.VisitorCategory} readOnly />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Reason for Visit">
                  <Input
                    value={
                      selectedVisitor.ReasonForVisit === "1"
                        ? "Medication"
                        : "Official Visit"
                    }
                    readOnly
                  />
                </Form.Item>
              </Col>
              {selectedVisitor.PersonToSee && (
                <Col span={8}>
                  <Form.Item label="Person to Visit">
                    <Input value={selectedVisitor.PersonToSee} readOnly />
                  </Form.Item>
                </Col>
              )}
            </Row>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default VisitorList;
