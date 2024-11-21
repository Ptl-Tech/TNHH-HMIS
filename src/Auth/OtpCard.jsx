import React from "react";
import { Card, Input, Typography, Button } from "antd";

const { Title } = Typography;

const OtpCard = () => {
  const sharedProps = {
    maxLength: 6, // Ensures only 6 characters for OTP
    style: { textAlign: "center", width: "100%", maxWidth: "300px" },
  };

  const handleOtpSubmit = () => {
    alert("OTP submitted successfully!");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
        padding: "20px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Logo Section */}
        <div style={{ marginBottom: "20px" }}>
          <img
            src="https://via.placeholder.com/100"
            alt="Logo"
            style={{ width: "100px", marginBottom: "10px" }}
          />
          <Title level={4} style={{ margin: 0 }}>
            Enter OTP
          </Title>
          <p style={{ color: "#888" }}>
            We sent a 6-digit code to your email. Please enter it below.
          </p>
        </div>

        {/* OTP Input Section */}
        <div style={{ marginBottom: "20px" }}>
          <Input.OTP
            formatter={(str) => str.toUpperCase()}
            placeholder="Enter OTP"
            {...sharedProps}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="primary"
          onClick={handleOtpSubmit}
          block
          style={{ fontWeight: "bold" }}
        >
          Submit
        </Button>
      </Card>
    </div>
  );
};

export default OtpCard;
