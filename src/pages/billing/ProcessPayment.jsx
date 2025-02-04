import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { postReceiptHeader } from "../../actions/Charges-Actions/postReceiptHeader";
import { getReceiptLines } from "../../actions/Charges-Actions/getReceiptLines";
import { getReceiptHeader } from "../../actions/Charges-Actions/getReceiptHeader";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const { Option } = Select;

const ProcessPayment = ({ visible, onClose, patientNo, amount }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [receiptNo, setReceiptNo] = useState("");
  const [payMode, setPayMode] = useState(""); // Track selected payment mode

  const { data: receiptLines } = useSelector((state) => state.getReceiptLines);
  const { data: receiptHeader } = useSelector(
    (state) => state.getReceiptHeaderLines
  );
  const { loading } = useSelector(
    (state) => state.postReceipt
  );
  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        receiptDate: moment(), // Set today's date
        amountReceived: "",
      });
    }
  }, [visible, form]);

  useEffect(() => {
    if (receiptNo) {
      dispatch(getReceiptLines(receiptNo));
      dispatch(getReceiptHeader(receiptNo));
    }
  }, [dispatch, receiptNo]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const formattedData = {
        myAction: receiptNo ? "edit" : "create",
        recId: receiptNo || "",
        patientNo: patientNo,
        receiptDate: values.receiptDate.format("YYYY-MM-DD"),
        depositDate: values.receiptDate?.format("YYYY-MM-DD") || null,
        payMode: values.payMode,
        amountReceived: parseFloat(values.amountReceived),
        coPay: values.coPay,
        ...(values.payMode === 7 && {
          transactionCode: values.transactionCode,
          phoneNumber: values.phoneNumber,
        }), // Include only if Mpesa is selected
      };

      const newReceiptNo = await dispatch(postReceiptHeader(formattedData));

      if (newReceiptNo) {
        setReceiptNo(newReceiptNo);
        await dispatch(getReceiptLines(newReceiptNo));
        await dispatch(getReceiptHeader(newReceiptNo));

        navigate(
          `/reception/Receipt/Patient?PatientNo=${patientNo}&ReceiptNo=${newReceiptNo}`,
          {
            state: {
              patientData: { header: receiptHeader, lines: receiptLines },
            },
          }
        );
        onClose();

      }
      form.resetFields();
    } catch (error) {
      console.error("Validation or processing failed:", error);
    }
  };

  return (
    <Modal
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>Generate Payment</span>
          <CloseOutlined
            onClick={onClose}
            style={{ marginRight: 10, fontSize: 16 }}
          />
        </div>
      }
      visible={visible}
      onCancel={onClose}
      style={{ top: 20 }}
      width={600}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ payMode: "", amountReceived: 0, coPay: true }}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Receipt Date"
              name="receiptDate"
              rules={[{ required: true, message: "Please select receipt date!" }]}

            >
              <DatePicker
                size="large"
                format="YYYY-MM-DD"
                style={{ width: "100%",color: "#0F5689 !important" }}
                disabled
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Payment Mode"
              name="payMode"
              rules={[{ required: true, message: "Please select payment mode!" }]}
            >
              <Select
                size="large"
                onChange={(value) => setPayMode(value)} // Track selected payment mode
                placeholder="select Payment option"
              >
                <Option value="" >--Select Payment Option--</Option>
                <Option value={7}>Mpesa</Option>
                <Option value={9}>PDQ</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Amount Received"
              name="amountReceived"
              rules={[{ required: true, message: "Please enter amount received!" }]}
            >
              <Input
                prefix="KSh"
                type="number"
                min={0}
                step="0.01"
                placeholder="Amount Received"
                size="large"
              />
            </Form.Item>
            <span className="text-success fw-bold fst-italic">
              Unpaid Amount = {amount}
            </span>
          </Col>
        </Row>

        {/* Conditional Fields for Mpesa */}
        {payMode === 7 && (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Transaction Code"
                  name="transactionCode"
                  // rules={[{ required: true, message: "Please enter transaction code!" }]}
                >
                  <Input placeholder="Enter Transaction Code" size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Phone Number"
                  name="phoneNumber"
                  // rules={[
                  //   { required: true, message: "Please enter phone number!" },
                  //   { pattern: /^[0-9]{10}$/, message: "Enter a valid 10-digit number!" },
                  // ]}
                >
                  <Input placeholder="Enter Phone Number" size="large" />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}

        <Row>
          <Col span={24}>
            <Button
              type="primary"
              size="large"
              style={{ width: "100%" }}
              loading={loading}
              onClick={handleOk}
            >
              Generate Receipt
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ProcessPayment;
