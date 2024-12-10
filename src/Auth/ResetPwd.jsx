import React, { useState } from "react";
import { Alert, Button, Card, Input, Modal } from "antd";
import logoLogin from "../assets/images/logoLogin.png";
import loginImg from "../assets/images/loginImg.jpg";
import { useDispatch } from "react-redux";
import { resetPassword } from "../actions/userActions";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPwd = () => {
  const [newPassword, setNewPassword] = useState(""); // New password state
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm password state
  const [otp, setOtp] = useState(""); // OTP state
  const [error, setError] = useState(""); // Error state
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const [loading, setLoading] = useState(false); // Loading state
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(true); // OTP modal visibility

  const dispatch = useDispatch();
  const navigate = useNavigate(); // For redirecting to login page
  const location = useLocation();
  const { staffNo } = location.state || {}; // Access staffNo

  // Handle OTP input change
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  // Handle OTP submission
  const handleOtpSubmit = () => {
    if (!otp) {
      setError("Please enter the OTP sent to your email.");
      return;
    }
    setError(""); // Clear error if successful
    setIsOtpModalVisible(false); // Close OTP modal
  };

  // Handle input change for new password
  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  // Handle input change for confirm password
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    if (!newPassword || !confirmPassword) {
      setError("Please fill in both fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(""); // Clear any previous error

    const data = {
      staffNo, // Staff number from location.state
      newPassword,
      confirmPassword,
      resetTokenCode: otp,
    };

    try {
      // Dispatch the action to reset password
      await dispatch(resetPassword(data));
      
      // Set success message
      setSuccessMessage("Password reset successful!");

      // Redirect to login page after success
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Redirect after 2 seconds to allow user to see success message
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* OTP Modal */}
      <Modal
        title="Enter OTP"
        visible={isOtpModalVisible}
        onOk={handleOtpSubmit}
        onCancel={() => setIsOtpModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsOtpModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOtpSubmit}>
            Submit
          </Button>,
        ]}
      >
        <p>Please enter the OTP sent to your email address.</p>
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closeText="Close"
            style={{ marginBottom: "1rem" }}
          />
        )}
        <Input
          placeholder="Enter OTP"
          value={otp}
          onChange={handleOtpChange}
          maxLength={6}
          style={{ fontSize: "16px", height: "48px" }} // Resized input
        />
      </Modal>

      {/* Reset Password Form */}
      <div
        className="d-flex justify-content-center align-items-center min-vh-100"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        <Card
          className="p-0"
          style={{
            maxWidth: "900px",
            width: "100%",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            borderRadius: "8px",
          }}
        >
          <div className="d-flex flex-row" style={{ width: "100%" }}>
            <div
              className="p-4"
              style={{
                flex: 1,
                maxWidth: "450px",
                minWidth: "300px",
              }}
            >
              <div className="text-center mb-3">
                <img
                  src={logoLogin}
                  alt="Logo"
                  style={{ width: "230px", height: "auto" }}
                />
              </div>

              <p
                className="text-center text-muted"
                style={{ fontStyle: "italic" }}
              >
                Enter your new password and confirm it to reset your password.
              </p>

              <form onSubmit={handleSubmit}>
                {error && (
                  <Alert
                    message={error}
                    type="error"
                    showIcon
                    closeText="Close"
                  />
                )}

                {successMessage && (
                  <Alert
                    message={successMessage}
                    type="success"
                    showIcon
                    closeText="Close"
                    style={{ marginBottom: "1rem" }}
                  />
                )}

                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">
                    New Password<span className="text-danger">*</span>
                  </label>
                  <Input.Password
                    size="large"
                    id="newPassword"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    required
                    placeholder="Enter your new password"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password<span className="text-danger">*</span>
                  </label>
                  <Input.Password
                    size="large"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                    placeholder="Confirm your new password"
                  />
                </div>

                <div className="my-3">
                  <Button
                    size="large"
                    htmlType="submit"
                    type="primary"
                    disabled={loading}
                    block
                  >
                    {loading ? "Resetting password..." : "Reset Password"}
                  </Button>
                </div>
              </form>
            </div>

            <div
              className="reset-pwd-image"
              style={{
                flex: 1,
                maxWidth: "450px",
                minWidth: "300px",
                padding: 0,
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <img
                src={loginImg}
                alt="Reset Password Illustration"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default ResetPwd;