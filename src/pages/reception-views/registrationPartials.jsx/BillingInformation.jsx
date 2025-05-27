import {
  Col,
  Form,
  Row,
  Select,
  Typography,
  Input,
  Switch,
  Skeleton,
  Button,
  Alert,
} from "antd";
import React, { useEffect, useState } from "react";
import { listInsuranceOptions } from "../../../actions/DropdownListActions";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { saveBillingInformation } from "../../../actions/reception-actions/save-patient-actions/saveBillingInformation";
import { getPatientByNo } from "../../../actions/patientActions";

const BillingInformation = ({ patientDetails, onUpdate }) => {
  const dispatch = useDispatch(); // Declare the dispatch function
  const [form] = Form.useForm();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isPrincipleMember, setIsPrincipleMember] = useState(false);
const[dispatchingInfo,setDispatchingInfo]=useState(false)

  const { loading: loadingPatientDetails, patients: data } =
    useSelector((state) => state.patientList) || {};

  const { loading, success, error } = useSelector(
    (state) => state.saveBillingInfo
  );

  const {
    loading: insuranceLoading,
    error: insuranceError,
    success: insuranceSuccess,
    data: insurancePayload,
  } = useSelector((state) => state.getInsurance);

  useEffect(() => {
    dispatch(listInsuranceOptions());
  }, [dispatch]);

  useEffect(() => {
    if (dispatchingInfo && success || patientDetails?.PatientNo) {
      dispatch(getPatientByNo(patientDetails?.PatientNo));
    }
  }, [success, dispatch, patientDetails?.PatientNo]);

  console.log(patientDetails);

  useEffect(() => {
    if (patientDetails) {
      form.resetFields(); // Reset fields to avoid stale state
      const initialPaymentMode =
        patientDetails?.PatientType === "Corporate"
          ? 1
          : patientDetails?.PatientType === "Cash"
          ? 2
          : null;
      const isPrincipal = patientDetails?.Principal || false;
      setIsPrincipleMember(isPrincipal);

      const fullName = `${patientDetails?.Surname || ""} ${
        patientDetails?.MiddleName || ""
      } ${patientDetails?.LastName || ""}`.trim();

      setPaymentMethod(initialPaymentMode); // Set state for conditional rendering

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
        nextOfKinPhoneNo: patientDetails?.NextOfKinPhoneNo || "",
        paymentMode:
          patientDetails?.PatientType === "Corporate"
            ? 1
            : patientDetails?.PatientType === "Cash"
            ? 2
            : 2,
        insuranceName: patientDetails?.InsuranceName || "",
        isPrincipleMember: isPrincipal,
        insurancePrinicipalMemberName: isPrincipal
          ? fullName
          : patientDetails?.PrincipalMemberName || "",
        insuranceNo: patientDetails?.InsuranceNo || "",
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
    setFormSubmitted(true);

    const formattedData = {
      myAction: patientDetails && patientDetails.PatientNo ? "edit" : "create",
      patientNo: patientDetails?.PatientNo || "",      
      paymentMode: values.paymentMode,
      insuranceNo: values.insuranceNo || patientDetails?.InsuranceNo || "",
      insuranceName:
        values.insuranceName || patientDetails?.InsuranceName || "",
      insurancePrinicipalMemberName:
        values.insurancePrinicipalMemberName ||
        patientDetails?.PrincipalMemberName ||
        "",
      isPrincipleMember:
        values.isPrincipleMember || patientDetails.isPrincipleMember || false,
      membershipNo: values.membershipNo || patientDetails?.MembershipNo || "",
      schemeName: values.schemeName || patientDetails?.SchemeName || "",
      

    };

    // Dispatch to save or update patient data
    dispatch(saveBillingInformation(formattedData));
    setDispatchingInfo(true); // Set dispatching state to true
    onUpdate(data);

    //clear success state after submission
    dispatch({ type: "CLEAR_SUCCESS" });
  };

  return (
    <div>
      <Typography.Title level={5} underline>
        Billing Information
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
          message="Patient Billing data saved successfully!"
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
              label="Choose Payment Method"
              name="paymentMode"
              rules={[
                { required: true, message: "Please select a payment method!" },
              ]}
            >
              <Select
                placeholder="Select payment method"
                onChange={(value) => setPaymentMethod(value)}
              >
                <Select.Option value={2}>Cash</Select.Option>
                <Select.Option value={1}>Corporate</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          {paymentMethod === 1 && (
            <Col span={12}>
              <Form.Item
                label="Select Insurance Name"
                name="insuranceName" // Name for insurance name field
                rules={[
                  { required: true, message: "Please enter insurance name!" },
                ]}
              >
                {insuranceLoading ? (
                  <Skeleton.Input active size="large" />
                ) : (
                  <Select
                    showSearch
                    placeholder="Select insurance name"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    onChange={(value, option) => {
                      // Set both insuranceName and insuranceNo using form.setFieldsValue()
                      form.setFieldsValue({
                        insuranceName: option.children, // Set insurance name (option name)
                        insuranceNo: value, // Set insurance number (option value)
                      });

                      console.log("Selected Insurance:", option.children);
                      console.log("Selected Insurance No:", value);
                    }}
                  >
                    {insurancePayload?.map((option) => (
                      <Select.Option key={option.No} value={option.No}>
                        {option.Name}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>

              <Form.Item
                label="Insurance No"
                name="insuranceNo" // Name for insurance number field
                rules={[
                  { required: true, message: "Please select insurance!" },
                ]}
                style={{ display: "none" }}
              >
                {/* Disabled input field to display the selected insurance number */}
                <Input disabled />
              </Form.Item>
            </Col>
          )}
        </Row>
        {paymentMethod === 1 && (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Membership No"
                  name="membershipNo"
                  rules={[
                    {
                      required: true,
                      message: "Please enter membership number!",
                    },
                  ]}
                >
                  <Input placeholder="Enter membership number" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Scheme Name"
                  name="schemeName"
                  rules={[
                    { required: true, message: "Please enter scheme name!" },
                  ]}
                >
                  <Input placeholder="Enter scheme name" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Principal Member Name"
                  name="insurancePrinicipalMemberName"
                  rules={[
                    {
                      required: true,
                      message: "Please enter principal member name!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter principal member name"
                    disabled={isPrincipleMember}
                    className="fw-bold"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Is Patient Principal Member"
                  name="isPrincipleMember"
                  valuePropName="checked"
                >
                  <Switch
                    checkedChildren="Yes"
                    unCheckedChildren="No"
                    checked={isPrincipleMember}
                    onChange={(value) => {
                      setIsPrincipleMember(value);

                      if (value) {
                        // Patient is principal — set their full name
                        const fullName = `${patientDetails?.Surname || ""} ${
                          patientDetails?.MiddleName || ""
                        } ${patientDetails?.LastName || ""}`.trim();
                        form.setFieldsValue({
                          insurancePrinicipalMemberName: fullName,
                        });
                      } else {
                        // Patient is NOT principal — show principal name from DB
                        form.setFieldsValue({
                          insurancePrinicipalMemberName:
                            patientDetails?.PrincipalMemberName || "",
                        });
                      }
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
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

export default BillingInformation;
