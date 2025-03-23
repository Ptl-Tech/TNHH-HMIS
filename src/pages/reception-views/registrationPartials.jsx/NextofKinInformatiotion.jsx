import { Typography, Form, Row, Col, Input, Select, Skeleton, Button, Alert } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listKinsRelationships } from "../../../actions/DropdownListActions";
import { saveKinsInformation } from "../../../actions/reception-actions/save-patient-actions/saveKinsInformation";


const NextofKinInformation = ({ patientDetails, onUpdate }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const { loading, success, error, data } = useSelector((state) => state.kinsRelationshipsList);
    const { loading: savingLoading, success: savingSuccess, error: savingError } = useSelector((state) => state.saveKinsInfo);

    useEffect(() => {
        dispatch(listKinsRelationships());
    }, [dispatch]);

    useEffect(() => {
        if (patientDetails) {
            form.resetFields(); // Reset fields to avoid stale state

            // Set gender based on patientDetails.Gender
            const genderValue = patientDetails?.Gender === "Female" ? 2 : patientDetails?.Gender === "Male" ? 1 : 0;
            
            form.setFieldsValue({
                firstName: patientDetails?.Surname?.split(" ")[0] || "",
                middleName: patientDetails?.MiddleName || "",
                lastName: patientDetails?.LastName || "",
                gender: genderValue, // Set gender value here
                dob: patientDetails?.DateOfBirth,
                idNumber: patientDetails?.IDNumber || "",
                phoneNumber: patientDetails?.TelephoneNo1 || "",
                nationality: patientDetails?.nationality || "",
                county: patientDetails?.county || "",
                nextOfKinRelationship: patientDetails?.nextOfKinRelationship || "",
                nextOfKinFullName: patientDetails?.nextOfKinFullName || "",
                nextOfKinPhoneNo: patientDetails?.nextOfKinPhoneNo || "",
                insuranceNo: patientDetails?.insuranceNo || "",
                insuranceName: patientDetails?.insuranceName || "",
                insurancePrinicipalMemberName: patientDetails?.insurancePrinicipalMemberName || "",
                isPrincipleMember: patientDetails?.isPrincipleMember || false,
                membershipNo: patientDetails?.membershipNo || "",
                schemeName: patientDetails?.schemeName || "",
                howYouKnewABoutUs: patientDetails?.howYouKnewABoutUs || "",
                subcounty: patientDetails?.subcounty || "",
                email: patientDetails?.email || "",
                residence: patientDetails?.residence || "",
                patientStatus: patientDetails?.patientStatus || 0, // Default status to 0
            });
        }
    }, [patientDetails, form]);

    const handleSubmission = (values) => {
        // Concatenate firstName, middleName, and lastName to create nextOfKinFullName
        const formattedData = {
            myAction: patientDetails && patientDetails.PatientNo ? "edit" : "create",
            patientNo: patientDetails?.PatientNo || "",
            firstName: patientDetails?.Surname?.split(" ")[0] || "",
            middleName: patientDetails?.MiddleName || "",
            lastName: patientDetails?.LastName || "",
            gender: patientDetails?.Gender === "Male" ? 1 : patientDetails?.Gender === "Female" ? 2 : values.gender === 1 ? "Male" : values.gender === 2 ? "Female" : "",
            dob: patientDetails?.DateOfBirth || "", // Ensure valid date format
            nationality: patientDetails?.nationality || "",
            county: patientDetails?.county || "",
            idNumber: patientDetails?.IDNumber || "",
            phoneNumber: patientDetails?.TelephoneNo1 || "",
            paymentMode: patientDetails?.paymentMode || 0,
            nextOfKinRelationship: values.nextOfKinRelationship || patientDetails?.nextOfKinRelationship || "",
            nextOfKinFullName: values.nextOfKinFullName || patientDetails?.nextOfKinFullName || "",
            nextOfKinPhoneNo: values.nextOfKinPhoneNo || patientDetails?.nextOfKinPhoneNo || "",
            insuranceNo: patientDetails?.insuranceNo || "",
            insuranceName: patientDetails?.insuranceName || "",
            insurancePrinicipalMemberName: patientDetails?.insurancePrinicipalMemberName || "",
            isPrincipleMember: patientDetails?.isPrincipleMember || false,
            membershipNo: patientDetails?.membershipNo || "",
            schemeName: patientDetails?.schemeName || "",
            howYouKnewABoutUs: patientDetails?.howYouKnewABoutUs || "",
            subcounty: patientDetails?.subcounty || "",
            email: patientDetails?.email || "",
            residence: patientDetails?.residence || "",
            patientStatus: patientDetails?.patientStatus || 0, // Default status to 0
        };

        // Dispatch the saveKinDetails action with the formatted data
        dispatch(saveKinsInformation(formattedData));
    };

    return (
        <div>
            <Typography.Title level={5} underline>
                Next of Kin Information
            </Typography.Title>
            {error && <Alert message={error} type="error" showIcon closeText="Close" onClose={() => dispatch({ type: "CLEAR_ERROR" })} />}
      {success && <Alert message="Information saved successfully!" type="success" showIcon closeText="Close" onClose={() => dispatch({ type: "CLEAR_SUCCESS" })} />}

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
                        <Select placeholder="Select Relationship" showSearch>
                            {data && data.length > 0 ? (
                                data.map((relationship) => (
                                    <Select.Option key={relationship.Code} value={relationship.Code}>
                                        {relationship.Description}
                                    </Select.Option>
                                ))
                            ) : (
                                <Select.Option value="" disabled>
                                    {error ? "Failed to load relationships" : "No relationships available"}
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
                    <Button type="primary" htmlType="submit" loading={savingLoading}>
                        Save Next of Kin Details
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default NextofKinInformation;
