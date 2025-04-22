import { Alert, Button, Col, Form, Input, Row, Select, Typography } from "antd";
import React, { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { marketingStrategies } from "../../../actions/DropdownListActions";
import { saveMarketingInformation } from "../../../actions/reception-actions/save-patient-actions/saveMarketingInformation";
import moment from "moment";
import { getPatientByNo } from "../../../actions/patientActions";

const MarketingInformation = ({ patientDetails, onUpdate }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const { loading, success, error } = useSelector(
    (state) => state.saveMarketingInfo
  );
  const {
    loading: marketingStrategiesLoading,
    error: marketingStrategiesError,
    success: marketingStrategiesSuccess,
    data: marketingStrategiesPayload,
  } = useSelector((state) => state.marketingList);
  const { loading: loadingPatientDetails, patients: data } =
    useSelector((state) => state.patientList) || {};

  useEffect(() => {
    form.setFieldsValue(patientDetails);
  }, [form, patientDetails]);

  useEffect(() => {
    dispatch(marketingStrategies());
  }, [success, form]);
  useEffect(() => {
    if (success && patientDetails?.PatientNo) {
      dispatch(getPatientByNo(patientDetails?.PatientNo));
    }
  }, [success, dispatch, patientDetails?.PatientNo]);

  useEffect(() => {
    if (patientDetails) {
      form.resetFields(); // Reset fields to avoid stale state
      form.setFieldsValue({
        firstName: patientDetails?.Surname?.split(" ")[0] || "",
        middleName: patientDetails?.MiddleName || "",
        lastName: patientDetails?.LastName || "",
        gender:
          patientDetails?.Gender === "Male"
            ? 1
            : patientDetails?.Gender === "Female"
            ? 2
            : "",
        dob: patientDetails?.DateOfBirth
          ? moment(patientDetails.DateOfBirth)
          : null,
        idNumber: patientDetails?.IDNumber || "",
        phoneNumber: patientDetails?.TelephoneNo1 || "",
        nationality: patientDetails?.Nationality || "",
        county: patientDetails?.PlaceofBirthDistrict || "",
        nextOfKinRelationship: patientDetails?.NextofkinRelationship || "",
        nextOfKinFullName: patientDetails?.NextOfkinFullName || "",
        nextOfKinPhoneNo: patientDetails?.NextOfkinAddress1 || "",
        paymentMode:
          patientDetails?.PatientType === "Corporate"
            ? 1
            : patientDetails?.PatientType === "Cash"
            ? 2
            : 1, // Ensure integer assignment        insuranceNo: patientDetails?.InsuranceNo || "",
        insuranceName: patientDetails?.InsuranceName || "",
        insurancePrinicipalMemberName:
          patientDetails?.PrincipalMemberName || "",
        isPrincipleMember: patientDetails?.Principal || false,
        membershipNo: patientDetails?.MembershipNo || "",
        schemeName: patientDetails?.SchemeName || "",
        howYouKnewABoutUs: patientDetails?.HowyouKnewAboutUs || "",
        subcounty: patientDetails?.SubCountyName || "",
        email: patientDetails?.Email || "",
        residence: patientDetails?.PlaceofBirthVillage || "",
        countyWard: patientDetails?.Ward || "",
      });
    }
  }, [patientDetails, form]);

  const handleSubmission = (values) => {
    setFormSubmitted(true);
    const formattedData = {
      myAction: patientDetails && patientDetails.PatientNo ? "edit" : "create",
      patientNo: patientDetails?.PatientNo || "",
      firstName: patientDetails?.Surname?.split(" ")[0] || "",
      middleName: patientDetails?.MiddleName || "",
      lastName: patientDetails?.LastName || "",
      gender:
        patientDetails?.Gender === "Male"
          ? 1
          : patientDetails?.Gender === "Female"
          ? 2
          : "",
      dob: patientDetails?.DateOfBirth
        ? moment(patientDetails.DateOfBirth).format("YYYY-MM-DD")
        : "", // Ensure valid date format
      nationality: patientDetails?.Nationality || "",
      county: patientDetails?.PlaceofBirthDistrict || "",
      idNumber: patientDetails.IDNumber || "", // Accessing idNumber from the values
      phoneNumber: patientDetails?.TelephoneNo1 || "",
      paymentMode:
      patientDetails?.PatientType === "Corporate"
        ? 1
        : patientDetails?.PatientType === "Cash"
        ? 2
        : patientDetails?.PatientType || 0,
    
      nextOfKinRelationship: patientDetails?.NextofkinRelationship || "",
      nextOfKinFullName: patientDetails?.NextOfkinFullName || "",
      nextOfKinPhoneNo: patientDetails?.NextOfkinAddress1 || "",
      insuranceNo: patientDetails?.InsuranceNo || "",
      insuranceName: patientDetails?.InsuranceName || "",
      insurancePrinicipalMemberName: patientDetails?.PrincipalMemberName || "",
      isPrincipleMember: patientDetails?.Principal || false,
      membershipNo: patientDetails?.MembershipNo || "",
      schemeName: patientDetails?.SchemeName || "",
      howYouKnewABoutUs:
        values.howYouKnewABoutUs || patientDetails?.HowyouKnewAboutUs || "",
      subcounty: patientDetails?.SubCountyName || "",
      email: patientDetails?.Email || "",
      residence: patientDetails?.PlaceofBirthVillage || "",
    };

    // Dispatch to save or update patient data
    dispatch(saveMarketingInformation(formattedData));
    onUpdate(data);
  };

  return (
    <div>
      <Typography.Title level={5} underline>
        Marketing Information
      </Typography.Title>
       {error && formSubmitted && (
              <Alert
                message={error}
                type="error"
                showIcon
                closeText="Close"
                onClose={() => {
                  setFormSubmitted(false); 
                  dispatch({ type: "CLEAR_ERROR" });
                }}
              />
            )}
      {success && formSubmitted && (
  <Alert
    message="Marketing information saved successfully!"
    type="success"
    showIcon
    closeText="Close"
    onClose={() => {
      setFormSubmitted(false); 
      dispatch({ type: "CLEAR_SUCCESS" });
    }}
  />
)}

      <Form form={form} layout="vertical" onFinish={handleSubmission}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="How did you hear about us?"
              name="howYouKnewABoutUs"
              rules={[
                {
                  required: true,
                  message: "Please select a marketing strategy!",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Select a marketing strategy"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {marketingStrategiesPayload &&
                  marketingStrategiesPayload.map((item) => (
                    <Select.Option key={item.Code} value={item.Code}>
                      {item.Description}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default MarketingInformation;
