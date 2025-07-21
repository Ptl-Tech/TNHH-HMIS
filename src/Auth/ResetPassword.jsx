import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { Button, Card, Form, Input, message, Space } from "antd";

import loginImg from "../assets/images/loginImg.jpg";
import logoLogin from "../assets/images/logoLogin.png";

import { AUTH_RESET_MESSAGES } from "../reducers/auth/auth-reducer";
import { resetPassword } from "../actions/auth-actions/reset-password";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // For redirecting to login page

  const {
    loading,
    redirect,
    resetPasswordError: error,
    resetPasswordSuccess: success,
  } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log({ error });
    if (redirect === "/reset-password") {
      dispatch({ type: AUTH_RESET_MESSAGES });
    }
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
    const { newPassword, confirmPassword, resetTokenCode } = values;
    dispatch(resetPassword({ newPassword, confirmPassword, resetTokenCode }));
  };

  const handleSubmitFailed = () => {
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
          width: "100%",
          maxWidth: "900px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        }}
      >
        <div
          className="d-grid"
          style={{ width: "100%", gridTemplateColumns: "repeat(2, 1fr)" }}
        >
          <Space direction="vertical" className="p-4">
            <img src={logoLogin} alt="Logo Image" width={240} />
            <p style={{ color: "#888" }}>
              Use the code sent to you to change your password
            </p>
            <Form
              name="resetPassword"
              layout="vertical"
              autoComplete="off"
              onFinish={handleSubmit}
              onFinishFailed={handleSubmitFailed}
            >
              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[
                  {
                    required: true,
                    message: "Please input your new password!",
                  },
                ]}
              >
                <Input.Password placeholder="********" />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                label="Confirm New Password"
                rules={[
                  {
                    required: true,
                    message: "Please confirm your new password!",
                  },
                ]}
              >
                <Input.Password placeholder="********" />
              </Form.Item>
              <Form.Item
                name="resetTokenCode"
                label="Reset Token Code"
                rules={[
                  {
                    required: true,
                    message: "Please input the code sent to your email!",
                  },
                ]}
              >
                <Input placeholder="123456" />
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
            <Link
              to="/login"
              style={{ color: "#aeaeae", textDecoration: "none" }}
            >
              Back to login
            </Link>
          </Space>
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
  );
};

export default ResetPassword;
