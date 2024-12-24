import { Button, Col, Form, Input, Row, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { SaveOutlined, SendOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getItemUnitsOfMeasureSlice } from "../../../actions/triage-actions/getItemUnitsOfMeasureSlice";
import { postPrescriptionDetails, sendtoPharmacy } from "../../../actions/Doc-actions/postPrescription";
import { useLocation } from "react-router-dom";

const PrescriptionForm = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const treatmentNo = queryParams.get("TreatmentNo"); // Get treatmentNo from URL

  const dispatch = useDispatch();
  const { itemUnitsOfMeasure } = useSelector((state) => state.getItemUnits);
  const { loading: savingPrescription, success: prescriptionSaved } = useSelector((state) => state.postPrescription);
  const { loading: pharmacyPosting } = useSelector((state) => state.sendtoPharmacy);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(getItemUnitsOfMeasureSlice());
  }, [dispatch]);

  const onFinish = (values) => {
    const {
      PrescriptionQuantity,
      PrescriptionRemarks,
      DrugGroup,
      DrugNo,
      UnitOfMeasure,
      Dosage,
    } = values.Prescriptions;

    const prescription = {
      myAction: "create",
      treatmentNo: treatmentNo, // Send treatmentNo to the backend
      drugGroup: DrugGroup,
      drugNo: DrugNo,
      quantity: PrescriptionQuantity,
      unitOfMeasure: UnitOfMeasure,
      dosage: Dosage,
      remarks: PrescriptionRemarks,
    };

    setIsSubmitting(true); // Start the loading simulation

    dispatch(postPrescriptionDetails(prescription)); // Dispatch the action
  };

  useEffect(() => {
    if (prescriptionSaved) {
      // Enable Send to Pharmacy button after prescription is saved
      setIsSubmitting(false);
    }
  }, [prescriptionSaved]);

  const handleSendToPharmacy = () => {
    dispatch(sendtoPharmacy(treatmentNo));
  };

  return (
    <div>
      <Form
        layout="vertical"
        validateTrigger="onChange"
        onFinish={onFinish}
        initialValues={{
          Prescriptions: {
            PrescriptionNo: treatmentNo, // Set PrescriptionNo to treatmentNo
            PrescriptionQuantity: "",
            PrescriptionRemarks: "",
            DrugGroup: "",
            DrugNo: "",
            UnitOfMeasure: "",
            Dosage: "",
            treatmentNo: treatmentNo, // Keep treatmentNo in initial values
          },
        }}
        autoComplete="off"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Prescription No"
              name={["Prescriptions", "PrescriptionNo"]} // Ensure name matches the initial value
            >
              <Input
                name="PrescriptionNo"
                value={treatmentNo} // Value is set to treatmentNo from URL
                style={{ width: "100%", color: "green", fontWeight: "bold" }}
                readOnly // Make it read-only so it can't be edited
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Prescription Quantity"
              name={["Prescriptions", "PrescriptionQuantity"]}
              hasFeedback
            >
              <Input type="number" name="PrescriptionQuantity" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Drug Group"
              name={["Prescriptions", "DrugGroup"]}
              hasFeedback
            >
              <Input name="DrugGroup" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Drug No"
              name={["Prescriptions", "DrugNo"]}
              hasFeedback
            >
              <Input name="DrugNo" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Unit of Measure"
              name={["Prescriptions", "UnitOfMeasure"]}
              hasFeedback
            >
              <Select name="UnitOfMeasure" placeholder="Select Unit">
                {itemUnitsOfMeasure.map((item) => (
                  <Select.Option key={item.ItemNo} value={item.ItemNo}>
                    {item.Code}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Dosage"
              name={["Prescriptions", "Dosage"]}
              hasFeedback
            >
              <Input name="Dosage" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Prescription Remarks"
              name={["Prescriptions", "PrescriptionRemarks"]}
              hasFeedback
            >
              <TextArea
                autoSize={{ minRows: 3, maxRows: 5 }}
                name="PrescriptionRemarks"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={savingPrescription}
                disabled={isSubmitting}
              >
                <SaveOutlined />
                Save Prescription
              </Button>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item>
              <Button
                type="primary"
                onClick={handleSendToPharmacy}
                loading={pharmacyPosting}
                disabled={!prescriptionSaved}
              >
                <SendOutlined />
                Send to Pharmacy
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default PrescriptionForm;

PrescriptionForm.propTypes = {
  observationNumber: PropTypes.string.isRequired,
  staffNo: PropTypes.string.isRequired,
};
