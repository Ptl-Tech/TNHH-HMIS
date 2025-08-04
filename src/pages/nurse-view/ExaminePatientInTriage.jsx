import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Card, Tabs, Row, Col, Avatar, Typography, Button } from "antd";
import { UserOutlined, DiffOutlined, SendOutlined } from "@ant-design/icons";

// import useAuth from "../../hooks/useAuth";
import { calculateAge } from "../../utils/helpers";
import Dressing from "./forms/triage-forms/Dressing";
import FormVitals from "./forms/triage-forms/Vitals";
import Loading from "../../partials/nurse-partials/Loading";
import SkeletonLoading from "../../partials/nurse-partials/Skeleton";
import AllergyAndMedication from "./forms/triage-forms/AllergyAndMedication";
import { getPatientDetails } from "../../actions/triage-actions/getPatientDetailsSlice";
import TriageDispatchToDoctorFormData from "./nurse-forms/TriageDispatchToDoctorFormData";
import { useAuth } from "../../hooks/auth";

const EvaluatePatientInTriage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const dispatch = useDispatch();

  // Parse the query parameters using URLSearchParams
  const queryParams = new URLSearchParams(location.search);
  const patientNo = queryParams.get("Patient_id");
  const observationNo = queryParams.get("Ob_number");

  const staffNo = user?.staffNo;

  const [isDispatchFormVisible, setIsDispatchFormVisible] = useState(false);

  useEffect(() => {
    dispatch(getPatientDetails(patientNo));
  }, [dispatch, patientNo]);

  const { loading: loadingPatientDetails, data: patientDetails } = useSelector(
    (state) => state.getPatientDetails
  );

  const patientName =
    patientDetails?.SearchName ||
    [
      patientDetails?.Surname,
      patientDetails?.FirstName,
      patientDetails?.MiddleName,
    ]
      .filter(Boolean) // Remove null, undefined, or empty strings
      .join(" "); // Join with a space

  const handleVitalsButtonVisibility = () => {
    setIsDispatchFormVisible(!isDispatchFormVisible);
  };

  const infoRows = [
    { label: "Patient Number", value: patientDetails?.PatientNo },
    { label: "Observation No", value: observationNo },
  ];

  return (
    <div style={{ margin: "16px 10px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "16px",
        }}
      >
        <div>
          <Typography.Text
            style={{ fontSize: "18px", color: "#0f5689", fontWeight: "600" }}
          >
            <DiffOutlined style={{ paddingRight: "8px" }} />
            Triage Observation Form
          </Typography.Text>
        </div>

        {!isDispatchFormVisible && (
          <div>
            <Button
              type="primary"
              onClick={handleVitalsButtonVisibility}
              style={{ fontSize: "18px", color: "#ffffff", fontWeight: "500" }}
              icon={<SendOutlined />}
            >
              Dispatch patient to the Doctor
            </Button>
          </div>
        )}
      </div>
      <Row gutter={[8, 8]} style={{ marginBottom: "16px" }}>
        {loadingPatientDetails ? (
          <SkeletonLoading />
        ) : (
          <Col xs={24} md={24} lg={12} xl={12}>
            <Card
              style={{
                padding: "10px 16px",
                marginRight: "10px",
                borderTop: "3px solid #0f5689",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "start",
                  gap: "12px",
                }}
              >
                <Avatar icon={<UserOutlined />} size={48} />
                <div style={{ marginTop: "10px" }}>
                  <Typography.Title
                    level={5}
                    style={{ color: "black", fontSize: "13px" }}
                  >
                    {patientName}
                  </Typography.Title>
                  <Typography.Text style={{ fontSize: "13px", color: "gray" }}>
                    DOB: {patientDetails?.DateOfBirth}
                  </Typography.Text>
                </div>
              </div>
              <div>
                <Typography.Title
                  level={5}
                  style={{
                    color: "#0f5689",
                    fontSize: "14px",
                    margin: "10px 0 10px 0",
                  }}
                >
                  Age and Gender: {patientDetails?.Gender},{" "}
                  {calculateAge(patientDetails?.DateOfBirth)}
                </Typography.Title>
              </div>
            </Card>
          </Col>
        )}
        {loadingPatientDetails ? (
          <Loading />
        ) : (
          <Col xs={24} md={24} lg={12} xl={12}>
            <Card
              style={{
                padding: "10px 16px",
                marginRight: "10px",
                borderTop: "3px solid #0f5689",
              }}
            >
              <Typography.Title
                level={5}
                style={{
                  color: "#0f5689",
                  fontSize: "14px",
                  margin: "10px 0 10px 0",
                }}
              >
                Additional Information
              </Typography.Title>
              {infoRows.map((row, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography.Title
                    level={5}
                    style={{ fontSize: "14px", color: "black" }}
                  >
                    {row.label}
                  </Typography.Title>
                  <Typography.Text
                    style={{
                      fontSize: "12px",
                      color: "gray",
                      fontWeight: "bold",
                    }}
                  >
                    {row.value}
                  </Typography.Text>
                </div>
              ))}
            </Card>
          </Col>
        )}
      </Row>

      {isDispatchFormVisible && (
        <Card
          style={{
            padding: "10px 16px",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          <TriageDispatchToDoctorFormData
            staffNo={staffNo}
            observationNo={observationNo}
            setIsDispatchFormVisible={setIsDispatchFormVisible}
          />
        </Card>
      )}

      {!isDispatchFormVisible && (
        <Row gutter={[16, 16]} className="inpatient-card-container">
          <Col xs={24} md={24} lg={24} xl={24}>
            <Card style={{ padding: "10px 16px" }}>
              <Tabs type="card">
                <Tabs.TabPane tab="Vitals" key="1">
                  <FormVitals
                    observationNumber={observationNo}
                    patientNumber={patientNo}
                  />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Allergies and Medication" key="2">
                  <AllergyAndMedication
                    observationNumber={observationNo}
                    patientNumber={patientNo}
                    staffNo={staffNo}
                  />
                </Tabs.TabPane>
                {/* <Tabs.TabPane tab="Injections" key="3">
                              <Injections observationNumber={observationNo} staffNo={staffNo}/>
                          </Tabs.TabPane> */}
                <Tabs.TabPane tab="Dressings" key="4">
                  <Dressing
                    observationNumber={observationNo}
                    staffNo={staffNo}
                  />
                </Tabs.TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default EvaluatePatientInTriage;
