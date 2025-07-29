import React, { useEffect, useState } from "react";
import { Button, Drawer, Form, Input, Select, Skeleton ,Row, Col, DatePicker, message} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getTransactionListSetup } from "../../../actions/Charges-Actions/getTransactionList";
import { getChargesSetup } from "../../../actions/Charges-Actions/ChargesSetup";
import { postPatientCharges,POST_CHARGES_RESET } from "../../../actions/Charges-Actions/postCharges";
import { getPatientCharges } from "../../../actions/Charges-Actions/getPatientCharges";
import { getSinglePatientBill } from "../../../actions/Charges-Actions/getSinglePatientBill";
import moment from "moment";
import { listDoctors } from "../../../actions/DropdownListActions";
import {CloseOutlined}from "@ant-design/icons";
const AddChargesDrawer = ({
  visible,
  onClose,
  activeVisitNo,
  editingCharge,
}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { data: transactionList, loading: transactionListLoading } =
    useSelector((state) => state.getTransactionList);
  const { charges: transactionCharges, loading: chargesLoading } = useSelector(
    (state) => state.getChargesSetup
  );
  const { loading: addChargesLoading, error:addChargesError, success: addChargesSuccess } = useSelector(
    (state) => state.postPatientCharges
  );
  const {
    loading: patientBillLoading,
    error: patientBillError,
    data: patientBillData,
  } = useSelector((state) => state.getSingleBill);
  const { data: doctors } = useSelector((state) => state.getDoctorsList);

  const [transactionType, setTransactionType] = useState(null);
  const [charges, setCharges] = useState([]);
  const [selectedCharge, setSelectedCharge] = useState(null);
  const [quantity, setQuantity] = useState(1);
    const [calculateDoctorFee, setCalculateDoctorFee] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    

useEffect(() => {
  if (activeVisitNo) {
    dispatch(getSinglePatientBill(activeVisitNo)); // Fetch updated bill balance
  }
}, [dispatch, activeVisitNo]);

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

  useEffect(() => {
    if(transactionType !== null && transactionType !== undefined) {
      const selectedTransaction = transactionList.find(
        (item) => item.TransactionType === transactionType
      );

       if (selectedTransaction?.CalculateDoctorFee) {
            setCalculateDoctorFee(true);
            dispatch(listDoctors());
          } else {
            setCalculateDoctorFee(false);
            setSelectedDoctor(null); // Clear selected doctor if not required
          }
        }
  }, [transactionType, transactionList, dispatch]);


  useEffect(() => {
    if (addChargesSuccess) {
      form.resetFields(); // Reset form fields after successful submission
      dispatch({type: POST_CHARGES_RESET}); // Reset success state
      onClose(); // Close the drawer
    }
  }, [addChargesSuccess, form, dispatch, onClose]);

  useEffect(() => {
    if (addChargesError) {
      message.error(addChargesError); // Show error message
      dispatch({type: POST_CHARGES_RESET}); // Reset error state
    }
  }, [addChargesError, dispatch]);

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

  const saveCharges = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        myAction: editingCharge ? "edit" : "create",
        recId: editingCharge ? editingCharge.SystemId : "",
        visitNo: activeVisitNo,
        transactionType: transactionType,
        charge: selectedCharge.Code,
        quantity: values.Quantity,
        remarks: values.remarks,
        creationDate: values.creationDate?.format("YYYY-MM-DD") || moment().format("YYYY-MM-DD"),
        doctorId: calculateDoctorFee ? selectedDoctor : "",
      };
      
      await dispatch(postPatientCharges(payload)); // Wait for charges to be posted
      dispatch(getPatientCharges(activeVisitNo)); // Fetch updated patient charges
      dispatch(getSinglePatientBill(activeVisitNo)); // Fetch updated bill balance
  
      onClose();
      form.resetFields();
    } catch (error) {
      console.error("Error saving charges:", error);
    }
  };
  

  return (
    <Drawer
      title={editingCharge ? "Edit Charge" : "Add Charge"}
      visible={visible}
      onClose={onClose}
      width={600}
      placement="right"
      maskClosable={false}
      footer={
       null
      }
       extra={<Button onClick={onClose} icon={<CloseOutlined />} danger>Close</Button>}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          name="transactionType"
          label="Transaction Type"
          rules={[
            { required: true, message: "Please select a transaction type!" },
          ]}
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
                <Select.Option
                  key={item.TransactionType}
                  value={item.TransactionType}
                >
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
            <Select onChange={handleChargeSelect} disabled={!!editingCharge}   showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            allowClear>
              {charges.map((charge) => (
                <Select.Option key={charge.Code} value={charge.Code}>
                  {charge.Description}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
  {calculateDoctorFee && (
    <Form.Item
      label="Select Doctor"
      name="doctorId"
      rules={[{ required: true, message: "Please select a doctor!" }]}
    >
      <Select
        placeholder="Select Doctor"
        showSearch
        optionFilterProp="children"
        onChange={(value) => setSelectedDoctor(value)}
      >
        {doctors?.map((doc) => (
          <Select.Option key={doc.DoctorID} value={doc.DoctorID}>
            {doc.DoctorsName}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
)}

       <Row gutter={16}>
        <Col span={12}>
        <Form.Item
          name="Quantity"
          label="Quantity"
          rules={[{ required: true, message: "Please enter a quantity!" }]}
        >
          <Input
            type="number"
            min={1}
            value={quantity}
            onChange={handleQuantityChange}
          />
        </Form.Item>
        </Col>
        <Col span={12}>

        <Form.Item name="Amount" label="Total Amount">
          <Input
            disabled
            style={{ textAlign: "left", fontWeight: "bold", color: "green" }}
          />
        </Form.Item>

       </Col>
       </Row>
       <Row gutter={16}>
       {patientBillData[0]?.CurrentAdmNo && (
  <Form.Item
    name="creationDate"
    label="Creation Date"
    rules={[{ required: true, message: "Please select the creation date!" }]}
    style={{ width: "100%" }}
  >
    <DatePicker style={{ width: "100%" }} />
  </Form.Item>
)}
       </Row>
        <Form.Item name="remarks" label="Remarks">
          <Input.TextArea rows={4} />
        </Form.Item>
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
      </Form>
    </Drawer>
  );
};

export default AddChargesDrawer;
