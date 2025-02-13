import React, { useEffect, useState } from "react";
import { Modal, Form, Row, Col, Input, Typography, Button, Select, Table, message } from "antd";
import { IoCloseOutline } from "react-icons/io5";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // For Edit and Delete icons
import { useDispatch, useSelector } from "react-redux";
import { getTransactionListSetup } from "../../actions/Charges-Actions/getTransactionList";
import { getChargesSetup } from "../../actions/Charges-Actions/ChargesSetup";
import { postPatientCharges } from "../../actions/Charges-Actions/postCharges";
import { getUnpostedCharges } from "../../actions/Charges-Actions/getUnpostedCharges";
import ProcessPayment from "./ProcessPayment";

const { Text } = Typography;

const AddCharges = ({ visible, onClose, myAction, recId, visitNo, setTotalAmount, patientNo,refreshTable }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { data } = useSelector((state) => state.getTransactionList);
  const { charges } = useSelector((state) => state.getChargesSetup);
  const { loading } = useSelector((state) => state.postPatientCharges);
  const { loading: chargesLoading, data: chargesList } = useSelector((state) => state.getUnpostedCharges);

  const [selectedTransactionType, setSelectedTransactionType] = useState(null);
  const [filteredCharges, setFilteredCharges] = useState([]);
  const [selectedCharge, setSelectedCharge] = useState(null);
  const [localChargesList, setLocalChargesList] = useState([]);
  const [isGenerateReceiptModalVisible, setIsGenerateReceiptModalVisible] = useState(false);

  useEffect(() => {
    if (chargesList) {
      setLocalChargesList(chargesList.filter(item => item.Transaction_Type !== "ZRECEIPT"));
    }
  }, [chargesList]);

  const handleClose = () => {
    setLocalChargesList([]); // Clear table data on modal close
    onClose();
    // Calculate total amount before closing
    const totalAmount = localChargesList.reduce((total, charge) => total + charge.Total_Amount, 0);
    setTotalAmount(totalAmount); // Pass total amount to parent component
  };

  useEffect(() => {
    if (patientNo) {
      dispatch(getUnpostedCharges(patientNo));
    }
  }, [dispatch, patientNo]);

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

  const handleAddCharge = async (values) => {
    if (!selectedCharge) return;

    const payload = {
      myAction: "create",
      recId: "",
      visitNo: visitNo || "",
      transactionType: selectedCharge.Transaction_Type,
      charge: selectedCharge.Code,
      quantity: values.quantity,
      remarks: values.remarks,
      patientNo: patientNo,
    };

    await dispatch(postPatientCharges(payload));
    refreshTable();
      onClose();


      // Update local charges list
      setLocalChargesList([...localChargesList, {
        ...selectedCharge,
        Quantity: values.quantity,
        Total_Amount: selectedCharge.Amount * values.quantity,
        Remarks: values.remarks,
      }]);

      // Update total amount in parent component
      const totalAmount = localChargesList.reduce((total, charge) => total + charge.Total_Amount, 0);
      setTotalAmount(totalAmount);

    form.resetFields();
  };

  const handleDeleteCharge = (chargeId) => {
    // Implement delete functionality here
    message.success(`Charge with ID: ${chargeId} deleted!`);
  };

  const handleEditCharge = (chargeId) => {
    // Implement edit functionality here
    message.success(`Charge with ID: ${chargeId} edited!`);
  };

  const columns = [
    { title: "Patient No", dataIndex: "Patient_No", key: "Patient_No" },
    { title: "Date", dataIndex: "Date", key: "Date" },
    { title: "Transaction Type", dataIndex: "Transaction_Type", key: "Transaction_Type" },
    { title: "Code", dataIndex: "Code", key: "Code" },
    { title: "Description", dataIndex: "Description", key: "Description" },
    { title: "Quantity", dataIndex: "Quantity", key: "Quantity" },
    { title: "Remarks", dataIndex: "Remarks", key: "Remarks" },
    { title: "Amount", dataIndex: "Total_Amount", key: "Total_Amount" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div>
          <Button 
            onClick={() => handleEditCharge(record.Code)} 
            icon={<FaEdit />} 
            type="primary" 
            size="small" 
            style={{ marginRight: 8 }} 
          />
          <Button 
            onClick={() => handleDeleteCharge(record.Code)} 
            icon={<FaTrashAlt />} 
            type="danger" 
            size="small" 
          />
        </div>
      ),
    },
  ];

  // Sort the localChargesList by Date (latest first)
  const sortedChargesList = [...localChargesList].sort((a, b) => b.AuxiliaryIndex1 - a.AuxiliaryIndex1);

  return (
    <Modal
      title={
        <div className="flex justify-between">
          <span className="text-lg font-bold">Add Charges</span>
          <IoCloseOutline className="text-2xl" onClick={handleClose} />
        </div>
      }
      visible={visible}
      footer={null}
      style={{ width: "100%", top: "20px" }}
      width={"75%"}
      onCancel={handleClose}
    >
      <Form form={form} layout="vertical" onFinish={handleAddCharge}>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              label="Service Name"
              name="transactionType"
              rules={[{ required: true, message: "Please enter charge name!" }]}>
              <Select
                placeholder="Select Service"
                size="large"
                showSearch
                optionFilterProp="children"
                onChange={handleTransactionTypeChange}>
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
              rules={[{ required: true, message: "Please enter charge name!" }]}>
              <Select
                placeholder="Select Charge"
                size="large"
                showSearch
                optionFilterProp="children"
                onChange={handleChargeTypeChange}>
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
              rules={[{ required: true, message: "Please enter quantity!" }]}>
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
            <Form.Item label="Remarks" name="remarks" rules={[{ required: true, message: "Please input Remarks!" }]}>
              <Input.TextArea size="large" />
            </Form.Item>
          </Col>
        </Row>
        <div className="d-flex justify-content-end align-items-center gap-3">
          <Button type="primary" htmlType="submit">Save</Button>
        </div>
      </Form>

      <ProcessPayment
        visible={isGenerateReceiptModalVisible}
        onClose={() => setIsGenerateReceiptModalVisible(false)}
        amount={localChargesList.reduce((total, item) => total + item.Total_Amount, 0)} // Pass total amount
        patientNo={patientNo}
      />
    </Modal>
  );
};

export default AddCharges;
