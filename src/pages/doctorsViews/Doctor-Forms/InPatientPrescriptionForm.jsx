import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Empty,
  Card,
  List,
  Space,
  Typography,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { SaveOutlined, SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getItemUnitsOfMeasureSlice } from "../../../actions/triage-actions/getItemUnitsOfMeasureSlice";
import { postInPatientPrescriptionDetails } from "../../../actions/Doc-actions/postPrescription";
import { useLocation } from "react-router-dom";
import { getItemsSlice } from "../../../actions/triage-actions/getItemsSlice";
import useAuth from "../../../hooks/useAuth";
import {
  getInPatientQyPrescriptionLineSlice,
  getQyPrescriptionLineSlice,
} from "../../../actions/Doc-actions/QyPrescriptionLinesSlice";
import useFetchAllergiesAndMedicationsHook from "../../../hooks/useFetchAllergiesAndMedicationsHook";
import { prescriptionDoseTypes } from "../../../constants/DropDownConstants";

const InPatientPrescriptionForm = ({ setShowForm }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const admissionNo = queryParams.get("AdmNo"); // Get treatmentNo from URL
  const staffNo = useAuth().userData.no;
  const { combinedList, loadingAllergies } =
    useFetchAllergiesAndMedicationsHook();
  const patientNumber = queryParams.get("PatientNo"); // Get treatmentNo from URL
  const filterAllergies = combinedList?.filter(
    (allergy) => allergy.PatientNo === patientNumber
  );

  const dispatch = useDispatch();
  const { loading: savingPrescription, success: prescriptionSaved } =
    useSelector((state) => state.postInPatientPrescription);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { items } = useSelector((state) => state.getItems);

  useEffect(() => {
    dispatch(getItemsSlice());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getItemUnitsOfMeasureSlice());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getQyPrescriptionLineSlice());
  }, [dispatch]);

  const onFinish = async (values) => {
    const { PrescriptionRemarks, DrugNo, prescriptionDose, dosage, duration } =
      values;

    const prescription = {
      myAction: "create",
      admissionNo: admissionNo, // Send treatmentNo to the backend
      staffNo,
      recId: "",
      drug: DrugNo,
      duration,
      dosage,
      prescriptionDose,
      remarks: PrescriptionRemarks,
    };
    setIsSubmitting(true); // Start the loading simulation
    await dispatch(postInPatientPrescriptionDetails(prescription));
    dispatch(getInPatientQyPrescriptionLineSlice(admissionNo));
    setShowForm(false);
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

  const transformedData = [
    {
      title: "Food Allergies",
      description: filterAllergies
        .map((item) => item.FoodAllergy)
        .filter(Boolean)
        .join(", "),
    },
    {
      title: "Drug Allergies",
      description: filterAllergies
        .map((item) => item.DrugAllergy)
        .filter(Boolean)
        .join(", "),
    },
  ];
  return (
    <>
      <Row gutter={24}>
        {/* drug input card */}
        <Col span={16}>
          <Card title="Prescription Form" style={{ padding: "10px 16px" }}>
            <Form
              layout="vertical"
              validateTrigger="onChange"
              onFinish={onFinish}
              initialValues={{
                Prescriptions: {
                  PrescriptionRemarks: "",
                  DrugNo: "",
                  prescriptionDose: undefined,
                  dosage: undefined,
                  duration: "",
                  admissionNo: admissionNo, // Keep treatmentNo in initial values
                },
              }}
              autoComplete="off"
            >
              <Form.Item
                label="Search Drug Name"
                name="DrugNo"
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
                    placeholder="Select Drug e.g Paracetamol"
                    showSearch
                    suffixIcon={<SearchOutlined />}
                    onSearch={handleSearch}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
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
                  label="Duration (No of Days)"
                  name="duration"
                  hasFeedback
                  className="w-100"
                >
                  <Input
                    type="number"
                    className="w-100"
                    placeholder="Enter Duration eg 3 days"
                  />
                </Form.Item>
              </div>

              <div className="d-block d-flex align-items-center justify-content-between gap-2">
                <Form.Item
                  label="Dosage (eg 2 tablets)"
                  name="dosage"
                  hasFeedback
                  className="w-100"
                >
                  <Input
                    type="number"
                    name="quantity"
                    className="w-100"
                    placeholder="Enter Dosage eg 2 tablets"
                  />
                </Form.Item>
              </div>

              <Form.Item
                label="Prescription Dose"
                name="prescriptionDose"
                hasFeedback
                className="w-100"
              >
                <Select
                  placeholder="Select Prescription Dose"
                  className="w-100"
                  showSearch
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {prescriptionDoseTypes &&
                    prescriptionDoseTypes.map((item) => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Prescription Remarks"
                name="PrescriptionRemarks"
                hasFeedback
              >
                <TextArea
                  autoSize={{ minRows: 3, maxRows: 5 }}
                  name="PrescriptionRemarks"
                />
              </Form.Item>

              <Space>
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
              </Space>
            </Form>
          </Card>
        </Col>
        <Col span={8}>
          <div>
            <Card
              className="card"
              style={{
                width: "100%",
                backgroundColor: "#e5e3e3",
                border: "none",
                padding: "10px",
              }}
            >
              <List
                header={
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "red",
                    }}
                  >
                    Allergies and Chronics
                  </div>
                }
                itemLayout="horizontal"
                loading={loadingAllergies}
                dataSource={transformedData}
                renderItem={(item, index) => (
                  <List.Item
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography.Text className="allergies-item-list-title">
                      {item.title}
                    </Typography.Text>
                    <Typography.Text>{item.description}</Typography.Text>
                  </List.Item>
                )}
              ></List>
            </Card>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default InPatientPrescriptionForm;

InPatientPrescriptionForm.propTypes = {
  setShowForm: PropTypes.func,
};
