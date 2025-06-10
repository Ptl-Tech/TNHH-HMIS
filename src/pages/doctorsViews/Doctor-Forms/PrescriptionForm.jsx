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
import useAuth from "../../../hooks/useAuth";
import PrescriptionTable from "../tables/PrescriptionTable";
import { getQyPrescriptionLineSlice } from "../../../actions/Doc-actions/QyPrescriptionLinesSlice";
import useFetchAllergiesAndMedicationsHook from "../../../hooks/useFetchAllergiesAndMedicationsHook";

const PrescriptionForm = ({ setShowForm }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const treatmentNo = queryParams.get("TreatmentNo"); // Get treatmentNo from URL
  const staffNo = useAuth().userData.no;
  const { combinedList, loadingAllergies } =
    useFetchAllergiesAndMedicationsHook();
  const patientNumber = queryParams.get("PatientNo"); // Get treatmentNo from URL
  const filterAllergies = combinedList?.filter(
    (allergy) => allergy.PatientNo === patientNumber
  );

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

  useEffect(() => {
    dispatch(getQyPrescriptionLineSlice(treatmentNo));
  }, [dispatch, treatmentNo]);

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
      PrescriptionQuantity:
        allValues.Prescriptions?.PrescriptionQuantity || "N/A",
      PrescriptionRemarks:
        allValues.Prescriptions?.PrescriptionRemarks || "N/A",
    };
    setPrescriptionCardData(updatedData);
  };

  const onFinish = async (values) => {
    const {
      PrescriptionRemarks,
      DrugNo,
      UnitOfMeasure,
      Dosage,
      prescriptionDose,
      route,
      noOfDays,
    } = values;

    console.log({ values });

    const prescription = {
      staffNo,
      route: route,
      dosage: Dosage || "",
      drugNo: DrugNo,
      drugGroup: "no",
      myAction: "create",
      noOfDays: noOfDays,
      treatmentNo: treatmentNo,
      remarks: PrescriptionRemarks,
      unitOfMeasure: UnitOfMeasure,
      prescriptionDose: prescriptionDose,
    };
    setIsSubmitting(true); // Start the loading simulation

    await dispatch(postPrescriptionDetails(prescription));
    dispatch(getQyPrescriptionLineSlice());
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
    <Card title="Prescription Form" style={{ padding: "10px 16px" }}>
      <Form
        layout="vertical"
        validateTrigger="onChange"
        onFinish={onFinish}
        onValuesChange={onValuesChange}
        initialValues={{
          PrescriptionNo: treatmentNo,
          PrescriptionQuantity: "",
          PrescriptionRemarks: "",
          DrugGroup: "",
          DrugNo: "",
          UnitOfMeasure: "",
          Dosage: "",
          prescriptionDose: "",
          route: "",
          noOfDays: "",
          treatmentNo: treatmentNo,
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
        <Form.Item
          label="Dosage"
          name="Dosage"
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please enter the Dosage",
            },
          ]}
          className="w-100"
        >
          <Input name="noOfDays" className="w-100" placeholder="Eg. 500mg" />
        </Form.Item>
        <Form.Item
          label="Duration (No of Days)"
          name="noOfDays"
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
          <Input type="number" name="noOfDays" className="w-100" />
        </Form.Item>
        <Form.Item
          label="Frequency per Day"
          name="prescriptionDose"
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
            placeholder="Select Prescription Dose"
            className="w-100"
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
  );
};

export default PrescriptionForm;

PrescriptionForm.propTypes = {
  observationNumber: PropTypes.string.isRequired,
  staffNo: PropTypes.string.isRequired,
};
