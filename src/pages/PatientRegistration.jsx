import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Avatar,
  Skeleton,
  Tabs,
  Menu,
  Dropdown,
  Button,
  Steps,
  Typography,
  Alert,
} from "antd";
import {
  ArrowLeftOutlined,
  CreditCardOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  MoreOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import useFetchPatientDetailsHook from "../hooks/useFetchPatientDetailsHook";
import GeneralInformation from "./reception-views/registrationPartials.jsx/GeneralInformation";
import NextofKinInformatiotion from "./reception-views/registrationPartials.jsx/NextofKinInformatiotion";
import RegionalInformation from "./reception-views/registrationPartials.jsx/RegionalInformation";
import BillingInformation from "./reception-views/registrationPartials.jsx/BillingInformation";
import MarketingInformation from "./reception-views/registrationPartials.jsx/MarketingInformation";
import { BiStreetView } from "react-icons/bi";
import AdvancedReceiptList from "./billing/CashPatients/AdvancedReceiptList";
import PreviousBill from "./billing/PreviousBill";

const PatientRegistration = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const patientNo = new URLSearchParams(location.search).get("PatientNo");
  const { loadingPatientDetails, patientDetails: data } =
    useFetchPatientDetailsHook(patientNo || null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [updated, setUpdated] = useState(false);
  const [current, setCurrent] = useState(0);
  const [showIncompleteAlert, setShowIncompleteAlert] = useState(false);
  const [view, setView] = useState(false);

  useEffect(() => {
    if (data) {
      setPatientDetails(data);
    } else {
      setPatientDetails(null);
    }
  }, [data, patientNo]);

  // Reset state if patientNo changes
  useEffect(() => {
    setPatientDetails(null);
  }, [patientNo]);

  const handleUpdatePatientDetails = (updatedDetails) => {
    setPatientDetails((prevDetails) => ({
      ...prevDetails,
      ...updatedDetails,
    }));
    setUpdated(true);
  };
  const handleMenuClick = ({ key }) => {
    switch (key) {
      case "create_visit":
        if (
          (current < steps.length - 1 && !patientDetails.PatientNo) ||
          !patientDetails.PatientType
        ) {
          setShowIncompleteAlert(true);
          return;
        }
        // // if last step but no patient details
        // if (current === steps.length - 1 && !patientDetails) {
        //   setShowIncompleteAlert(true);
        //   return;
        // }

        navigate(
          `/reception/Add-Appointment?PatientNo=${patientDetails.PatientNo}`,
          {
            state: { existingPatient: patientDetails },
          }
        );
        break;

      case "request_admission":
        navigate(
          `/Reception/patient-list/Direct-Admission/?PatientNo=${patientDetails.PatientNo}`,
          {
            state: { existingPatient: patientDetails },
          }
        );
        break;

      default:
        break;
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="create_visit">Create Visit</Menu.Item>
      <Menu.Item key="request_admission">Request Admission</Menu.Item>
      {/* <Menu.Item key="bill_patient">Bill Patient</Menu.Item> */}
    </Menu>
  );

  const steps = [
    {
      title: "General Info",
      icon: <InfoCircleOutlined />,
      content: (
        <GeneralInformation
          patientDetails={patientDetails}
          onUpdate={handleUpdatePatientDetails}
        />
      ),
    },
    {
      title: "Next of Kin",
      icon: <TeamOutlined />,
      content: (
        <NextofKinInformatiotion
          patientDetails={patientDetails}
          onUpdate={handleUpdatePatientDetails}
        />
      ),
    },
    {
      title: "Address",
      icon: <HomeOutlined />,
      content: (
        <RegionalInformation
          patientDetails={patientDetails}
          onUpdate={handleUpdatePatientDetails}
        />
      ),
    },
    {
      title: "Billing",
      icon: <CreditCardOutlined />,
      content: (
        <BillingInformation
          patientDetails={patientDetails}
          onUpdate={handleUpdatePatientDetails}
        />
      ),
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-2">
        <Button
          type="link"
          onClick={() => navigate(-1)}
          icon={<ArrowLeftOutlined />}
        >
          Go back{" "}
        </Button>
        <Typography.Title level={5}>
          <u>Patient Registration Card</u>
        </Typography.Title>
        <div className="d-flex align-items-center justify-content-between gap-2">
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button type="primary" icon={<MoreOutlined />}>
              <span className="ant-dropdown-link fw-bold">Actions</span>
            </Button>
          </Dropdown>
          <Button  onClick={() => setView(true)}>Previous Encounters</Button>
        </div>
      </div>

      <div className="d-flex flex-column" style={{ width: "100%" }}>
        <Card
          className="card"
          style={{
            width: "100%",
            borderTop: "3px solid #0f5689",
            padding: "20px",
          }}
        >
          {loadingPatientDetails ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : (
            <Row align="middle" gutter={16}>
              <Col flex="100px">
                <Avatar size={80} src={"profile"} icon={<UserOutlined />} />
              </Col>
              <Col flex="auto">
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, auto)",
                    gap: "12px 20px",
                    fontSize: "14px",
                    fontWeight: "400",
                  }}
                >
                  <span>
                    <b>Patient No:</b> {patientDetails?.PatientNo || "N/A"}
                  </span>
                  <span>
                    <b>Name:</b> {patientDetails?.SearchName || "N/A"}
                  </span>
                  <span>
                    <b>ID No:</b> {patientDetails?.IDNumber || "N/A"}
                  </span>
                  <span>
                    <b>DOB:</b> {patientDetails?.DateOfBirth || "N/A"}
                  </span>
                  <span>
                    <b>Gender:</b> {patientDetails?.Gender || "N/A"}
                  </span>
                  <span>
                    <b>Mode of Payment:</b>{" "}
                    {patientDetails?.PatientType || "N/A"}
                  </span>
                </div>
              </Col>
            </Row>
          )}
        </Card>

        {/* Tabs Section */}
        <Card
          style={{
            width: "100%",
            padding: "20px",
          }}
        >
          {showIncompleteAlert && (
            <Alert
              message="All patient registration details must be filled before creating a visit."
              type="error"
              showIcon
              closable
              onClose={() => setShowIncompleteAlert(false)}
              style={{
                marginBottom: 16,
                position: "relative",
              }}
              className="custom-alert"
            />
          )}

          <Steps
            current={current}
            items={steps.map((step, index) => ({
              title: (
                <span
                  style={{
                    color: current === index ? "#52c41a" : "#0f5689",
                    fontWeight: current === index ? "bold" : "normal",
                  }}
                >
                  {step.title}
                </span>
              ),
              icon: (
                <span
                  style={{
                    color: current === index ? "#52c41a" : "#0f5689",
                  }}
                >
                  {step.icon}
                </span>
              ),
            }))}
          />

          <div
            style={{
              marginTop: 30,
              minHeight: 200,
              padding: 24,
              background: "#fff",
              border: "1px solid #f0f0f0",
              borderRadius: 4,
            }}
          >
            {steps[current].content}
          </div>

          <div style={{ marginTop: 24, textAlign: "right" }}>
            {current > 0 && (
              <Button
                style={{ marginRight: 8 }}
                onClick={() => setCurrent((prev) => prev - 1)}
              >
                Previous
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button
                type="primary"
                onClick={() => setCurrent((prev) => prev + 1)}
              >
                Next
              </Button>
            )}
          </div>
        </Card>
      </div>
      <PreviousBill visible={view} patientNo={patientNo} onClose={() => setView(false)} />
    </div>
  );
};

export default PatientRegistration;
