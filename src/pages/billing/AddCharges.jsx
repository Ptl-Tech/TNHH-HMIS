import React, { useEffect, useState } from "react";
import { Modal, Form, Row, Col, Input, Typography, Button, Select } from "antd";
import { IoCloseOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { getTransactionListSetup } from "../../actions/Charges-Actions/getTransactionList";
import { getChargesSetup } from "../../actions/Charges-Actions/ChargesSetup";

const { Text } = Typography;

const AddCharges = ({ visible, onClose, myAction, recId, visitNo }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.getTransactionList);
  const { charges } = useSelector((state) => state.getChargesSetup);

  const [chargesAmount, setChargesAmount] = useState(0);
  const [transactionType, setTransactionType] = useState("");

  useEffect(() => {
    dispatch(getTransactionListSetup());
    dispatch(getChargesSetup());
    console.log(data);
  }, [dispatch]);

  // If transaction type is selected, get the amount
  useEffect(() => {
    if (transactionType) {
      const selectedCharge = charges.find(
        (item) => item.Transaction_Type === transactionType
      );
      setChargesAmount(selectedCharge ? selectedCharge.Amount : 0); // Default to 0 if not found
    }
  }, [transactionType, charges]);

  const handleSubmit = (values) => {
    const payload = {
      myAction,            
      recId,                
      visitNo,              
      transactionType: values.transactionType,  
      charge: transactionType,  
      quantity: values.quantity,
      remarks: values.remarks || "",    
    };
  
    console.log("Submitting data:", payload);
  
    // dispatch(submitChargeData(payload));
  };
  
  return (
    <Modal
      title={
        // title and close icon
        <div className="flex justify-between">
          <span className="text-lg font-bold">Add Charges</span>
          <span>
            <IoCloseOutline className="text-2xl" onClick={onClose} />
          </span>
        </div>
      }
      visible={visible}
      footer={null}
      style={{ width: "100%", top: "20px" }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Service Name"
              name="transactionType"
              rules={[{ required: true, message: "Please enter charge name!" }]}
            >
              <Select
                placeholder="Select Service"
                size="large"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                onChange={(value) => setTransactionType(value)} // Set transaction type on selection
              >
                {data?.map((item) => (
                  <Select.Option key={item.TransactionType} value={item.TransactionType}>
                    {item.Description}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Quantity"
              name="quantity"
              rules={[{ required: true, message: "Please enter quantity!" }]}
            >
              <Input size="large" type="number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Amount"
              name="charge"
              initialValue={chargesAmount} 
              rules={[{ required: true, message: "Please enter amount!" }]}
            >
              <Input size="large" type="number" value={chargesAmount} readOnly /> {/* Make the input readonly */}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Remarks" name="remarks">
              <Input.TextArea size="large" />
            </Form.Item>
          </Col>
        </Row>

        <div className="d-flex justify-content-end align-items-center gap-3">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddCharges;
