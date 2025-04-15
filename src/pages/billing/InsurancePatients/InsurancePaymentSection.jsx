import {
  Form,
  Card,
  Select,
  Row,
  Col,
  Input,
  Button,
  Checkbox,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useLocation } from "react-router-dom";
import { postReceiptHeader } from "../../../actions/Charges-Actions/postReceiptHeader";
import { getReceiptLines } from "../../../actions/Charges-Actions/getReceiptLines";
import { getSinglePatientBill } from "../../../actions/Charges-Actions/getSinglePatientBill";

const InsurancePaymentSection = ({ patientNo }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const location = useLocation();
  const activeVisitNo = new URLSearchParams(location.search).get("PatientNo");

  const [paymentType, setPaymentType] = useState(null);
  const [saveloading, setsaveloading] = useState(false);

  const { loading: processReceiptLoading } = useSelector(
    (state) => state.savePayment
  );
  const { loading: receiptLinesLoading } = useSelector(
    (state) => state.getReceiptLines
  );
  const { data: patientBillData } = useSelector((state) => state.getSingleBill);

  useEffect(() => {
    if (activeVisitNo) {
      dispatch(getSinglePatientBill(activeVisitNo));
    }
  }, [dispatch, activeVisitNo]);

  const handlePaymentTypeChange = (value) => {
    setPaymentType(value);
  };

  const handleSavePayment = async (values) => {
    const {
      payMode,
      transactionCode,
      amountReceived,
      isPartialPayment,
      coPay,
      phoneNumber,
    } = values;

    const payload = {
      myAction: "create",
      recId: "",
      patientNo,
      receiptDate: moment().format("YYYY-MM-DD"),
      depositDate: moment().format("YYYY-MM-DD"),
      payMode,
      transactionCode: transactionCode || "",
      splitAmount: false,
      amountReceived: parseFloat(Number(amountReceived).toFixed(2)),
      isPartialPayment: isPartialPayment || false,
      coPay: coPay || false,
      ...(payMode === 7
        ? {
            transactionCode,
            phoneNumber,
          }
        : {}),
    };

    setsaveloading(true);
    const receiptNo = await dispatch(postReceiptHeader(payload));
    setsaveloading(false);
    if (receiptNo) {
      message.success(`Payment saved successfully.`, 5);
      setPaymentType(null);
      dispatch(getReceiptLines(activeVisitNo));
    } else {
      setsaveloading(false);
      message.error("Failed to save the payment. Please try again.");
    }
  };

  // New handleClear function to reset the form fields when the Clear button is clicked
  const handleClear = () => {
    form.resetFields(); // This will clear all fields in the form
    setPaymentType(null); // Reset payment type
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
              rules={[
                { required: true, message: "Please select payment method" },
              ]}
            >
              <Select
                placeholder="Choose payment method"
                allowClear
                showSearch
                onChange={handlePaymentTypeChange}
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

        {paymentType === 7 && (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phoneNumber"
                label="Phone Number"
                rules={[
                  {
                    required: true,
                    message: "Phone number is required for MPESA",
                  },
                  {
                    pattern: /^07\d{8}$/,
                    message: "Enter a valid Kenyan phone (e.g. 0712345678)",
                  },
                ]}
              >
                <Input placeholder="0712345678" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="transactionCode"
                label="Transaction Code"
                rules={[{ required: true, message: "Enter transaction code" }]}
              >
                <Input placeholder="MPESA Code" />
              </Form.Item>
            </Col>
          </Row>
        )}

        <Row gutter={16}>
          <Col span={24}>
            {patientBillData[0]?.CurrentAdmNo ? (
              <Form.Item
                name="isPartialPayment"
                valuePropName="checked"
                style={{ marginTop: 16 }}
              >
                <Checkbox>Partial Payment</Checkbox>
              </Form.Item>
            ) : (
              <Form.Item
                name="coPay"
                valuePropName="checked"
                style={{ marginTop: 16 }}
              >
                <Checkbox>Co-Pay</Checkbox>
              </Form.Item>
            )}
          </Col>
        </Row>

        <Button type="primary" htmlType="submit" loading={saveloading}>
          Submit Payment
        </Button>
        <Button
          onClick={handleClear} // Clear button will only reset the fields
          style={{ marginLeft: 8 }}
        >
          Clear
        </Button>
      </Form>
    </Card>
  );
};

export default InsurancePaymentSection;
