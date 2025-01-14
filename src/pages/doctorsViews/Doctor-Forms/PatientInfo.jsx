import React, { useEffect } from "react";
import { Card, Typography, Avatar, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { UserOutlined } from "@ant-design/icons";
import { getPatientDetails } from "../../../actions/Doc-actions/OutPatientAction";
import useAuth from "../../../hooks/useAuth";
import { postInterimInvoice } from "../../../actions/Charges-Actions/printInterimInvoice";


const PatientInfo = ({ patientNo , treatmentNo, patientDetails, observationNo, role }) => {
  const dispatch = useDispatch();
  const staffNo = useAuth().userData.No;


  const { loading: invoiceProcessingLoading, error: invoiceProcessingError } =
    useSelector((state) => state.postInterimInvoice);

    const capitalizeWords = (name) =>
      name
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
  
    const patientName = patientDetails?.Names
      ? capitalizeWords(patientDetails.Names)
      : capitalizeWords(
          [
            patientDetails?.Surname,
            patientDetails?.LastName,
            patientDetails?.MiddleName,
          ]
            .filter(Boolean)
            .join(" ")
        );
  const handlePrintInvoice = () => {
    const invoiceData = {
      PatientNo: patientNo,
      visitNo: treatmentNo,
      staffNo,
    };

    dispatch(postInterimInvoice(invoiceData));
  };
  return (
    <div
      style={{
        display: "flex",
        alignContent: "center",
        gap: "20px",
        paddingBottom: "20px",
      }}
    >
      <Card
        className="card col-md-6 col-lg-6 col-xl-6"
        style={{
          padding: "10px 16px",
          marginTop: "10px",
          background: "#e5e3e3",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <Avatar icon={<UserOutlined />} size={48} />
          <div>
            <Typography.Title
              level={5}
              style={{ margin: 0, fontSize: "16px", color: "#0F5689" }}
            >
              {patientName}
            </Typography.Title>
            <Typography.Text style={{ fontSize: "13px", color: "gray" }}>
              DOB: {patientDetails?.DateOfBirth}
            </Typography.Text>
          </div>
        </div>

        <Typography.Title
          level={5}
          style={{
            color: "#0F5689",
            fontSize: "16px",
            marginBottom: "12px",
          }}
        >
          Additional Information
        </Typography.Title>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <InfoRow label="Patient Number" value={patientDetails?.PatientNo} />
          <InfoRow label="Treatment Number" value={treatmentNo} />
          {/* <InfoRow label="Age" value={`${patientDetails?.AgeinYears} Years`} /> */}
          <InfoRow label="Gender" value={patientDetails?.Gender} />
        </div>
      </Card>
      <Card
        className="card col-md-6 col-lg-6 col-xl-6"
        style={{
          padding: "10px 16px",
          marginTop: "10px",
          background: "#e5e3e3",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
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
          Settlement Information
        </Typography.Title>
        <div
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
            Settlement Type
          </Typography.Title>

          <Typography.Text
            style={{
              fontSize: "12px",
              color: "gray",
              fontWeight: "bold",
            }}
          >
            {patientDetails?.PatientType}
          </Typography.Text>
        </div>
        <div
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
            Insurance
          </Typography.Title>
          <Typography.Text
            style={{
              fontSize: "12px",
              color: "gray",
              fontWeight: "bold",
            }}
          >
            {patientDetails?.SchemeName || "N/A"}
          </Typography.Text>
        </div>
        <div
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
            Patient Bill Balance:
          </Typography.Title>
          <Typography.Text
            style={{
              fontSize: "16px",
              color: "#0f5689",
              fontWeight: "bold",
            }}
          >
            {` KSH. ${patientDetails?.Balance} `}
          </Typography.Text>
        </div>
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: "40px",
          }}
        >
          {
            role === 'Doctor' && (
                <div className="d-block gap-4 d-md-flex justify-content-center align-items-center w-100">
                    <Button
                    type="primary"
                    onClick={() => handleMarkAsCompleted(observationNo)}
                    style={{ width: "100%", marginBottom: "10px" }}
                    >
                    Mark as Completed
                    </Button>
                    <Button
                    type="default"
                    onClick={() => handleTransferPatient(observationNo)}
                    style={{ width: "100%" }}
                    >
                    Request Patient Review
                    </Button>
                    {/* <Button
                    type="primary"
                    // style={{ marginTop: "10px", width: "100%" }}
                    onClick={() => handlePrintInvoice(patientDetails?.PatientId)}
                    >
                    Print Interim Invoice
                    </Button> */}
                </div>
            )
          }
          
        </div>
      </Card>
    </div>
  );
};

// Helper component for displaying label and value pairs
const InfoRow = ({ label, value }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
    }}
  >
    <Typography.Title
      level={5}
      style={{ fontSize: "14px", color: "black", margin: 0 }}
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

export default PatientInfo;
