import React, { useState, useEffect } from "react";
import { Alert, Button, Card, Input } from "antd";
import logoLogin from "../assets/images/logoLogin.png";
import loginImg from "../assets/images/loginImg.jpg";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../actions/userActions";
import { useNavigate } from "react-router-dom";

const ForgotPwd = () => {
  const [staffNo, setStaffNo] = useState(""); // Staff Number
  const [error, setError] = useState(""); // Error state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const forgotPwdHandler = useSelector((state) => state.forgotPwd);
  const { loading: loadingForgotPwd, error: errorForgotPwd, success: successForgotPwd } = forgotPwdHandler;

  // Handle input change for staff number
  const handleInputChange = (e) => {
    setStaffNo(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!staffNo) {
      setError("Please enter your staff number.");
      return;
    }

    dispatch(forgotPassword(staffNo));
  };

  // Navigate to reset-pwd on success
  useEffect(() => {
    if (successForgotPwd) {
      navigate("/reset-password", { state: { staffNo } }); // Navigate to reset password page
    }
  }, [successForgotPwd, navigate, staffNo]);

  return (
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
          {/* Right Side with Form */}
          <div
            className="p-4"
            style={{
              flex: 1,
              maxWidth: "450px",
              minWidth: "300px",
            }}
          >
            {/* Logo above the Forgot Password message */}
            <div className="text-center mb-3">
              <img
                src={logoLogin}
                alt="Logo"
                style={{ width: "230px", height: "auto" }}
              />
            </div>

            <p className="text-center text-muted" style={{ fontStyle: "italic" }}>
              Enter your staff number to reset your password
            </p>

            <form onSubmit={handleSubmit}>
              {error && (
                <Alert message={error} type="error" showIcon closeText="Close" />
              )}
              {errorForgotPwd && (
                <Alert
                  message={errorForgotPwd}
                  type="error"
                  showIcon
                  closeText="Close"
                />
              )}

              <div className="mb-3">
                <label htmlFor="staffNo" className="form-label">
                  Staff Number<span className="text-danger">*</span>
                </label>
                <Input
                  size="large"
                  type="text"
                  name="staffNo"
                  id="staffNo"
                  value={staffNo}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your staff number"
                />
              </div>

              <div className="my-3">
                <Button
                  size="large"
                  htmlType="submit"
                  type="primary"
                  disabled={loadingForgotPwd}
                  block
                >
                  {loadingForgotPwd ? "Sending request..." : "Send Reset Link"}
                </Button>
              </div>
            </form>
          </div>

          {/* Left Side with Image */}
          <div
            className="forgot-pwd-image"
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
              alt="Forgot Password Illustration"
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
  );
};

export default ForgotPwd;
