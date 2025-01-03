import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Table,
  Empty,
  Card,
  List,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { SaveOutlined, SearchOutlined, SendOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getItemUnitsOfMeasureSlice } from "../../../actions/triage-actions/getItemUnitsOfMeasureSlice";
import {
  postPrescriptionDetails,
  sendtoPharmacy,
} from "../../../actions/Doc-actions/postPrescription";
import { useLocation } from "react-router-dom";
import { getItemsSlice } from "../../../actions/triage-actions/getItemsSlice";
import {
  prescriptionDoseTypes,
  routeTypes,
} from "../../../constants/DropDownConstants";
import { useForm } from "antd/es/form/Form";

const PrescriptionForm = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const treatmentNo = queryParams.get("TreatmentNo"); // Get treatmentNo from URL

  const dispatch = useDispatch();
  const { itemUnitsOfMeasure } = useSelector((state) => state.getItemUnits);
  const { loading: savingPrescription, success: prescriptionSaved } =
    useSelector((state) => state.postPrescription);
  const { loading: pharmacyPosting } = useSelector(
    (state) => state.sendtoPharmacy
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const form = useForm();
  const { items } = useSelector((state) => state.getItems);

  useEffect(() => {
    dispatch(getItemsSlice());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getItemUnitsOfMeasureSlice());
  }, [dispatch]);

  const [prescriptionCardData, setPrescriptionCardData] = useState({
    DrugNo: "N/A",
    Dosage: "N/A",
    UnitOfMeasure: "N/A",
    prescriptionDose: "N/A",
    route: "N/A",
    noOfDays: "N/A",
    PrescriptionQuantity: "N/A",
    PrescriptionRemarks: "N/A",
  });

  const onValuesChange = (changedValues, allValues) => {
    // Update prescription card state with current form values
    const updatedData = {
      DrugNo: allValues.Prescriptions?.DrugNo || "N/A",
      Dosage: allValues.Prescriptions?.Dosage || "N/A",
      UnitOfMeasure: allValues.Prescriptions?.UnitOfMeasure || "N/A",
      prescriptionDose: allValues.Prescriptions?.prescriptionDose || "N/A",
      route: allValues.Prescriptions?.route || "N/A",
      noOfDays: allValues.Prescriptions?.noOfDays || "N/A",
      PrescriptionQuantity: allValues.Prescriptions?.PrescriptionQuantity || "N/A",
      PrescriptionRemarks: allValues.Prescriptions?.PrescriptionRemarks || "N/A",
    };
    setPrescriptionCardData(updatedData);
  };

  const onFinish = (values) => {
    const {
      PrescriptionQuantity,
      PrescriptionRemarks,
      DrugGroup,
      DrugNo,
      UnitOfMeasure,
      Dosage,
      prescriptionDose,
      route,
      noOfDays,
    } = values.Prescriptions;

    const prescription = {
      myAction: "create",
      treatmentNo: treatmentNo, // Send treatmentNo to the backend
      drugGroup: DrugNo,
      drugNo: DrugNo,
      quantity: PrescriptionQuantity,
      unitOfMeasure: UnitOfMeasure,
      dosage: Dosage,
      prescriptionDose: prescriptionDose,
      noOfDays: noOfDays,
      route: route,
      remarks: PrescriptionRemarks,
    };

    setIsSubmitting(true); // Start the loading simulation

    dispatch(postPrescriptionDetails(prescription)); // Dispatch the action
  };
  
  const handleSearch = (value) => {
    setSearchValue(value);
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
    <Row gutter={24}>
      {/* drug input card */}
      <Col span={16}>
        <Card title="Prescription Form" style={{ padding: "10px 16px" }}>
          <Form
            layout="vertical"
            validateTrigger="onChange"
            onFinish={onFinish}
            onValuesChange={onValuesChange}
            initialValues={{
              Prescriptions: {
                PrescriptionNo: treatmentNo, // Set PrescriptionNo to treatmentNo
                PrescriptionQuantity: "",
                PrescriptionRemarks: "",
                DrugGroup: "",
                DrugNo: "",
                UnitOfMeasure: "",
                Dosage: "",
                prescriptionDose: "",
                route: "",
                noOfDays: "",
                treatmentNo: treatmentNo, // Keep treatmentNo in initial values
              },
            }}
            autoComplete="off"
          >
            <Form.Item
              label="Search Drug Name"
              name={["Prescriptions", "DrugNo"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please select a drug",
                },
              ]}
              className="w-100 my-2"
            >
              {items && (
                <Select
                  name="DrugNo"
                  placeholder="Select Drug e.g Paracetamol"
                  showSearch
                  suffixIcon={<SearchOutlined />}
                  onSearch={handleSearch}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                  notFoundContent={
                    searchValue && items.length === 0 ? (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No drugs found"
                      />
                    ) : null
                  }
                >
                  {searchValue &&
                    items.map((item) => (
                      <Select.Option key={item.No} value={item.No}>
                        {item.Description}
                      </Select.Option>
                    ))}
                </Select>
              )}
            </Form.Item>
            <div className="d-block d-flex align-items-center justify-content-between gap-2">
              <Form.Item
                label="Route"
                name={["Prescriptions", "route"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please select a route",
                  },
                ]}
                className="w-100"
              >
                <Select
                  name="route"
                  placeholder="Select Route e.g oral"
                  className="w-100"
                >
                  {routeTypes &&
                    routeTypes.map((item) => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Dosage"
                name={["Prescriptions", "Dosage"]}
                placeholder="Enter Dosage e.g 1 tablet"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please enter dosage",
                  },
                ]}
                className="w-100"
              >
                <Input
                  name="Dosage"
                  className="w-100"
                  placeholder="Enter Dosage e.g 1 tablet"
                />
              </Form.Item>
            </div>
            <div className="d-block d-flex align-items-center justify-content-between gap-2">
              <Form.Item
                label="Unit of Measure"
                name={["Prescriptions", "UnitOfMeasure"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please select a unit of measure",
                  },
                ]}
                className="w-100"
              >
                <Select
                  name="UnitOfMeasure"
                  placeholder="Select Unit e.g ml"
                  className="w-100"
                >
                  {itemUnitsOfMeasure.map((item) => (
                    <Select.Option key={item.Code} value={item.Code}>
                      {item.Description}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Frequency per Day"
                name={["Prescriptions", "prescriptionDose"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please select a prescription dose",
                  },
                ]}
                className="w-100"
              >
                <Select
                  name="prescriptionDose"
                  placeholder="Select Prescription Dose"
                  className="w-100"
                >
                  {prescriptionDoseTypes &&
                    prescriptionDoseTypes.map((item) => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </div>
            <div className="d-block d-flex align-items-center justify-content-between gap-2">
            <Form.Item
                label="Duration (No of Days)"
                name={["Prescriptions", "noOfDays"]}
                hasFeedback
                placeholder="Enter No of Days e.g 1"
                rules={[
                  {
                    required: true,
                    message: "Please enter no of days",
                  },
                ]}
                className="w-100"
              >
                <Input
                  type="number"
                  name="noOfDays"
                  className="w-100"
                />
              </Form.Item>

              <Form.Item
                label="Prescription Quantity"
                name={["Prescriptions", "PrescriptionQuantity"]}
                hasFeedback
                placeholder="Enter Prescription Quantity e.g 1"
                rules={[
                  {
                    required: true,
                    message: "Please enter prescription quantity",
                  },
                ]}
                className="w-100"
              >
                <Input
                  type="number"
                  name="PrescriptionQuantity"
                  className="w-100"
                />
              </Form.Item>
            </div>

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

            <div className="d-flex align-items-start gap-2 justify-content-evenly">
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={savingPrescription}
                >
                  <SaveOutlined />
                  Save Prescription
                </Button>
              </Form.Item>
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
            </div>
          </Form>
        </Card>
      </Col>
      {/* <Col span={8}>
        <Card
          title="Patient Prescription Card"
          bordered={false}
          className="card"
        >
          <List
            itemLayout="horizontal"
            dataSource={[
              { name: "Drug Name", description: prescriptionCardData.DrugNo },
              { name: "Dosage", description: prescriptionCardData.Dosage },
              { name: "Unit of Measure", description: prescriptionCardData.UnitOfMeasure },
              { name: "Frequency per Day", description: prescriptionCardData.prescriptionDose },
              { name: "Route", description: prescriptionCardData.route },
              { name: "No of Days", description: prescriptionCardData.noOfDays },
              { name: "Quantity", description: prescriptionCardData.PrescriptionQuantity },
              { name: "Remarks", description: prescriptionCardData.PrescriptionRemarks },
            ]}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={item.name}
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </Card>
      </Col> */}
    </Row>
  );
};

export default PrescriptionForm;

PrescriptionForm.propTypes = {
  observationNumber: PropTypes.string.isRequired,
  staffNo: PropTypes.string.isRequired,
};
