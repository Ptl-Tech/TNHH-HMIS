import React, { useEffect } from "react";
import {
  Form,
  Input,
  Typography,
  Radio,
  DatePicker,
  Col,
  Row,
  Button,
  Alert,
  Spin,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { saveGeneralInformation } from "../../../actions/reception-actions/save-patient-actions/saveGeneralInformation";
import useFetchPatientDetailsHook from "../../../hooks/useFetchPatientDetailsHook";
import { getPatientByNo } from "../../../actions/patientActions";
import { useState } from "react";

const GeneralInformation = ({ patientDetails, onUpdate }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { loading, success, error, data } = useSelector(
    (state) => state.savegeneralInfo
  );
  const { loading: loadingPatientDetails, patients: dataPatient } =
    useSelector((state) => state.patientList) || {};
  const [patientNo, setPatientNo] = useState("");
  const [isEditingDOB, setIsEditingDOB] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    if (success && data?.patientNo) {
      setPatientNo(data.patientNo);
      dispatch(getPatientByNo(data.patientNo)); // Fetch new details
    }
  }, [success, data, dispatch]);

  // Update form values when patientDetails change
  useEffect(() => {
    if (patientDetails) {
      form.resetFields(); // Reset fields to avoid stale state
      const genderValue =
      patientDetails?.Gender === "Female"
        ? 2
        : patientDetails?.Gender === "Male"
        ? 1
        : 0;
      form.setFieldsValue({
        firstName: patientDetails?.Surname?.split(" ")[0] || "",
        middleName: patientDetails?.MiddleName || "",
        lastName: patientDetails?.LastName || "",
      gender:genderValue,
        dateOfBirth: patientDetails?.DateOfBirth
          ? moment(patientDetails.DateOfBirth)
          : null,
        idNumber: patientDetails?.IDNumber || "",
        phoneNumber: patientDetails?.TelephoneNo1 || "",
        nationality: patientDetails?.Nationality || "",
        county: patientDetails?.county || "",
        nextOfKinRelationship: patientDetails?.NextofkinRelationship || "",
        nextOfKinFullName: patientDetails?.NextOfkinFullName || "",
        nextOfKinPhoneNo: patientDetails?.nextOfKinPhoneNo || "",
        insuranceNo: patientDetails?.InsuranceNo || "",
        insuranceName: patientDetails?.InsuranceName || "",
        insurancePrinicipalMemberName:
          patientDetails?.PrincipalMemberName || "",
        isPrincipleMember: patientDetails?.isPrincipleMember || false,
        membershipNo: patientDetails?.MembershipNo || "",
        schemeName: patientDetails?.SchemeName || "",
        howYouKnewABoutUs: patientDetails?.HowyouKnewAboutUs || "",
        subcounty: patientDetails?.SubCountyName || "",
        email: patientDetails?.Email || "",
        residence: patientDetails?.PlaceofBirthVillage || "",
        countyWard: patientDetails?.CountyWardName || "",
        patientStatus: patientDetails?.PatientStatus || 0,
      });
    }
  }, [patientDetails, form]);

  const handleSubmission = (values) => {
    setFormSubmitted(true);

    const formattedData = {
      myAction: patientDetails && patientDetails.PatientNo ? "edit" : "create",
      patientNo: patientDetails?.PatientNo || "",
      firstName:
        values.firstName || patientDetails?.Surname?.split(" ")[0] || "",
      middleName: values.middleName || patientDetails?.MiddleName || "",
      lastName: values.lastName || patientDetails?.LastName || "",
     gender: values.gender || patientDetails?.Gender || 0,
      dob: values.dateOfBirth
        ? values.dateOfBirth.format("YYYY-MM-DD")
        : patientDetails?.DateOfBirth || "",

      nationality: patientDetails?.Nationality || "",
      county: patientDetails?.PlaceofBirthDistrict || "",
      idNumber: values.idNumber || patientDetails?.IDNumber || "",
      phoneNumber: values.phoneNumber || "",
      paymentMode: patientDetails?.paymentMode || 0,
      nextOfKinRelationship: patientDetails?.NextofkinRelationship || "",
      nextOfKinFullName: patientDetails?.NextOfkinFullName || "",
      nextOfKinPhoneNo: patientDetails?.NextOfKinPhoneNo || "",
      insuranceNo: patientDetails?.InsuranceNo || "",
      insuranceName: patientDetails?.InsuranceName || "",
      insurancePrinicipalMemberName:
        patientDetails?.insurancePrinicipalMemberName || "",
      isPrincipleMember: patientDetails?.isPrincipleMember || false,
      membershipNo: patientDetails?.MembershipNo || "",
      schemeName: patientDetails?.SchemeName || "",
      howYouKnewABoutUs: patientDetails?.HowyouKnewAboutUs || "",
      subcounty: patientDetails?.SubCountyName || "",
      email: values.email || patientDetails?.Email || "",
      residence: patientDetails?.PlaceofBirthVillage || "",
      countyWard: patientDetails?.CountyWardName || "",
      patientStatus: 0,
    };

    dispatch(saveGeneralInformation(formattedData));

    onUpdate(data);
  };

  return (
    <div>
      <Typography.Title level={5} underline>
        Basic Information
      </Typography.Title>

      {/* Display alerts for errors and success messages */}
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
          message={"Data saved successfully"}
          type="success"
          showIcon
          closeText="Close"
          onClose={() => {
            setFormSubmitted(false); 
            dispatch({ type: "CLEAR_SUCCESS" });
          }}        />
      )}

      <Form layout="vertical" form={form} onFinish={handleSubmission}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: "Please enter first name" }]}
            >
              <Input placeholder="Enter First Name" autoComplete="off" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Middle Name" name="middleName">
              <Input placeholder="Enter Middle Name" autoComplete="off" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true, message: "Please enter last name" }]}
            >
              <Input placeholder="Enter Last Name" autoComplete="off" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Gender"
          name="gender"
          rules={[{ required: true, message: "Please select gender" }]}
        >
          <Radio.Group style={{ width: "100%" }}>
            <Radio value={1}>Male</Radio>
            <Radio value={2}>Female</Radio>
            <Radio value={0}>Other</Radio>
          </Radio.Group>
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Date of Birth"
              name="dateOfBirth"
              rules={[
                { required: true, message: "Please enter date of birth" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="ID Number"
              name="idNumber"
              rules={[{ required: true, message: "Please enter ID number" }]}
            >
              <Input placeholder="Enter ID Number" autoComplete="off" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              rules={[{ required: true, message: "Please enter phone number" }]}
            >
              <Input placeholder="Enter Phone Number" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Form.Item label="Email" name="email">
              <Input placeholder="Enter Email" autoComplete="off" />
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
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default GeneralInformation;
