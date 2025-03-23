import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, Row, Col, Avatar, Skeleton, Tabs } from "antd";
import { UserOutlined } from "@ant-design/icons";
import useFetchPatientDetailsHook from "../hooks/useFetchPatientDetailsHook";
import GeneralInformation from "./reception-views/registrationPartials.jsx/GeneralInformation";
import NextofKinInformatiotion from "./reception-views/registrationPartials.jsx/NextofKinInformatiotion";
import RegionalInformation from "./reception-views/registrationPartials.jsx/RegionalInformation";
import BillingInformation from "./reception-views/registrationPartials.jsx/BillingInformation";
import MarketingInformation from "./reception-views/registrationPartials.jsx/MarketingInformation";

const PatientRegistration = () => {
  const patientNo = new URLSearchParams(useLocation().search).get("PatientNo");
  const { loadingPatientDetails, patientDetails: data } =
    useFetchPatientDetailsHook(patientNo);
  const [patientDetails, setPatientDetails] = useState(data);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    setPatientDetails(data);
  }, [data]);

  const handleUpdatePatientDetails = (updatedDetails) => {
    setPatientDetails((prevDetails) => ({ ...prevDetails, ...updatedDetails }));
    setUpdated(true);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "20px",
        width: "100%",
      }}
    >
      <div className="d-flex flex-column" style={{ width: "100%" }}>
        <Card
          style={{
            width: "100%",
            maxWidth: "2900px",
            padding: "20px",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          {loadingPatientDetails ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : (
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
                  <span>
                    <b>Patient No:</b> {patientDetails?.PatientNo || "N/A"}
                  </span>
                  <span>
                    <b>Name:</b>                     {patientDetails?.SearchName || ""}

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
                </div>
              </Col>
            </Row>
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
          }}
        >
          <Tabs defaultActiveKey="1" tabPosition="left">
            <Tabs.TabPane tab="General Information" key="1">
              <GeneralInformation
                patientDetails={patientDetails}
                onUpdate={handleUpdatePatientDetails}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Next of Kin" key="2">
              <NextofKinInformatiotion patientDetails={patientDetails} onUpdate={handleUpdatePatientDetails} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Address & Region" key="3">
              <RegionalInformation patientDetails={patientDetails} onUpdate={handleUpdatePatientDetails} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Billing Information" key="4">
              <BillingInformation patientDetails={patientDetails} onUpdate={handleUpdatePatientDetails} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="How Did You Hear About Us ?" key="5">
              <MarketingInformation patientDetails={patientDetails} onUpdate={handleUpdatePatientDetails} />
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default PatientRegistration;
