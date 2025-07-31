import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Button, Card, Form, Input, message, Space } from "antd";

import loginImg from "../assets/images/loginImg.jpg";
import logoLogin from "../assets/images/logoLogin.png";

import { OTPModal } from "./OtpCard";

import { login } from "../actions/auth-actions/login";
import { AUTH_RESET_MESSAGES } from "../reducers/auth/auth-reducer";
import { getUserDetails } from "../actions/getUserDetails";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    loading,
    redirect,
    loginError,
    userDetails,
    showOTPModal,
    loginSuccess,
  } = useSelector((state) => state.auth);

  useEffect(() => {
    if (redirect === "/login") dispatch({ type: AUTH_RESET_MESSAGES });

    // An error message
    if (loginError) message.error(loginError);

    // A success message
    if (loginSuccess) {
      message.success(loginSuccess);
      if (userDetails?.otpVerified) {
        const role = userDetails?.role.toLowerCase();
        if (role) navigate(`/${role.charAt(0).toUpperCase() + role.slice(1)}`);
      }
      // Fetch me
      dispatch(getUserDetails());
    }

    if (loginError || loginSuccess) dispatch({ type: AUTH_RESET_MESSAGES });
  }, [loginSuccess, loginError, userDetails]);

  const onSubmit = (values) => {
    const { staffNo, password } = values;
    dispatch(login({ staffNo, password }));
  };

  const onSubmitFailed = (values) => {
    const errors = values.errorFields[0].errors.join(", ");
    message.error(errors);
  };

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
        <div
          className="d-grid"
          style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
        >
          {/* Left Side with Form */}
          <Space direction="vertical" className="p-4">
            <img src={logoLogin} alt="Logo Image" width={240} />
            <p style={{ color: "#888" }}>Sign in to access your account</p>
            <Form
              name="login"
              layout="vertical"
              autoComplete="off"
              onFinish={onSubmit}
              onFinishFailed={onSubmitFailed}
            >
              <Form.Item
                name="staffNo"
                label="Username"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input placeholder="JDOE" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password placeholder="********" />
              </Form.Item>
              <Form.Item label={null}>
                <Button
                  block
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  disabled={loading}
                >
                  Log In
                </Button>
              </Form.Item>
            </Form>
            <Link
              to="/forgot-password"
              style={{ color: "#aeaeae", textDecoration: "none" }}
            >
              Forgot your password?
            </Link>
          </Space>
          {/* Right Side with Image */}
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
      <OTPModal open={showOTPModal} />
    </div>
  );
};

export default Login;
