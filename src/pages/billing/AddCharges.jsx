import React, { useEffect, useState } from "react";
import { Modal, Form, Row, Col, Input, Typography, Button, Select } from "antd";
import { IoCloseOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { getTransactionListSetup } from "../../actions/Charges-Actions/getTransactionList";
import { getChargesSetup } from "../../actions/Charges-Actions/ChargesSetup";
import { postPatientCharges } from "../../actions/Charges-Actions/postCharges";

const { Text } = Typography;

const AddCharges = ({ visible, onClose, myAction, recId, visitNo }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.getTransactionList);
  const { charges } = useSelector((state) => state.getChargesSetup);
  const { loading } = useSelector((state) => state.postPatientCharges);
  const [selectedTransactionType, setSelectedTransactionType] = useState(null);
  const [filteredCharges, setFilteredCharges] = useState([]);
  
  

  const [selectedCharge, setSelectedCharge] = useState(null);

  useEffect(() => {
    dispatch(getTransactionListSetup());
    dispatch(getChargesSetup());
  }, [dispatch]);

  // If transaction type is selected, get the full charge object
  const handleTransactionTypeChange = (value) => {
    setSelectedTransactionType(value);
    setFilteredCharges(charges.filter((item) => item.Transaction_Type === value));
    console.log("filtered charges:", filteredCharges);
  };
  
  const handleChargeTypeChange = (value) => {
    const charge = charges.find((item) => item.Description === value);
    setSelectedCharge(charge || null);
  };
  
  console.info("Selected visitNo :", visitNo);

  const handleSubmit = (values) => {
    const payload = {
      myAction:"create",
      recId:"",
      visitNo: visitNo || "",
      transactionType: values.transactionType,
      charge: selectedCharge ? selectedCharge.Code : "", // Submit charge CODE instead of amount
      quantity: values.quantity,
      remarks: values.remarks || "",
    };

    console.log("Submitting data:", payload);

     dispatch(postPatientCharges(payload));
  };

  return (
    <Modal
      title={
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
  onChange={handleTransactionTypeChange} // Add this
>
  {data?.map((item) => (
    <Select.Option key={item.TransactionType} value={item.TransactionType}>
      {item.TransactionType}
    </Select.Option>
  ))}
</Select>

            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Charge Name"
              name="charge"
              rules={[{ required: true, message: "Please enter charge name!" }]}
            >
             <Select
  placeholder="Select Charge"
  size="large"
  showSearch
  optionFilterProp="children"
  filterOption={(input, option) =>
    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }
  onChange={handleChargeTypeChange}
>
  {filteredCharges?.map((item) => (
    <Select.Option key={item.Code} value={item.Description}>
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
            <Form.Item label="Amount">
              <Input
                size="large"
                value={selectedCharge ? selectedCharge.Amount : 0} // Display amount from selected charge
                readOnly
              />
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
