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
import { getReceiptPage } from "../../../actions/Charges-Actions/getReceiptPage";
import { postReceipt } from "../../../actions/Charges-Actions/postReceipt";
import { getPatientCharges } from "../../../actions/Charges-Actions/getPatientCharges";

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

  const { loading: postReceiptLoading } = useSelector(
    (state) => state.processReceipt);
  const { loading: receiptLinesLoading } = useSelector(
    (state) => state.getReceiptLines
  );
  const { data: receiptHeader } = useSelector((state) => state.getReceiptPage);

  const { data: patientBillData } = useSelector((state) => state.getSingleBill);
  const { loading, error, data } = useSelector(
    (state) => state.getPatientCharges
  );

//  console.log("patientBillData", patientBillData);
  useEffect(() => {
    if (activeVisitNo) {
      dispatch(getSinglePatientBill(activeVisitNo));
      dispatch(getReceiptPage(activeVisitNo));
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
          phoneNumber,
        }
        : {}),
    };

    setsaveloading(true);
    const receiptNo = await dispatch(postReceiptHeader(payload));
    setsaveloading(false);
    getReceiptPage(activeVisitNo);
    if (receiptNo) {
      message.success(`Payment saved successfully.`, 5);
      setPaymentType(null);
      dispatch(getReceiptPage(activeVisitNo));

    } else {
      setsaveloading(false);
      message.error("Failed to save the payment. Please try again.");
    }
  };
  const handleReceiptPost = async () => {
    if (!Array.isArray(receiptHeader) || receiptHeader.length === 0) {
      return;
    }

    const lastReceipt = receiptHeader[receiptHeader.length - 1];
    const payload = {
      recId: lastReceipt.SystemId,
      patientNo: patientNo,
      receiptNo: lastReceipt.No
    };

    try {
      const status = await dispatch(postReceipt(payload));
      if (status) {
        message.success("Receipt posted successfully.");
        dispatch(getReceiptLines(activeVisitNo));
        dispatch(getSinglePatientBill(activeVisitNo));
        getPatientCharges(activeVisitNo);
              dispatch(getReceiptPage(activeVisitNo));

      }
    } catch (error) {
      message.error("Failed to post receipt. Please try again.");
    }
  };
  // New handleClear function to reset the form fields when the Clear button is clicked
  const handleClear = () => {
    form.resetFields(); // This will clear all fields in the form
    setPaymentType(null); // Reset payment type
  };
  console.log("patientBillData", patientBillData);
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
                filterOption={(input, option) =>
                  option.children
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                optionFilterProp="children"
              >
                <Select.Option value={2}>Cheque </Select.Option>
                <Select.Option value={3}>EFT</Select.Option>
                <Select.Option value={6}>Rtgs</Select.Option>


                <Select.Option value={7}>MPESA</Select.Option>

                <Select.Option value={9}>PDQ</Select.Option>
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
                rules={[
                  {
                    required: true,
                    message: "Phone number is required for MPESA",
                  },
                  // {
                  //   pattern: /^07\d{8}$/,
                  //   message: "Enter a valid Kenyan phone (e.g. 0712345678)",
                  // },
                ]}
              >
                <Input placeholder="0712345678" />
              </Form.Item>
            </Col>
          )}

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

        <Row gutter={16}>
          <Col span={24}>
            {patientBillData[0]?.PatientType !== "Cash" ? (
              <Form.Item
                name="coPay"
                valuePropName="checked"
                style={{ marginTop: 16 }}
              >
                <Checkbox>Co-Pay</Checkbox>
              </Form.Item>
            ) : (
              <Form.Item
                name="isPartialPayment"
                valuePropName="checked"
                style={{ marginTop: 16 }}
              >
                <Checkbox>Partial Payment</Checkbox>
              </Form.Item>
            )}
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Button
              type="primary"
              htmlType="submit"
              loading={saveloading}
              disabled={saveloading }
            >
              Save Payment
            </Button>
          </Col>
          <Col span={12}>

            <Button
              onClick={handleClear}
              type="default"
              style={{ marginLeft: 8, color: '#0f5689' }}
              danger
            >
              Clear
            </Button>
          </Col>
        </Row>

        {
          patientBillData[0].PatientType !== "Cash" &&
          receiptHeader &&
          receiptHeader.length > 0 && (
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={24}>
                <Button
                  type="primary"
                  onClick={handleReceiptPost}
                 loading={postReceiptLoading}
                 disabled={postReceiptLoading}
                >
                  Post Receipt
                </Button>
              </Col>
            </Row>
          )}

      </Form>
    </Card>
  );
};

export default InsurancePaymentSection;
