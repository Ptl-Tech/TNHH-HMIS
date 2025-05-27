import {
  Typography,
  Form,
  Row,
  Col,
  Input,
  Select,
  Skeleton,
  Button,
  Alert,
} from "antd";
import React, { useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { listKinsRelationships } from "../../../actions/DropdownListActions";
import { saveKinsInformation } from "../../../actions/reception-actions/save-patient-actions/saveKinsInformation";
import useFetchPatientDetailsHook from "../../../hooks/useFetchPatientDetailsHook";
import { getPatientByNo } from "../../../actions/patientActions";

const NextofKinInformation = ({ patientDetails, onUpdate }) => {
  const [form] = Form.useForm();
    const dispatch = useDispatch();
    const[dispatchingInfo,setDispatchingInfo]=useState(false)

  const { loading, success, error, data } = useSelector(
    (state) => state.kinsRelationshipsList
  );
  const {
    loading: savingLoading,
    success: savingSuccess,
    error: savingError,
  } = useSelector((state) => state.saveKinsInfo);
  const { loading: loadingPatientDetails, patients: dataPatient } =
    useSelector((state) => state.patientList) || {};

  useEffect(() => {
    dispatch(listKinsRelationships());
  }, [dispatch]);

  useEffect(() => {
    if (dispatchingInfo && savingSuccess || patientDetails?.PatientNo) {
      dispatch(getPatientByNo(patientDetails.PatientNo));
    }
  }, [dispatchingInfo, savingSuccess, dispatch, patientDetails?.PatientNo]);

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
        gender: genderValue,
        dob: patientDetails?.DateOfBirth,
        idNumber: patientDetails?.IDNumber || "",
        phoneNumber: patientDetails?.TelephoneNo1 || "",
        nationality: patientDetails?.nationality || "",
        county: patientDetails?.county || "",
        nextOfKinRelationship: patientDetails?.NextofkinRelationship || "",
        nextOfKinFullName: patientDetails?.NextOfkinFullName || "",
        nextOfKinPhoneNo: patientDetails?.NextOfkinAddress1 || "",
        paymentMode: patientDetails?.PatientType || 0,
        insuranceNo: patientDetails?.InsuranceNo || "",
        insuranceName: patientDetails?.InsuranceName || "",
        insurancePrinicipalMemberName:
          patientDetails?.insurancePrinicipalMemberName || "",
        isPrincipleMember: patientDetails?.isPrincipleMember || false,
        membershipNo: patientDetails?.MembershipNo || "",
        schemeName: patientDetails?.SchemeName || "",
        howYouKnewABoutUs: patientDetails?.HowyouKnewAboutUs || "",
        subcounty: patientDetails?.SubCountyName || "",
        email: patientDetails?.Email || "",
        residence: patientDetails?.PlaceofBirthVillage || "",
        countyWard: patientDetails?.CountyWardName || "",
      });
    }
  }, [patientDetails, form]);

  const handleSubmission = (values) => {
    // Concatenate firstName, middleName, and lastName to create nextOfKinFullName
    const formattedData = {
      myAction: patientDetails && patientDetails.PatientNo ? "edit" : "create",
      patientNo: patientDetails?.PatientNo || "",  
      nextOfKinRelationship:
        values.nextOfKinRelationship ||
        patientDetails?.NextofkinRelationship ||
        "",
      nextOfKinFullName:
        values.nextOfKinFullName || patientDetails?.NextOfkinFullName || "",
      nextOfKinPhoneNo:
        values.nextOfKinPhoneNo || patientDetails?.NextOfKinPhoneNo || "",
     
    };

    // Dispatch the saveKinDetails action with the formatted data
    dispatch(saveKinsInformation(formattedData));
    setDispatchingInfo(true); // 
    //update with fetch patient details from hook
    onUpdate(dataPatient);
  };

  return (
    <div>
      <Typography.Title level={5} underline>
        Next of Kin Information
      </Typography.Title>
      {savingError && (
        <Alert
          message={error}
          type="error"
          showIcon
          closeText="Close"
          onClose={() => dispatch({ type: "CLEAR_ERROR" })}
        />
      )}
      {savingSuccess && (
        <Alert
          message="Information saved successfully!"
          type="success"
          showIcon
          closeText="Close"
          onClose={() => dispatch({ type: "CLEAR_SUCCESS" })}
        />
      )}

      <Form form={form} layout="vertical" onFinish={handleSubmission}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Full Name"
              name="nextOfKinFullName"
              rules={[{ required: true, message: "Please enter full name" }]}
            >
              <Input placeholder="Enter Full Name" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Relationship"
          name="nextOfKinRelationship"
          rules={[{ required: true, message: "Please select relationship" }]}
        >
          {loading ? (
            <Skeleton.Input active style={{ width: "100%" }} />
          ) : (
            <Select placeholder="Select Relationship" showSearch allowClear 
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            >
              {data && data.length > 0 ? (
                data.map((relationship) => (
                  <Select.Option
                    key={relationship.Code}
                    value={relationship.Code}
                  >
                    {relationship.Description}
                  </Select.Option>
                ))
              ) : (
                <Select.Option value="" disabled>
                  {error
                    ? "Failed to load relationships"
                    : "No relationships available"}
                </Select.Option>
              )}
            </Select>
          )}
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="nextOfKinPhoneNo"
          rules={[{ required: true, message: "Please enter phone number" }]}
        >
          <Input placeholder="Enter Phone Number" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={savingLoading}
            disabled={savingLoading}
          >
            {savingLoading ? "Saving..." : "Save Next of Kin Details"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default NextofKinInformation;
