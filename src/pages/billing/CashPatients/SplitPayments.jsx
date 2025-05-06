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
import { deleteReceiptSplitLine } from "../../../actions/Charges-Actions/deleteSplitLine";

const { Option } = Select;

const SplitPayments = ({
  open,
  onCancel,
  receiptNo,
  amount,
  activeVisitNo,
  patientNo
}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [selectedPaymentType, setSelectedPaymentType] = useState(null);
  const [amountError, setAmountError] = useState("");
const [deleteLoading, setDeleteLoading] = useState(false);
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
  
  const {
    loading: deleteSplitLineLoading,
    error :deleteSplitLineError,
    success: deleteSplitLineSuccess,
  } = useSelector((state) => state.deleteSplitLine);
 

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
  const handleDeleteSplitLine =async (record) => {
    const recID = record.SystemId; 
    const payload = {
      myAction: "delete",
      recId: recID,
      receiptNo: receiptNo,
      payMode: 0,
      bankAccountNo: "",
      transactionNo: record.TransactionNo || "N/A",
      amount: 0,
    };
    const status = await dispatch(deleteReceiptSplitLine(payload));
    if (status) {
      message.success("Payment deleted successfully", 10);
      dispatch(getSplitReceiptLines(receiptNo));
    } else {
      message.error("Failed to delete payment", 10);
    }
  };

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
    {
      title:"Action",
      key:"action",
      render:(_, record) => (
        <Button
          type="text"
          icon={<DeleteFilled />}
        onClick={() => handleDeleteSplitLine(record)}
          style={{ color: "red" }}
          danger
          loading={deleteSplitLineLoading}
        />
      )
    }
  ];

  const totalSplitAmount = data?.reduce(
    (acc, item) => acc + parseFloat(item.Amount || 0),
    0
  );
  const remainingAmount = parseFloat(amount) - totalSplitAmount;
  const lastReceipt = receiptHeader?.[receiptHeader.length - 1];
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
      message.error(error || "Failed to save payment", 10);
    }
  };
  const handleProcessReceipt = async () => {
    // if (!lastReceipt || receiptNo === "") {
    //   message.error(
    //     "The patient has no receipt to process. Kindly contact the administrator to have this issue resolved!",
    //     10
    //   );
    //   return;
    // }

    const payloads = data.map((data) => ({
      myAction: "edit",
      recId: lastReceipt?.SystemId,
      patientNo: patientNo || "",
      receiptDate: moment(lastReceipt?.Date_Posted).format("YYYY-MM-DD"),
      depositDate: moment(lastReceipt?.Document_Date).format("YYYY-MM-DD"),
      payMode: 0,
      amountReceived: 0,
      coPay: false,
      transactionCode: data.TransactionNo,
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
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
             
                  <Option value={7}>MPESA</Option>                
                  <Option value={9}>PDQ</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="amountReceived"
                label="Amount Received"
                rules={[
                  {
                    required: true,
                    message: "Please enter the amount received",
                  },
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
