import {
  Button,
  Drawer,
  Form,
  Input,
  Select,
  Space,
  Typography,
  Table,
} from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { SaveOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getSplitReceiptLines } from "../../actions/Charges-Actions/getSplitReceiptLines";

const { Option } = Select;
const { Text } = Typography;

const SplitReceipt = ({ open, onClose, size, receiptNo }) => {
  const dispatch = useDispatch();
  const { data, loading: receiptLinesLoading } = useSelector(
    (state) => state.getQyReceiptSplitList
  );

  const [form] = Form.useForm();

  const [records, setRecords] = useState([]);

  const grandTotal = 5000;
  const totalAccumulative = records.reduce(
    (sum, record) => sum + parseFloat(record.amountPaid || 0),
    0
  );

  useEffect(() => {
    if (receiptNo) {
      dispatch(getSplitReceiptLines(receiptNo));
    }
  }, [ dispatch, receiptNo]);

  useEffect(() => {
    if (data) {
      setRecords(
        data.map((item, index) => ({
          key: index,
          paymentMode: item.PayMode,
          transactionCode: item.TransactionNo,
          amountPaid: item.Amount,
        }))
      );
    }
  }, [data]);

  const handleAdd = (values) => {
    setRecords([...records, { key: Date.now(), ...values }]);
    form.resetFields();
  };

  const handleRemove = (key) => {
    setRecords(records.filter((item) => item.key !== key));
  };

  const columns = [
    { title: "Payment Mode", dataIndex: "paymentMode", key: "paymentMode" },
    { title: "Transaction Code", dataIndex: "transactionCode", key: "transactionCode" },
    { title: "Amount Paid", dataIndex: "amountPaid", key: "amountPaid" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => handleRemove(record.key)}
        />
      ),
    },
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
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 16px" }}>
          <div>
            <Text strong>Grand Total Expected: </Text>
            <Text type="secondary">Ksh {grandTotal}</Text>
          </div>
          <div>
            <Text strong>Total Accumulative: </Text>
            <Text type="secondary">Ksh {totalAccumulative}</Text>
          </div>
          <Button type="primary" icon={<SaveOutlined />} onClick={() => form.submit()}>
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
            <Option value="cash">Cash</Option>
            <Option value="card">Card</Option>
            <Option value="bank">Bank Transfer</Option>
            <Option value="mobile">Mobile Payment</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Transaction Code"
          name="transactionCode"
          rules={[{ required: true, message: "Please input the transaction code!" }]}
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
        dataSource={data}
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
