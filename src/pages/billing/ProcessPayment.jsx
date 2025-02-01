import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Checkbox,
  Row,
  Col,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { postReceiptHeader } from "../../actions/Charges-Actions/postReceiptHeader";
import { getReceiptLines } from "../../actions/Charges-Actions/getReceiptLines";
import { getReceiptHeader } from "../../actions/Charges-Actions/getReceiptHeader";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const ProcessPayment = ({ visible, onClose, patientNo, onPaymentComplete }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.postReceipt);
  const [receiptNo, setReceiptNo] = useState("");

  const { data: receiptLines } = useSelector((state) => state.getReceiptLines);
  const { data: receiptHeader } = useSelector((state) => state.getReceiptHeaderLines);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const formattedData = {
          myAction: receiptNo ? "edit" : "create",
          recId: receiptNo || "",
          patientNo: patientNo,
          receiptDate: values.receiptDate.format("YYYY-MM-DD"),
          depositDate: values.depositDate.format("YYYY-MM-DD"),
          payMode: values.payMode,
          amountReceived: parseFloat(values.amountReceived),
          coPay: values.coPay,
        };
  
        dispatch(postReceiptHeader(formattedData)).then((newReceiptNo) => {
          if (newReceiptNo) {
            setReceiptNo(newReceiptNo);
            dispatch(getReceiptLines(newReceiptNo));
            dispatch(getReceiptHeader(newReceiptNo));
            
            
          }
          // Reset form fields after success
          form.resetFields();
  
          // Close the modal
          onClose(); // Call onClose prop to close the modal
        });
      })
      .catch((info) => {
        console.error("Validate Failed:", info);
      });
  };
  
  useEffect(() => {
    if (receiptNo) {
      dispatch(getReceiptLines(receiptNo));
      dispatch(getReceiptHeader(receiptNo));
    }
  }, [dispatch, receiptNo]);

  const handleViewReceipt = () => {
    if (receiptHeader && receiptLines) {
      const combinedData = { header: receiptHeader, lines: receiptLines };
      navigate(`/reception/invoice/Patient?PatientNo=${patientNo}&ReceiptNo=${receiptNo}`, {
        state: { patientData: combinedData },
      });
      console.log("Receipt data:", combinedData);

    }
  };


  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>Generate Payment</span>
          <CloseOutlined onClick={onClose} style={{ marginRight: 10, fontSize: 16 }} />
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
        initialValues={{ payMode: 0, amountReceived: 0, coPay: true }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Receipt Date"
              name="receiptDate"
              rules={[{ required: true, message: "Please select receipt date!" }]}
              style={{ width: "100%" }}
            >
              <DatePicker size="large" format="YYYY-MM-DD" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Deposit Date"
              name="depositDate"
              rules={[{ required: true, message: "Please select deposit date!" }]}
              style={{ width: "100%" }}
            >
              <DatePicker size="large" format="YYYY-MM-DD" style={{ width: "100%" }} />
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
              <Select size="large">
                <Option value={1}>Cash</Option>
                <Option value={2}>Cheque</Option>
                <Option value={3}>EFT</Option>
                <Option value={4}>Deposit Slip</Option>
                <Option value={5}>Banker's Cheque</Option>
                <Option value={6}>RTGS</Option>
                <Option value={7}>Mpesa</Option>
                <Option value={8}>PayPal</Option>
                <Option value={9}>PDQ</Option>
                <Option value={10}>RFH</Option>
                <Option value={11}>Baraka Card</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Amount Received"
              name="amountReceived"
              rules={[{ required: true, message: "Please enter amount received!" }]}
            >
              <Input prefix="KSh" type="number" min={0} step="0.01" placeholder="Amount Received" size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="coPay" valuePropName="checked">
          <Checkbox>Co-Pay</Checkbox>
        </Form.Item>

        <Row>
          <Col span={24}>
            <Button
              type="primary"
              size="large"
              style={{ width: "100%" }}
              loading={!receiptNo && loading}
              onClick={handleOk}
            >
              Post Payment
            </Button>
          </Col>

          {receiptNo && (
            <Col span={24}>
              <Button
                type="default"
                size="large"
                style={{ width: "100%", marginTop: 10 }}
                onClick={handleViewReceipt}
              >
                View Receipt
              </Button>
            </Col>
          )}
        </Row>
      </Form>
    </Modal>
  );
};

export default ProcessPayment;
