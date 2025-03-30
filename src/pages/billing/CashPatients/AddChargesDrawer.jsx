import React, { useEffect, useState } from "react";
import { Button, Drawer, Form, Input, Select, Skeleton } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getTransactionListSetup } from "../../../actions/Charges-Actions/getTransactionList";
import { getChargesSetup } from "../../../actions/Charges-Actions/ChargesSetup";
import { postPatientCharges } from "../../../actions/Charges-Actions/postCharges";
import { getPatientCharges } from "../../../actions/Charges-Actions/getPatientCharges";

const AddChargesDrawer = ({ visible, onClose, activeVisitNo, editingCharge }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { data: transactionList, loading: transactionListLoading } =
    useSelector((state) => state.getTransactionList);
  const { charges: transactionCharges, loading: chargesLoading } =
    useSelector((state) => state.getChargesSetup);
  const { loading: addChargesLoading } = useSelector((state) => state.postPatientCharges);

  const [transactionType, setTransactionType] = useState(null);
  const [charges, setCharges] = useState([]);
  const [selectedCharge, setSelectedCharge] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (visible) {
      form.resetFields();
      dispatch(getTransactionListSetup());
      dispatch(getChargesSetup());

      if (editingCharge) {
        // Prefill the form with existing charge data for editing
        form.setFieldsValue({
          transactionType: editingCharge.Transaction_Type,
          chargeType: editingCharge.Description,
          Quantity: editingCharge.Quantity,
          Amount: `KES ${editingCharge.Total_Amount.toFixed(2)}`,
          remarks: editingCharge.Remarks,
        });

        setTransactionType(editingCharge.Transaction_Type);
        setSelectedCharge({
          Code: editingCharge.Code,
          Amount: editingCharge.Total_Amount / editingCharge.Quantity,
        });
        setQuantity(editingCharge.Quantity);
      }
    }
  }, [dispatch, visible, form, editingCharge]);

  useEffect(() => {
    if (transactionType) {
      setCharges(
        transactionCharges.filter(
          (item) => item.Transaction_Type === transactionType
        )
      );
    } else {
      setCharges([]);
      setSelectedCharge(null);
      form.setFieldsValue({ chargeType: null, Amount: "" });
    }
  }, [transactionCharges, transactionType, form]);

  const handleChargeSelect = (chargeCode) => {
    const charge = charges.find((item) => item.Code === chargeCode);
    setSelectedCharge(charge);
    updateTotalAmount(charge?.Amount, quantity);
  };

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10) || 1;
    setQuantity(newQuantity);
    updateTotalAmount(selectedCharge?.Amount, newQuantity);
  };

  const updateTotalAmount = (amount, qty) => {
    if (amount) {
      const totalAmount = amount * qty;
      const formattedAmount = `KES ${totalAmount.toFixed(2)}`;
      form.setFieldsValue({ Amount: formattedAmount, Quantity: qty });
    } else {
      form.setFieldsValue({ Amount: "KES 0.00" });
    }
  };

  const saveCharges = () => {
    form.validateFields().then((values) => {
      const payload = {
        myAction: editingCharge ? "edit" : "create",
        recId: editingCharge ? editingCharge.SystemId : "",
        visitNo: activeVisitNo,
        transactionType: transactionType,
        charge: selectedCharge.Code,
        quantity: values.Quantity,
        remarks: values.remarks,
      };

      dispatch(postPatientCharges(payload));

      setTimeout(() => {
        dispatch(getPatientCharges(activeVisitNo));
      }, 1000);
      
      onClose();
      form.resetFields();
    });
  };

  return (
    <Drawer
      title={editingCharge ? "Edit Charge" : "Add Charge"}
      visible={visible}
      onClose={onClose}
      width={400}
      placement="right"
      maskClosable={false}
      footer={
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button onClick={onClose} size="large" block>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={saveCharges}
            size="large"
            block
            loading={addChargesLoading}
            disabled={addChargesLoading}
          >
            {editingCharge ? "Update Charge" : "Add Charge"}
          </Button>
        </div>
      }
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          name="transactionType"
          label="Transaction Type"
          rules={[{ required: true, message: "Please select a transaction type!" }]}
        >
          {transactionListLoading ? (
            <Skeleton.Input active />
          ) : (
            <Select
              showSearch
              optionFilterProp="children"
              allowClear
              onChange={(value) => setTransactionType(value)}
              disabled={!!editingCharge} // Disable in edit mode
            >
              {transactionList?.map((item) => (
                <Select.Option key={item.TransactionType} value={item.TransactionType}>
                  {item.Description}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>

        <Form.Item
          name="chargeType"
          label="Charge Type"
          rules={[{ required: true, message: "Please select a charge type!" }]}
        >
          {chargesLoading ? (
            <Skeleton.Input active />
          ) : (
            <Select onChange={handleChargeSelect} disabled={!!editingCharge}>
              {charges.map((charge) => (
                <Select.Option key={charge.Code} value={charge.Code}>
                  {charge.Description}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>

        <Form.Item name="Quantity" label="Quantity" rules={[{ required: true, message: "Please enter a quantity!" }]}>
          <Input type="number" min={1} value={quantity} onChange={handleQuantityChange} />
        </Form.Item>

        <Form.Item name="Amount" label="Total Amount">
          <Input disabled style={{ textAlign: "left", fontWeight: "bold", color: "green" }} />
        </Form.Item>

        <Form.Item name="remarks" label="Remarks">
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddChargesDrawer;
