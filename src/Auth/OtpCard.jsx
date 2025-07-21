import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button, Form, Input, message, Modal, Typography } from "antd";

import logoLogin from "../assets/images/logoLogin.png";

import {
  SHOW_OTP_MODAL,
  AUTH_RESET_MESSAGES,
} from "../reducers/auth/auth-reducer";
import { verifyOTP } from "../actions/auth-actions/verify-otp";

export const OTPModal = ({ open }) => {
  const { Title } = Typography;

  const dispatch = useDispatch();

  const {
    loading,
    OTPError: error,
    OTPSuccess: success,
  } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error) message.error(error);
    if (success) message.success(success);
    if (error || success) dispatch({ type: AUTH_RESET_MESSAGES });
  }, [error, success]);

  const onSubmit = (values) => {
    const { otpCode } = values;
    dispatch(verifyOTP({ otpCode }));
  };

  const onSubmitFailed = (values) => {
    const errors = values.errorFields[0].errors.join(", ");
    message.error(errors);
  };

  return (
    <Modal
      centered
      open={open}
      width={400}
      footer={null}
      title="Enter OTP"
      maskClosable={false}
      onCancel={() => dispatch({ type: SHOW_OTP_MODAL })}
    >
      <div
        style={{
          padding: "20px",
          textAlign: "center",
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
        <Form
          name="login"
          layout="vertical"
          autoComplete="off"
          onFinish={onSubmit}
          onFinishFailed={onSubmitFailed}
        >
          <Form.Item
            label="OTP"
            name="otpCode"
            rules={[{ required: true, message: "Please input your OTP!" }]}
          >
            <Input placeholder="******" />
          </Form.Item>
          <Form.Item label={null}>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={loading}
            >
              Submit OTP
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};
