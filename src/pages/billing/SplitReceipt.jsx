import {
  Button,
  Drawer,
  Form,
  Input,
  Select,
  Space,
  Typography,
  Table,
  notification,
} from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { SaveOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getSplitReceiptLines } from "../../actions/Charges-Actions/getSplitReceiptLines";
import { postReceiptSplitLine } from "../../actions/Charges-Actions/postReceiptSplitLine";
import { postReceiptHeader } from "../../actions/Charges-Actions/postReceiptHeader";
import { getReceiptHeader } from "../../actions/Charges-Actions/getReceiptHeader";
import { getReceiptPage } from "../../actions/Charges-Actions/getReceiptPage";

const { Option } = Select;
const { Text } = Typography;

const SplitReceipt = ({ open, onClose, size, visitNo, amount}) => {
  const dispatch = useDispatch();
  const { data, loading: receiptLinesLoading } = useSelector(
    (state) => state.getQyReceiptSplitList
  );
  const { loading: postReceiptLinesLoading } = useSelector(
    (state) => state.postSplitReceipt
  );
    const { data: receiptHeader } = useSelector((state) => state.getReceiptPage);
    const lastReceipt = receiptHeader?.[receiptHeader.length - 1]; // Get the last record

    const receiptNo =  lastReceipt?.No;
  const { loading } = useSelector((state) => state.postReceipt);
  const [form] = Form.useForm();
  const [records, setRecords] = useState([]);

  const grandTotal = amount || 0;
  const totalAccumulative = records.reduce(
    (sum, record) => sum + parseFloat(record.amountPaid || 0),
    0
  );

  useEffect(() => {
    if (visitNo) {
      dispatch(getReceiptPage(visitNo));
    }
  }, [dispatch, visitNo]);

  useEffect(() => {
    if (receiptNo) {
      dispatch(getSplitReceiptLines(receiptNo));
    }
  }, [dispatch, receiptNo]);

  useEffect(() => {
    if (data) {
      setRecords(
        data.map((item, index) => ({
          key: item.SystemId || index, // Ensure each row has a unique key
          paymentMode: item.PayMode,
          transactionCode: item.TransactionNo,
          amountPaid: item.Amount,
        }))
      );
    }
  }, [data]);
  const handleAdd = async (values) => {
    const newAmount = parseFloat(values.amountPaid || 0);
    const newTotal = totalAccumulative + newAmount;
  
    if (newTotal > grandTotal) {
      notification.error({
        message: "Exceeds not Allowed Amount",
        description: `The total split amount cannot exceed the grand total of Ksh ${grandTotal}.`,
        duration: 5,
      });
      return;
    }
  
    const SplitLinesReceipt = {
      myAction: "create",
      recId: "",
      receiptNo: receiptNo,
      payMode: values.paymentMode,
      bankAccountNo: "",
      transactionNo: values.transactionCode,
      amount: newAmount,
    };
  
    try {
      const status = await dispatch(postReceiptSplitLine(SplitLinesReceipt));
  
      if (status === "success") {
        notification.success({
          message: "Split line added successfully",
          duration: 5,
        });
  
        form.resetFields();
        dispatch(getSplitReceiptLines(receiptNo)); // Refresh table
      }
    } catch (error) {
      console.error("Error posting split line:", error);
      notification.error({
        message: "Failed to add split line",
        description: error.message || "An unexpected error occurred.",
        duration: 5,
      });
    }
  };
  
  const handleSubmit = async () => {
    if (!receiptHeader || receiptHeader.length === 0) {
      notification.error({
        message: "Error",
        description: "Receipt header data is missing.",
      });
      return;
    }
  
    if (records.length === 0) {
      notification.error({
        message: "Error",
        description: "No split payment records available.",
      });
      return;
    }

    const documentDate = lastReceipt?.Document_Date
      ? new Date(lastReceipt?.Document_Date).toISOString().split("T")[0]
      : null;
  
    const depositDate = lastReceipt?.Date_Posted
      ? new Date(lastReceipt?.Date_Posted).toISOString().split("T")[0]
      : null;
  
    // Define the mapping of payment modes
    const paymentModes = {
      "Cash": 1,
      "Cheque": 2,
      "EFT": 3,
      "Deposit Slip": 4,
      "Banker's Cheque": 5,
      "RTGS": 6,
      "MPESA": 7,
      "PayPal": 8,
      "PDQ": 9,
      "RFH Baraka Card": 10,
    };
  
    // Prepare an array of formatted data for each split record
    const formattedData = records.map((record) => ({
      myAction: "edit",
      recId:  lastReceipt?.SystemId,
      patientNo: lastReceipt?.Patient_No,
      receiptDate: documentDate,
      depositDate: depositDate,
      payMode:0,  
      amountReceived: 0,
      coPay: false,
      transactionCode: "",
      splitAmount: true,
    }));
  
    console.log("Formatted data:", formattedData);
    try {
      await Promise.all(formattedData.map((data) => dispatch(postReceiptHeader(data))));
      notification.success({
        message: "Receipt split successfully updated",
        duration: 5,
      });
    } catch (error) {
      console.error("Error updating receipt split:", error);
      notification.error({
        message: "Failed to update receipt split",
        description: error.message || "An unexpected error occurred.",
        duration: 5,
      });
    }
  };
  ;

  

  const handleRemove = (key) => {
    setRecords(records.filter((item) => item.key !== key));
  };

  const columns = [
    { title: "Payment Mode", dataIndex: "paymentMode", key: "paymentMode" },
    {
      title: "Transaction Code",
      dataIndex: "transactionCode",
      key: "transactionCode",
    },
    { title: "Amount Paid", dataIndex: "amountPaid", key: "amountPaid", render: (value) => `Ksh ${value.toFixed(2)}` }, //to  2 decimal places and ksh
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, record) => (
    //     <Button
    //       danger
    //       size="small"
    //       icon={<DeleteOutlined />}
    //       onClick={() => handleRemove(record.key)}
    //     />
    //   ),
    // },
  ];

  return (
    <Drawer
      title="Split Receipt"
      placement="right"
      size={size}
      onClose={onClose}
      open={open}
      closable={false}
      maskClosable={false}
      extra={<Button onClick={onClose}>Cancel</Button>}
      footer={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 16px",
          }}
        >
          <div>
            <Text strong>Grand Total Expected: </Text>
            <Text type="secondary">Ksh {grandTotal}</Text>
          </div>
          <div>
            <Text strong>Total Accumulative: </Text>
             <Text type="secondary">Ksh {totalAccumulative}</Text> 
          </div>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" onFinish={handleAdd}>
        <Form.Item
          label="Payment Mode"
          name="paymentMode"
          rules={[{ required: true, message: "Please select a payment mode!" }]}
        >
          <Select size="large" placeholder="Select payment mode">
            <Option value="1">Cash</Option>
            <Option value="2">Cheque</Option>
            <Option value="3">EFT</Option>
            <Option value="4">Deposit Slip</Option>
            <Option value="5">Banker's Cheque</Option>
            <Option value="6">RTGS</Option>
            <Option value="7">MPESA</Option>
            <Option value="8">PayPal</Option>
            <Option value="9">PDQ</Option>
            <Option value="10">RFH Baraka Card</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Transaction Code"
          name="transactionCode"
          rules={[
            { required: true, message: "Please input the transaction code!" },
          ]}
        >
          <Input size="large" placeholder="Enter transaction code" />
        </Form.Item>

        <Form.Item
          label="Amount Paid"
          name="amountPaid"
          rules={[{ required: true, message: "Please enter the amount paid!" }]}
        >
          <Input size="large" type="number" placeholder="Enter amount" />
        </Form.Item>

        <Button type="primary" className="float-end mb-3" htmlType="submit">
          Add
        </Button>
      </Form>

      <Table
        size="small"
        dataSource={records}
        columns={columns}
        style={{ marginTop: 20 }}
        pagination={false}
        loading={receiptLinesLoading}
      />
    </Drawer>
  );
};

export default SplitReceipt;

SplitReceipt.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  size: PropTypes.string,
  receiptNo: PropTypes.string,
};
