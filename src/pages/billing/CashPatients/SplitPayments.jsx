import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Table,
} from "antd";
import { DeleteFilled } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getSplitReceiptLines } from "../../../actions/Charges-Actions/getSplitReceiptLines";
import { postReceiptSplitLine } from "../../../actions/Charges-Actions/postReceiptSplitLine";
import { getReceiptPage } from "../../../actions/Charges-Actions/getReceiptPage";
import { postReceiptHeader } from "../../../actions/Charges-Actions/postReceiptHeader";
import { getReceiptLines } from "../../../actions/Charges-Actions/getReceiptLines";
import moment from "moment";

const { Option } = Select;

const SplitPayments = ({
  open,
  onCancel,
  receiptNo,
  amount,
  activeVisitNo,
}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [selectedPaymentType, setSelectedPaymentType] = useState(null);
  const [amountError, setAmountError] = useState("");

  const { data: receiptHeader } = useSelector((state) => state.getReceiptPage);
  const { loading: receiptLinesLoading, data: receiptLines } = useSelector(
    (state) => state.getReceiptLines
  );
  const { data, loading: splitLinesLoading } = useSelector(
    (state) => state.getQyReceiptSplitList
  );
  const {
    loading: postReceiptLinesLoading,
    error,
    success,
  } = useSelector((state) => state.postSplitReceipt);
  useEffect(() => {
    if (open) {
      form.resetFields();
      setAmountError("");
      setSelectedPaymentType(null);
    }
  }, [open, form]);

  useEffect(() => {
    if (receiptNo) {
      dispatch(getSplitReceiptLines(receiptNo));
    }
  }, [dispatch, receiptNo]);

  useEffect(() => {
    if (activeVisitNo) {
      dispatch(getReceiptPage(activeVisitNo));
    }
  }, [dispatch, activeVisitNo]);

  const columns = [
    { title: "Receipt No.", dataIndex: "ReceiptNo", key: "ReceiptNo" },

    { title: "Payment Mode", dataIndex: "PayMode", key: "PayMode" },
    {
      title: "Transaction Code",
      dataIndex: "TransactionNo",
      key: "TransactionNo",
    },
    {
      title: "Amount Paid",
      dataIndex: "Amount",
      key: "Amount",
      render: (value) => `Ksh ${value.toFixed(2)}`,
    },
  ];

  const totalSplitAmount = data?.reduce(
    (acc, item) => acc + parseFloat(item.Amount || 0),
    0
  );
  const remainingAmount = parseFloat(amount) - totalSplitAmount;
  const lastReceipt = receiptHeader?.[receiptHeader.length - 1];
  console.log("last receipt", lastReceipt);
  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const val = parseFloat(values.amountReceived);
      if (val > remainingAmount) {
        setAmountError(
          `Entered amount exceeds remaining balance. Max allowed: KSh ${remainingAmount.toFixed(
            2
          )}.`
        );
        return;
      }

      const payload = {
        myAction: "create",
        recId: "",
        receiptNo: receiptNo,
        payMode: values.payMode,
        bankAccountNo: "",
        transactionNo: values.transactionCode || "N/A",
        amount: val,
      };

      const status = await dispatch(postReceiptSplitLine(payload));
      if (status === "success") {
        message.success("Payment saved successfully", 10);
        dispatch(getSplitReceiptLines(receiptNo));
      }

      form.resetFields();
      setAmountError("");
    } catch (errorInfo) {
      console.log("Validation Failed:", errorInfo);
      message.error(error || "Failed to save payment", 10);
    }
  };
  const handleProcessReceipt = async () => {
    if (!lastReceipt || lastReceipt.length === 0) {
      message.error(
        "The patient has no receipt to process. Kindly contact the administrator to have this issue resolved!",
        10
      );
      return;
    }

    const payloads = data.map((data) => ({
      myAction: "edit",
      recId: lastReceipt?.SystemId,
      patientNo: lastReceipt?.Patient_No,
      receiptDate: moment(lastReceipt?.Date_Posted).format("YYYY-MM-DD"),
      depositDate: moment(lastReceipt?.Document_Date).format("YYYY-MM-DD"),
      payMode: 0,
      amountReceived: 0,
      coPay: false,
      transactionCode: "",
      splitAmount: true,
      isPartialPayment: false,
    }));

    for (let payload of payloads) {
      const status = await dispatch(postReceiptHeader(payload));
      if (status === "success") {
        message.success("Receipt record posted successfully");
      } else {
        message.error("Failed to post receipt record");
      }
    }

    // Refresh after all posts
    dispatch(getReceiptLines(activeVisitNo));
  };

  return (
    <Modal
      title="Split Payments"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={850}
      style={{ top: 5 }}
    >
      <div style={{ marginBottom: ".5rem" }}>
        <p>
          <strong>Expected Amount:</strong> KSh {parseFloat(amount).toFixed(2)}
        </p>
        <p>
          <strong>Total Paid:</strong> KSh {totalSplitAmount.toFixed(2)}
        </p>
        <p>
          <strong>Remaining Balance:</strong>{" "}
          <span style={{ color: remainingAmount > 0 ? "red" : "green" }}>
            KSh {remainingAmount.toFixed(2)}
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-4 p-2">
        <p>Choose how you want to split the payments.</p>
        <Form form={form} layout="vertical">
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
                  onChange={(value) => setSelectedPaymentType(value)}
                >
                  <Option value={1}>Cash</Option>
                  <Option value={2}>Cheque</Option>
                  <Option value={3}>EFT</Option>
                  <Option value={4}>Deposit Slip</Option>
                  <Option value={5}>Banker's Cheque</Option>
                  <Option value={6}>RTGS</Option>
                  <Option value={7}>MPESA</Option>
                  <Option value={8}>PayPal</Option>
                  <Option value={9}>Cheque</Option>
                  <Option value={10}>PDQ</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
  <Form.Item
    name="amountReceived"
    label="Amount Received"
    rules={[
      { required: true, message: "Please enter the amount received" },
      {
        pattern: /^[0-9]*(\.[0-9]{1,2})?$/,
        message: "Enter a valid amount",
      },
    ]}
  >
    <Input type="number" placeholder="Enter amount" />
  </Form.Item>
  {amountError && <div style={{ color: "red" }}>{amountError}</div>}
</Col>

          </Row>

          {selectedPaymentType === 7 && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="transactionCode"
                  label="Reference Code"
                  rules={[{ required: true, message: "Enter reference code" }]}
                >
                  <Input placeholder="Enter reference code" />
                </Form.Item>
              </Col>
            </Row>
          )}

          <div className="d-flex justify-content-end gap-2">
            <Form.Item>
              <Button
                type="primary"
                onClick={handleSave}
                loading={postReceiptLinesLoading}
                block
              >
                Save
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type="dashed"
                onClick={handleProcessReceipt}
                loading={postReceiptLinesLoading}
                block
              >
                Process Payment
              </Button>
            </Form.Item>
          </div>
        </Form>

        <Table
          size="small"
          dataSource={data}
          loading={splitLinesLoading}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "30", "40", "50"],
          }}
          columns={columns}
        />
      </div>
    </Modal>
  );
};

export default SplitPayments;
