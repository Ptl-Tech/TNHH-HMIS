import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Button, Card, Form, Input, message, Space } from "antd";

import loginImg from "../assets/images/loginImg.jpg";
import logoLogin from "../assets/images/logoLogin.png";

import { AUTH_RESET_MESSAGES } from "../reducers/auth/auth-reducer";

import { useAuth } from "../hooks/auth";
import { forgotPassword } from "../actions/auth-actions/forgot-password";

const ForgotPassword = () => {
  const {
    loading,
    redirect,
    forgotPasswordError: error,
    forgotPasswordSuccess: success,
  } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Alert the messages and then reset the values
    if (error) {
      message.error(error);
      dispatch({ type: AUTH_RESET_MESSAGES });
    }

    if (success) {
      message.success(success);
      dispatch({ type: AUTH_RESET_MESSAGES });
      navigate(redirect);
    }
  }, [error, success]);

  const handleSubmit = (values) => {
    const { staffNo } = values;
    dispatch(forgotPassword({ staffNo }));
  };

  const handleSubmitFailed = (values) => {
    const errors = values.errorFields[0].errors.join(", ");
    message.error(errors);
  };

  return (
    <div
      style={{ backgroundColor: "#f8f9fa" }}
      className="d-flex justify-content-center align-items-center min-vh-100"
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
        <div
          className="d-grid"
          style={{ width: "100%", gridTemplateColumns: "repeat(2, 1fr)" }}
        >
          {/* Left Side with Form */}
          <Space direction="vertical" className="p-4">
            <img src={logoLogin} alt="Logo Image" width={240} />
            <p style={{ color: "#888" }}>Use your username to request an OTP</p>
            <Form
              name="forgotPassword"
              layout="vertical"
              autoComplete="off"
              onFinish={handleSubmit}
              onFinishFailed={handleSubmitFailed}
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
              <Form.Item label={null}>
                <Button
                  block
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  disabled={loading}
                >
                  Send OTP
                </Button>
              </Form.Item>
            </Form>
          </Space>
          {/* Right Side with Image */}
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

export default ForgotPassword;
