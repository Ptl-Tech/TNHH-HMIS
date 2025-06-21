import { Form, Card, Select, Row, Col, Input, Button, message, Checkbox } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useLocation } from "react-router-dom";
import { postReceiptHeader } from "../../../actions/Charges-Actions/postReceiptHeader";
import { getReceiptLines } from "../../../actions/Charges-Actions/getReceiptLines";
import { getReceiptPage } from "../../../actions/Charges-Actions/getReceiptPage";

const PaymentSection = ({ patientNo }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const location = useLocation();
  const activeVisitNo = new URLSearchParams(location.search).get("PatientNo");

  const [paymentType, setPaymentType] = useState(null);
  const [paymentSavingLoading, setPaymentSavingLoading] = useState(false);
  const { loading: processReceiptLoading } = useSelector(
    (state) => state.savePayment
  );
  const { data: receiptLines } = useSelector((state) => state.getReceiptLines);
  const { data: receiptHeader } = useSelector((state) => state.getReceiptPage);

  const handleSavePayment = async (values) => {
    try {
      const payload = {
        myAction: "create",
        recId: "",
        patientNo,
        receiptDate: moment().format("YYYY-MM-DD"),
        depositDate: moment().format("YYYY-MM-DD"),
        payMode: values.payMode,
        transactionCode: values.transactionCode || "",
        splitAmount: false,
        amountReceived: parseFloat(values.amountReceived),
        isPartialPayment: values.isPartialPayment || false,
        coPay: false,
        ...(values.payMode === 7 && {
          phoneNumber: values.phoneNumber,
        }),
      };
      setPaymentSavingLoading(true)
      await dispatch(postReceiptHeader(payload));
      setPaymentSavingLoading(false)
      message.success("Payment saved successfully", 5);
      dispatch(getReceiptPage(activeVisitNo));
      form.resetFields();
    } catch (error) {
      setPaymentSavingLoading(false);
      message.error("Failed to save payment");

    }
  };

  const handleClear = () => {
    form.resetFields();
    setPaymentType(null); // Reset payment type selection
  };

  return (
    <Card title="Add Payment Option" style={{ padding: "10px 16px" }}>
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSavePayment}
        style={{ maxWidth: 600 }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="payMode"
              label="Payment Method"
              rules={[{ required: true, message: "Please select payment method" }]}
            >
              <Select
                placeholder="Choose payment method"
                allowClear
                showSearch
                onChange={(value) => setPaymentType(value)}
              >
                <Select.Option value={1}>Cash</Select.Option>
                <Select.Option value={2}>Cheque</Select.Option>
                <Select.Option value={3}>EFT</Select.Option>
                <Select.Option value={4}>Deposit Slip</Select.Option>
                <Select.Option value={5}>Banker's Cheque</Select.Option>
                <Select.Option value={6}>RTGS</Select.Option>
                <Select.Option value={7}>MPESA</Select.Option>
                <Select.Option value={8}>PayPal</Select.Option>
                <Select.Option value={9}>Cheque</Select.Option>
                <Select.Option value={10}>PDQ</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="amountReceived"
              label="Amount"
              rules={[{ required: true, message: "Enter amount" }]}
            >
              <Input type="number" placeholder="Ksh 0.00" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          {paymentType === 7 && (
            <Col span={12}>
              <Form.Item
                name="phoneNumber"
                label="Phone Number"

              >
                <Input type="tel" placeholder="Enter MPESA phone number" />
              </Form.Item>
            </Col>
          )}
          <Col span={12}>
            <Form.Item
              name="transactionCode"
              label="Reference Code"
              rules={[{ required: true, message: "Enter reference code" }]}
            >
              <Input placeholder="Enter ref. code" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="isPartialPayment"
              valuePropName="checked"
              style={{ marginTop: 16 }}
            >
              <Checkbox>Partial Payment</Checkbox>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={paymentSavingLoading}>
            Save Payment
          </Button>
          <Button
            type="default"
            onClick={handleClear}
            style={{ marginLeft: 8 }}
          >
            Clear
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default PaymentSection;
