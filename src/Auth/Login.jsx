import React, { useState, useEffect } from "react";
import { FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import useSignIn from "../hooks/useSignIn";
import { Alert, Button, Card, Input, Modal, Typography } from "antd";
import loginImg from "../assets/images/loginImg.jpg";
import logoLogin from "../assets/images/logoLogin.png";

const { Title } = Typography;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    staffNo,
    setStaffNo,
    password,
    setPassword,
    otp,
    setOtp,
    isOtpRequired,
    handleLogin,
    handleVerifyOtp,
    loading,
    error,
  } = useSignIn();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };
  // const handleLoginSuccess = () => {
  //   // Show OTP modal on successful login
  //   setIsOtpModalVisible(true);
  // };

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
          borderRadius: "8px", // Apply border-radius to the card
        }}
      >
        <div className="d-flex flex-row" style={{ width: "100%" }}>
          {/* Right Side with Form */}
          <div
            className="p-4"
            style={{
              flex: 1,
              maxWidth: "450px",
              minWidth: "300px", // Ensure it doesn't shrink too much
            }}
          >
            {/* Logo above the Welcome message */}
            <div className="text-center mb-3">
              <img
                src={logoLogin}
                alt="Logo"
                style={{ width: "230px", height: "auto" }} // Adjust the size as needed
              />
            </div>

            <p className="text-center text-muted" style={{ fontStyle: "italic" }}>
              Sign in to access your account
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin(); // Proceed with login action
             //   handleLoginSuccess(); // Trigger OTP modal on login success
              }}
            >
              {error && (
                <Alert message={error} type="error" showIcon closeText="Close" />
              )}

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email<span className="text-danger">*</span>
                </label>
                <Input
                  size="large"
                  id="staffNo"
                  value={staffNo}
                  onChange={(e) => setStaffNo(e.target.value)}
                  placeholder="Enter your Staff No"
                  required
                />
              </div>

              <div className="mb-3 text-start">
                <label htmlFor="password" className="form-label">
                  Password<span className="text-danger">*</span>
                </label>
                <Input
                  size="large"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  prefix={
                    <span
                      onClick={togglePasswordVisibility}
                      style={{ cursor: "pointer" }}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  }
                  placeholder="Enter your password"
                />
              </div>

              <div className="py-2 d-flex align-items-center">
                <input
                  className="form-check-input me-2"
                  type="checkbox"
                  id="flexCheckDefault"
                />
                <label
                  className="form-check-label text-muted"
                  htmlFor="flexCheckDefault"
                >
                  Remember me
                </label>
              </div>

              <div className="my-3">
                <Button size="large" htmlType="submit" type="primary" disabled={loading} block>
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>

            {/* Forgot Password Link */}
            <div className="text-center mt-3">
              <a href="/forgot-password" className="text-muted" style={{ fontSize: "14px" }}>
                Forgot password?
              </a>
            </div>
          </div>

          {/* Left Side with Image */}
          <div
            className="login-image"
            style={{
              flex: 1,
              maxWidth: "450px",
              minWidth: "300px", // Ensure it doesn't shrink too much
              padding: 0, // Remove any padding
              borderRadius: "8px", // Match the card's border-radius
              overflow: "hidden", // Ensure the image is contained within the rounded corners
            }}
          >
            <img
              src={loginImg}
              alt="Login Illustration"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "8px", // Match the card's border-radius
              }}
            />
          </div>
        </div>
      </Card>

      {/* OTP Modal */}
      <Modal
        title="Enter OTP"
        visible={isOtpRequired}
        onCancel={() => {}}
        footer={null}
        width={400}
      >
        <div
          style={{
            textAlign: "center",
            padding: "20px",
          }}
        >
          <img
            src={logoLogin}
            alt="Logo"
            style={{ width: "100px", marginBottom: "10px" }}
          />
          <Title level={5}>Enter OTP</Title>
          <p style={{ color: "#888" }}>
            We sent a 6-digit code to your email. Please enter it below.
          </p>

          <Input
  value={otp}
  onChange={(e) => setOtp(e.target.value)} // Ensure this correctly updates the OTP state
  placeholder="Enter OTP"
  maxLength={6}
  style={{
    textAlign: "center",
    width: "100%",
    maxWidth: "300px",
    marginBottom: "20px",
  }}
/>


          <Button
            type="primary"
            block
            onClick={handleVerifyOtp}
          >
            Submit
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Login;
