import { Form, Input, Modal, Button } from "antd";
import React, { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { postDiscount } from "../../actions/Charges-Actions/postPatientDiscount";

const AllocateDiscount = ({ onClose, visible, patientNo }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.postDiscount);
  const [form] = Form.useForm(); // Initialize Ant Design Form

  const [discountData, setDiscountData] = useState({
    patientNo: patientNo || "",
    discountPercentage: 0,
    discountAmount: 0,
  });

  useEffect(() => {
    const urlPatientNo = new URLSearchParams(window.location.search).get("PatientNo");
    if (urlPatientNo) {
      setDiscountData((prev) => ({ ...prev, patientNo: urlPatientNo }));
      form.setFieldsValue({ patientNo: urlPatientNo }); // Sync with form
    }
  }, [visible]); // Re-run when modal opens

  const handleInputChange = (name, value) => {
    setDiscountData((prev) => ({
      ...prev,
      [name]: name === "discountAmount" || name === "discountPercentage" ? Number(value) : value,
    }));
  };

  const handleSubmitDiscount = () => {
    dispatch(postDiscount(discountData));
    form.resetFields(); // Reset form after submission
    onClose(); // Close modal
  };

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>Allocate Discount for Patient: {discountData.patientNo}</span>
          <IoCloseOutline onClick={onClose} style={{ fontSize: 16, cursor: "pointer" }} />
        </div>
      }
      open={visible}
      onCancel={onClose}
      style={{ top: 20 }}
      width={600}
      footer={null}
      afterClose={() => form.resetFields()} // Reset on close
    >
      <Form form={form} layout="vertical" onFinish={handleSubmitDiscount} initialValues={discountData}>
        <Form.Item label="Patient No" name="patientNo">
          <Input value={discountData.patientNo} style={{color:"#0F5689", fontWeight:"semibold"}} disabled />
        </Form.Item>

        {/* Discount Amount */}
        <Form.Item label="Discount Amount" name="discountAmount" rules={[{ required: true, message: "Please enter the discount amount" }]}>
          <Input
            type="number"
            placeholder="Enter Amount"
            onChange={(e) => handleInputChange("discountAmount", e.target.value)}
          />
        </Form.Item>

        {/* Discount Percentage */}
        <Form.Item label="Discount Percentage (%)" name="discountPercentage" rules={[{ required: true, message: "Please enter the discount percentage" }]}>
          <Input
            type="number"
            placeholder="Enter Percentage"
            onChange={(e) => handleInputChange("discountPercentage", e.target.value)}
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Submit Discount
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AllocateDiscount;
