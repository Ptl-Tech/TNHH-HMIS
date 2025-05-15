import {
  Card,
  Form,
  Row,
  Select,
  Typography,
  Col,
  Input,
  notification,
  Button,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeesList } from "../../actions/DropdownListActions";
import EmployeeSelect from "./EmployeeSelect";
import {
  admitVisitor,
  createVisitor,
  getVisitorById,
} from "../../actions/visitorsActions";
import { checkVisitorStatus } from "../../utils/securityModuleHelpers";
import { use } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const VisitorForm = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const location = useLocation();

  const [visitorCategory, setVisitorCategory] = useState("0");
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [visitorData, setVisitorData] = useState(location.state?.visitorData||null);
  const { loading } = useSelector((state) => state.registerVisitor);
  const { loading: visitorByIdLoading } = useSelector(
    (state) => state.visitorById
  );

  const { loading: admitLoading } = useSelector((state) => state.admitVisitor);

  useEffect(() => {
    const idNumber = form.getFieldValue("idNumber");
    checkVisitorStatus(idNumber, dispatch, setIsCheckedIn, setVisitorData);
  }, [form.getFieldValue("idNumber")]);


  useEffect(() => {
    if (visitorData) {
      form.setFieldsValue({
        idNumber: visitorData.IDNumber || "",
        firstName: visitorData.FirstName || "",
        middleName: visitorData.MiddleName || "",
        lastName: visitorData.LastName || "",
        phoneNumber: visitorData.PhoneNumber || "",
        carRegistrationNo: visitorData.CarRegistrationNo || "",
        personToVisitNo: visitorData.PersonToVisitNo || "",
        department: visitorData.Department || "",
        purposeOfVisit: visitorData.PurposeOfVisit || "",
      });
    }

  }, [form, visitorData]);

  const handleSubmit = async (values) => {
    try {
      const visitorData = { ...values, myAction: "create", visitorNo: "" };

      setTimeout(async () => {
        // Create visitor
        const response = await dispatch(createVisitor(visitorData));
        if (!response) throw new Error("Failed to create visitor.");

        // Admit visitor
        const admitResponse = await dispatch(admitVisitor(response));
        if (!admitResponse) throw new Error("Visitor admission failed.");

        notification.success({
          message: "Success",
          description: `Visitor admitted successfully with ID: ${response}`,
        });

        // Reset form after successful submission
        form.resetFields();
        setVisitorCategory("0");
      }, 500);
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message || "Something went wrong.",
      });
    }
  };

  return (
    <div>
      <Typography.Title level={3} style={{ color: "#003F6D" }}>
        Visitor Card
      </Typography.Title>
      <Card>
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Reason for Visit"
                name="reasonForVisit"
                rules={[
                  {
                    required: true,
                    message: "Please select a reason for visit",
                  },
                ]}
              >
                <Select placeholder="Select Reason for Visit">
                  <Select.Option value="1">Medication</Select.Option>
                  <Select.Option value="2">Official</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="ID Number" name="idNumber" rules={[{ required: true, message: "Please enter ID Number" }]}>
                <Input placeholder="Enter ID Number" type="text" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Visitor Category" name="visitorCategory" rules={[{ required: true, message: "Please select a visitor category" }]}>
                <Select
                  placeholder="Select Visitor Category"
                  onChange={(value) => {
                    setVisitorCategory(value);
                    // Auto-set "Reception" for Employee or Patient
                    if (value === "1" || value === "2") {
                      form.setFieldsValue({
                        purposeOfVisit: "Official",
                        department: "Official",
                      });
                    } else {
                      form.setFieldsValue({
                        purposeOfVisit: "",
                        department: "Reception",
                      }); // Clear input for 'Other'
                    }
                  }}
                >
                  <Select.Option value="2">Employee</Select.Option>
                  <Select.Option value="1">Patient</Select.Option>
                  <Select.Option value="0">Other</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: "Please enter First Name" }]}>
                <Input placeholder="Enter First Name" type="text" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Middle Name" name="middleName" >
                <Input placeholder="Enter Middle Name" type="text" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: "Please enter Last Name" }]}>
                <Input placeholder="Enter Last Name" type="text" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
          <Col span={8}>
          <Form.Item
  label="Phone Number"
  name="phoneNumber"
  rules={[
    {
      required: true,
      message: "Please enter Phone Number",
    },
    {
      pattern: /^[0-9]{1,15}$/,
      message: "Phone number must contain only digits and be at most 15 digits long",
    },
  ]}
>
  <Input
    placeholder="Enter Phone Number"
    type="text"
    maxLength={15}
  />
</Form.Item>

</Col>

            <Col span={8}>
              <Form.Item label="Car Registration No" name="carRegistrationNo">
                <Input placeholder="Enter Car Registration No" type="text" />
              </Form.Item>
            </Col>

            {/* Only show these fields if the visitor category is an employee */}
            {visitorCategory === "2" && (
              <>
                <Col span={8}>
                  <Form.Item label="Person To Visit" name="personToVisitNo">
                    <EmployeeSelect
                      onChange={(personToVisitNo, department) =>
                        form.setFieldsValue({ personToVisitNo, department })
                      }
                    />
                  </Form.Item>
                </Col>
              </>
            )}
            <Col span={8}>
              <Form.Item label="Department" name="department">
                <Input placeholder="Enter Department" type="text" />
              </Form.Item>
            </Col>
            {/* Show Purpose of Visit only if visitor category is 'Other' */}
            <Col span={8}>
              <Form.Item label="Reason For Visit" name="purposeOfVisit">
                <Input placeholder="Enter Purpose" type="text" />
              </Form.Item>
            </Col>
            {/* Show patient input field when visitor category is 'Patient' */}
            {visitorCategory === "1" && (
              <Col span={8}>
                <Form.Item label="Patient Name" name="personToVisit">
                  <Input placeholder="Enter Patient Name" type="text" />
                </Form.Item>
              </Col>
            )}
          </Row>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={admitLoading || loading}
              disabled={admitLoading || loading || isCheckedIn}
              block
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default VisitorForm;
