import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Row, Col, Avatar, Skeleton, Tabs, Dropdown, Menu, Button } from "antd";
import { UserOutlined, MoreOutlined } from "@ant-design/icons";
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
    useFetchPatientDetailsHook(patientNo);
  const [patientDetails, setPatientDetails] = useState(null);

  useEffect(() => {
    setPatientDetails(data || null);
  }, [data]);

  const handleMenuClick = ({ key }) => {
    switch (key) {
      case "create_visit":
        console.log("Create Visit clicked");
        break;
      case "request_admission":
        console.log("Request Admission clicked");
        break;
      case "bill_patient":
        console.log("Bill Patient clicked");
        break;
      case "go_back":
        navigate("/patients");
        break;
      default:
        break;
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="create_visit">Create Visit</Menu.Item>
      <Menu.Item key="request_admission">Request Admission</Menu.Item>
      <Menu.Item key="bill_patient">Bill Patient</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="go_back">Go Back to Patient List</Menu.Item>
    </Menu>
  );

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", width: "100%" }}>
      <div className="d-flex flex-column" style={{ width: "100%" }}>
        {/* Patient Details Card with Menu */}
        <Card
          style={{
            width: "100%",
            maxWidth: "2900px",
            padding: "20px",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
            border: "1.5px solid #0f5689",
            position: "relative",
          }}
        >
          {/* Menu Button */}
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button
              type="text"
              shape="circle"
              icon={<MoreOutlined />}
              style={{ position: "absolute", top: 20, left: 20 }}
            />
          </Dropdown>

          {patientDetails && patientDetails?.PatientNo ?  (
            loadingPatientDetails ? (
              <Skeleton active paragraph={{ rows: 4 }} />
            ) : patientDetails ? (
              <Row align="middle" gutter={16}>
                <Col flex="100px">
                  <Avatar
                    size={80}
                    src={patientDetails?.ProfilePicture || ""}
                    icon={!patientDetails?.ProfilePicture && <UserOutlined />}
                  />
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
                    <span><b>Patient No:</b> {patientDetails?.PatientNo || "N/A"}</span>
                    <span><b>Name:</b> {patientDetails?.SearchName || "N/A"}</span>
                    <span><b>ID No:</b> {patientDetails?.IDNumber || "N/A"}</span>
                    <span><b>DOB:</b> {patientDetails?.DateOfBirth || "N/A"}</span>
                    <span><b>Gender:</b> {patientDetails?.Gender || "N/A"}</span>
                  </div>
                </Col>
              </Row>
            ) : (
              <p style={{ textAlign: "center", fontSize: "16px", color: "#888" }}>
                No patient details found.
              </p>
            )
          ) : (
            <p style={{ textAlign: "center", fontSize: "16px", color: "#888" }}>
              Register New Patient
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
            border: "1.5px solid #0f5689",
          }}
        >
          <Tabs defaultActiveKey="1" tabPosition="left">
            <Tabs.TabPane tab="General Information" key="1">
              <GeneralInformation patientDetails={patientDetails} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Next of Kin" key="2">
              <NextofKinInformatiotion patientDetails={patientDetails} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Address & Region" key="3">
              <RegionalInformation patientDetails={patientDetails} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Billing Information" key="4">
              <BillingInformation patientDetails={patientDetails} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="How Did You Hear About Us?" key="5">
              <MarketingInformation patientDetails={patientDetails} />
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default PatientRegistration;
