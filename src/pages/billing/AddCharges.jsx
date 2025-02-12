import React, { useEffect, useState } from "react";
import { Modal, Form, Row, Col, Input, Typography, Button, Select, Table, message } from "antd";
import { IoCloseOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { getTransactionListSetup } from "../../actions/Charges-Actions/getTransactionList";
import { getChargesSetup } from "../../actions/Charges-Actions/ChargesSetup";
import { postPatientCharges } from "../../actions/Charges-Actions/postCharges";
import { useLocation } from "react-router-dom";

const { Text } = Typography;

const AddCharges = ({ visible, onClose, myAction, recId, visitNo, setTotalAmount }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.getTransactionList);
  const { charges } = useSelector((state) => state.getChargesSetup);
  const { loading } = useSelector((state) => state.postPatientCharges);
  const patientNo = new URLSearchParams(useLocation().search).get("PatientNo");

  const [selectedTransactionType, setSelectedTransactionType] = useState(null);
  const [filteredCharges, setFilteredCharges] = useState([]);
  const [chargeList, setChargeList] = useState([]);
  const [selectedCharge, setSelectedCharge] = useState(null);

  useEffect(() => {
    dispatch(getTransactionListSetup());
    dispatch(getChargesSetup());
  }, [dispatch]);

  const handleTransactionTypeChange = (value) => {
    setSelectedTransactionType(value);
    setFilteredCharges(charges.filter((item) => item.Transaction_Type === value));
  };

  const handleChargeTypeChange = (value) => {
    const charge = charges.find((item) => item.Description === value);
    setSelectedCharge(charge || null);
  };

  const handleAddCharge = (values) => {
    if (!selectedCharge) return;

    const chargeEntry = {
      key: chargeList.length + 1,
      description: selectedCharge.Description,
      quantity: values.quantity,
      amount: selectedCharge.Amount * values.quantity,
      chargeCode: selectedCharge.Code, // Store charge code for submission
      transactionType: selectedTransactionType,
      remarks: values.remarks || "",
    };

     // Update the local charge list
  const updatedList = [...chargeList, chargeEntry];
  setChargeList(updatedList);

  // Calculate the new total amount
  const newTotalAmount = updatedList.reduce((sum, item) => sum + item.amount, 0);

  // Update the parent component's balance
  setTotalAmount(newTotalAmount);
    form.resetFields();
  };

  const handleSubmitAll = async () => {
    if (chargeList.length === 0) {
      message.warning("No charges added to submit.");
      return;
    }

    for (const charge of chargeList) {
      const payload = {
        myAction: "create",
        recId: "",
        visitNo: visitNo || "",
        transactionType: charge.transactionType,
        charge: charge.chargeCode,
        quantity: charge.quantity,
        remarks: charge.remarks,
        patientNo: patientNo,
      };

      try {
        await dispatch(postPatientCharges(payload));
      } catch (error) {
        message.error(`Failed to submit charge: ${charge.description}`);
        console.error(error);
      }
    }

    // message.success("All charges submitted successfully!");
    setChargeList([]);
    setTotalAmount(0);
    onClose();
  };

  const columns = [
    { title: "Charge Name", dataIndex: "description", key: "description" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
  ];

  return (
    <Modal
      title={
        <div className="flex justify-between">
          <span className="text-lg font-bold">Add Charges</span>
          <IoCloseOutline className="text-2xl" onClick={onClose} />
        </div>
      }
      visible={visible}
      footer={null}
      style={{ width: "100%", top: "20px" }}
      width={"80%"}
      onCancel={onClose}
    >
      <Form form={form} layout="vertical" onFinish={handleAddCharge}>
        <Row gutter={16}>
          <Col span={6}>
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
                onChange={handleTransactionTypeChange}
              >
                {data?.map((item) => (
                  <Select.Option key={item.TransactionType} value={item.TransactionType}>
                    {item.TransactionType}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
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
          <Col span={6}>
            <Form.Item
              label="Quantity"
              name="quantity"
              rules={[{ required: true, message: "Please enter quantity!" }]}
            >
              <Input size="large" type="number" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Amount">
              <Input size="large" value={selectedCharge ? selectedCharge.Amount : 0} readOnly />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Remarks" name="remarks" rules={[{required:true, message:"Please input Remarks!"}]}>
              <Input.TextArea size="large" />
            </Form.Item>
          </Col>
        </Row>
        <div className="d-flex justify-content-end align-items-center gap-3">
          <Button type="primary" htmlType="submit">Add Charge</Button>
        </div>
      </Form>

      <Table dataSource={chargeList} columns={columns} pagination={false} className="mt-4" />

      <div className="d-flex justify-content-end align-items-center gap-3">
        <Button type="primary" onClick={handleSubmitAll} >Submit</Button>
        <Button onClick={onClose}>Cancel</Button>
      </div>
    </Modal>
  );
};

export default AddCharges;
