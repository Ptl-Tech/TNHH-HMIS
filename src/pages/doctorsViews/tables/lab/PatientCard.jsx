import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Button, Card, Typography, Row, Col } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { getPatientDetails } from "../../../../actions/Doc-actions/OutPatientAction";

const PatientCard = ({ patientNo, labObservationNo, patientLabRecord }) => {
  const dispatch = useDispatch();
  const labNo = new URLSearchParams(location.search).get("LaboratoryNo");

  const { loadingPatientDetails, patientDetails } = useSelector(
    (state) => state.getPatientDetails
  );

  useEffect(() => {
    dispatch(getPatientDetails(patientNo));
  }, [dispatch, patientNo]);

  const capitalizeWords = (name) =>
    name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  const patientName = patientDetails?.SearchName
    ? capitalizeWords(patientDetails.SearchName)
    : capitalizeWords(
        [
          patientDetails?.Surname,
          patientDetails?.FirstName,
          patientDetails?.MiddleName,
        ]
          .filter(Boolean)
          .join(" ")
      );

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "green";
      case "New":
        return "orange";
      case "Cancelled":
        return "red";
      case "Forwaded":
        return "blue";
      default:
        return "gray";
    }
  };

  return (
    <Row gutter={[16, 16]} style={{ margin: 0 }}>
      <Col xs={24} md={8}>
        <Card
          style={{
            padding: "10px 16px",
            background: "#e5e3e3",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            minHeight: "250px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "16px",
            }}
          >
            <Avatar icon={<UserOutlined />} size={48} />
            <div>
              <Typography.Title level={5} style={{ margin: 0 }}>
                {patientName}
              </Typography.Title>
              <Typography.Text style={{ color: "gray", fontSize: "12px" }}>
                DOB: {patientDetails?.DateOfBirth}
              </Typography.Text>
            </div>
          </div>
          <Typography.Title
            level={5}
            style={{ color: "#0F5689", marginBottom: "12px" }}
          >
            Patient Information
          </Typography.Title>
          <InfoRow label="Patient Number" value={patientDetails?.PatientNo} />
          <InfoRow label="Lab Observation Number" value={labObservationNo || labNo} />
          <InfoRow label="Age" value={`${patientDetails?.AgeinYears} Years`} />
          <InfoRow label="Gender" value={patientDetails?.Gender} />
        </Card>
      </Col>

      <Col xs={24} md={8}>
        <Card
          style={{
            padding: "10px 16px",
            background: "#e5e3e3",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            minHeight: "250px",
          }}
        >
          <Typography.Title
            level={5}
            style={{ color: "#0F5689", marginBottom: "12px" }}
          >
            Lab Information
          </Typography.Title>
          <InfoRow label="Laboratory Type" value={patientLabRecord?.LinkType} />
          <InfoRow label="Lab Test Date" value={patientLabRecord?.LaboratoryDate} />
          <InfoRow label="Lab Test Time" value={patientLabRecord?.LaboratoryTime} />
          <InfoRow label="Lab Request Area/Location" value={patientLabRecord?.Request_Area} />
          <InfoRow
            label="Lab Test Status"
            value={
              <span style={{ color: getStatusColor(patientLabRecord?.Status) }}>
                {patientLabRecord?.Status || "N/A"}
              </span>
            }
          />
        </Card>
      </Col>

      <Col xs={24} md={8}>
        <Card
          style={{
            padding: "10px 16px",
            background: "#e5e3e3",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            minHeight: "250px",
          }}
        >
          <Typography.Title
            level={5}
            style={{ color: "#0f5689", marginBottom: "12px" }}
          >
            Settlement Information
          </Typography.Title>
          <InfoRow label="Settlement Type" value={patientDetails?.PatientType} />
          <InfoRow label="Insurance" value={patientDetails?.SchemeName || "N/A"} />
          <InfoRow
            label="Patient Bill Balance"
            value={`KSH. ${patientDetails?.TotalBilled || "0.00"}`}
          />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginTop: "16px",
            }}
          >
            <Button
              type="primary"
              style={{ flex: "1 1 calc(50% - 5px)" }}
              onClick={() => handleMarkAsCompleted(labObservationNo)}
            >
              Mark as Completed
            </Button>
            <Button
              type="default"
              style={{ flex: "1 1 calc(50% - 5px)" }}
              onClick={() => handlePrintInvoice(patientDetails?.PatientId)}
            >
              Print Interim Invoice
            </Button>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

const InfoRow = ({ label, value }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "8px",
    }}
  >
    <Typography.Title
      level={5}
      style={{ fontSize: "14px", margin: 0, color: "black" }}
    >
      {label}
    </Typography.Title>
    <Typography.Text
      style={{
        fontSize: "14px",
        color: "gray",
        fontWeight: "bold",
      }}
    >
      {value || "N/A"}
    </Typography.Text>
  </div>
);

export default PatientCard