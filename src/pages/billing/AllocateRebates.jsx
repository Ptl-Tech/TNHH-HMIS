import { Form, Input, Modal, Select, Button, DatePicker } from "antd";
import React, { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { listInsuranceOptions } from "../../actions/DropdownListActions";
import { postRebates } from "../../actions/Charges-Actions/postRebates";
import moment from "moment";
import { getSinglePatientBill } from "../../actions/Charges-Actions/getSinglePatientBill";

const AllocateRebates = ({ onClose, visible, patientNo }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const activeVisitNo = new URLSearchParams(location.search).get("PatientNo");
  const { loading } = useSelector((state) => state.postRebates);
  const {
    data: insurancePayload,
  } = useSelector((state) => state.getInsurance);

    const {
      loading: patientBillLoading,
      error: patientBillError,
      data: patientBillData,
    } = useSelector((state) => state.getSingleBill);
  const [rebatesData, setRebatesData] = useState({
    patientNo: patientNo || "",
    rebateAmount: 0,
    chargeDate: moment().format("YYYY-MM-DD"), // Default to today in correct format
    insuaranceCode: "",
  });


  useEffect(() => {
    dispatch(listInsuranceOptions());
  }, [dispatch]);

  const handleInputChange = (name, value) => {
    setRebatesData((prev) => ({
      ...prev,
      [name]: name === "rebateAmount" ? Number(value) : value, // Ensure rebateAmount is a number
    }));
  };

  const handleDateChange = (date) => {
    setRebatesData((prev) => ({
      ...prev,
      chargeDate: date ? date.format("YYYY-MM-DD") : "", // Ensure correct date format
    }));
  };

  const handleSubmitRebates =async () => {
 await  dispatch(postRebates(rebatesData));
       await   dispatch(getSinglePatientBill(activeVisitNo));
    onClose(); // Close the modal after submission
    form.resetFields();
  };

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>Allocate Rebates for Patient: {rebatesData.patientNo}</span>
          <IoCloseOutline onClick={onClose} style={{ marginRight: 10, fontSize: 16, cursor: "pointer" }} />
        </div>
      }
      open={visible}
      onCancel={onClose}
      style={{ top: 20 }}
      width={600}
      footer={null}
    >
      <Form layout="vertical" onFinish={handleSubmitRebates} form={form}>
        {/* Allocation Amount */}
        <Form.Item
          label="Allocation Amount"
          name="rebateAmount"
          rules={[{ required: true, message: "Please enter an amount" }]}
        >
          <Input
            type="number"
            placeholder="Enter Amount"
            value={rebatesData.rebateAmount}
            onChange={(e) => handleInputChange("rebateAmount", e.target.value)}
          />
        </Form.Item>

        {/* Charge Date */}
        <Form.Item
          label="Charge Date"
          name="chargeDate"
          rules={[{ required: true, message: "Please select a date" }]}
        >
          <DatePicker
            format="YYYY-MM-DD"
            className="w-100"
            value={moment(rebatesData.chargeDate)}
            onChange={handleDateChange}
          />
        </Form.Item>

        {/* Insurance Selection */}
        <Form.Item
          label="Insurance"
          name="insuaranceCode"
          rules={[{ required: true, message: "Please select insurance" }]}
        >
          <Select
            placeholder="Select Insurance"
            className="w-100"
            value={rebatesData.insuaranceCode}
            onChange={(value) => handleInputChange("insuaranceCode", value)}
            showSearch
            allowClear
            filterOption={(input, option) =>
              option.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            <Select.Option value="">--Select Insurance--</Select.Option>
            {insurancePayload && insurancePayload.length > 0 ? (
              insurancePayload.map((insurance) => (
                <Select.Option key={insurance.No} value={insurance.No}>
                  {insurance.Name}
                </Select.Option>
              ))
            ) : (
              <Select.Option value="" disabled>
                No data available
              </Select.Option>
            )}
          </Select>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Submit Rebates
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AllocateRebates;
