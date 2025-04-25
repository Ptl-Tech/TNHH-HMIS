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
} from "antd";
import {
  ArrowLeftOutlined,
  MoreOutlined,
  UserOutlined,
} from "@ant-design/icons";
import useFetchPatientDetailsHook from "../hooks/useFetchPatientDetailsHook";
import GeneralInformation from "./reception-views/registrationPartials.jsx/GeneralInformation";
import NextofKinInformatiotion from "./reception-views/registrationPartials.jsx/NextofKinInformatiotion";
import RegionalInformation from "./reception-views/registrationPartials.jsx/RegionalInformation";
import BillingInformation from "./reception-views/registrationPartials.jsx/BillingInformation";
import MarketingInformation from "./reception-views/registrationPartials.jsx/MarketingInformation";

const PatientRegistration = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const patientNo = new URLSearchParams(location.search).get("PatientNo");
  const { loadingPatientDetails, patientDetails: data } =
    useFetchPatientDetailsHook(patientNo || null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    if (data) {
      setPatientDetails(data);
    } else {
      setPatientDetails(null);
    }
  }, [data]);

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
        // Navigate with proper query parameters
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
      // case "bill_patient":
      //   navigate(
      //     `/Reception/Patient-Charges/Patient?PatientNo=${patientDetails.PatientNo}`,
      //     {
      //       state: { existingPatient: patientDetails },
      //     }
      //   );
      //   break;
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

        <Dropdown overlay={menu} trigger={["click"]}>
          <Button type="dashed" icon={<MoreOutlined />}>
            <span className="ant-dropdown-link fw-bold">Actions</span>
          </Button>
        </Dropdown>
      </div>

      <div className="d-flex flex-column" style={{ width: "100%" }}>
        <Card
          style={{
            width: "100%",
            maxWidth: "2900px",
            padding: "20px",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
            border: "2px solid #0f5689",
          }}
        >
          {loadingPatientDetails ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : patientDetails ? (
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
          ) : (
            <p style={{ textAlign: "center", fontSize: "16px", color: "#888" }}>
              No patient details found. Register a new patient.
            </p>
          )}
        </Card>

        {/* Tabs Section */}
        <Card
          style={{
            width: "100%",
            maxWidth: "2900px",
            padding: "20px",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
            marginTop: "20px",
            border: "2px solid #0f5689",
          }}
        >
          <Tabs
            defaultActiveKey="1"
            tabPosition="left"
            style={{
              border: "2px solid #0f5689",
              borderRadius: "5px",
              padding: "5px",
            }}
          >
            <Tabs.TabPane tab="General Information" key="1">
              <GeneralInformation
                patientDetails={patientDetails}
                onUpdate={handleUpdatePatientDetails}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Next of Kin" key="2">
              <NextofKinInformatiotion
                patientDetails={patientDetails}
                onUpdate={handleUpdatePatientDetails}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Address & Region" key="3">
              <RegionalInformation
                patientDetails={patientDetails}
                onUpdate={handleUpdatePatientDetails}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Billing Information" key="4">
              <BillingInformation
                patientDetails={patientDetails}
                onUpdate={handleUpdatePatientDetails}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="How Did You Hear About Us ?" key="5">
              <MarketingInformation
                patientDetails={patientDetails}
                onUpdate={handleUpdatePatientDetails}
              />
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default PatientRegistration;
