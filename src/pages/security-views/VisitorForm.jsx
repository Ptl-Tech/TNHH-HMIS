import {
  Button,
  Card,
  Form,
  Input,
  message,
  Select,
  Spin,
  Typography,
  Row,
  Col,
  notification,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeesList } from "../../actions/DropdownListActions";
import {
  admitVisitor,
  createVisitor,
  getVisitorsList,
} from "../../actions/visitorsActions";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import { read } from "xlsx";
import { checkExistingValue } from "../../actions/Common-Actions/HelperActions";

const VisitorForm = () => {
  const { loading, success, error, data } = useSelector(
    (state) => state.getEmployees
  );
  const {
    loading: regVisitorLoading,
    success: regVisitorSuccess,
    error: regVisitorError,
    data: regVisitorData,
  } = useSelector((state) => state.registerVisitor);

  const {
    loading: admitVisitorLoading,
    success: admitVisitorSuccess,
    error: admitVisitorError,
    data: admitVisitorData,
  } = useSelector((state) => state.admitVisitor);

  const {
    loading: visitorsLoading,
    error: visitorLoading,
    visitors,
  } = useSelector((state) => state.visitorsList);

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [visitorPassCounter, setVisitorPassCounter] = useState(5000); // Start visitor pass number at 5000
  const [isRegistered, setIsRegistered] = useState(false);
  const [loadingVisitorCheck, setLoadingVisitorCheck] = useState(false);
  const [visitorSearchTimeout, setVisitorSearchTimeout] = useState(null);
  const [existingVisitor, setExistingVisitor] = useState(null);
  const [visitorExistsError, setVisitorExistsError] = useState(""); // To store error message for existing visitor check
  const [isEditing, setIsEditing] = useState(false);
  const [newVisitor, setNewVisitor] = useState({
    visitorCategory: null,
    personToVisit: "",
    personToVisitNo: "",
    idNumber: "",
    phoneNumber: "",
    carRegistrationNo: "",
    department: "Reception", // Default value
    visitorName: "",
    visitorPassNo: "",
    purposeOfVisit: "",
    reasonForVisit: "",
    firstName: "",
    middleName: "",
    lastName: "",
  });

  // Generate the visitor pass number using the visitorPassCounter
  const generateVisitorPassNo = () => {
    return `VS_${visitorPassCounter}`;
  };

  const handleInputChange = (name, value) => {
    if (name === "visitorName") {
      const nameParts = value.split(" ").filter(Boolean); // Remove empty strings
      const [firstName, middleName, lastName] = [
        nameParts[0] || "",
        nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "",
        nameParts.length > 1 ? nameParts[nameParts.length - 1] : "",
      ];

      setNewVisitor((prevState) => ({
        ...prevState,
        visitorName: value,
        firstName,
        middleName,
        lastName,
      }));
    } else {
      setNewVisitor((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }

    form.setFieldsValue({ [name]: value });

    // If 'personToVisit' is updated, auto-update 'department'
    if (name === "personToVisit" && data) {
      const selectedEmployee = data.find((employee) => employee.No === value);
      if (selectedEmployee) {
        const updatedDepartment =
          selectedEmployee.Shortcut_Dimension_2_Code || "Reception";
        const personToVisitNo = selectedEmployee.No || "";
        setNewVisitor((prevState) => ({
          ...prevState,
          department: updatedDepartment,
          personToVisitNo: personToVisitNo,
        }));
        form.setFieldsValue({
          department: updatedDepartment,
          personToVisitNo: personToVisitNo,
        });
      }
    }

    setNewVisitor((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !newVisitor.firstName ||
      newVisitor.firstName.trim() === "" ||
      !newVisitor.lastName ||
      newVisitor.lastName.trim() === ""
    ) {
      notification.error({
        // message: "Please enter a valid name",
        description: "First name and Last name are required",
      });

      return;
    }
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    // if (!newVisitor.idNumber) {
    //   message.error("Please enter an ID number.");
    //   return;
    // }
    // Default purpose of visit
    if (!newVisitor.purposeOfVisit || newVisitor.purposeOfVisit.trim() === "") {
      newVisitor.purposeOfVisit = "Reception";
    }

    const existingVisitor = visitors?.find(
      (visitor) =>
        visitor.IDNumber === newVisitor.idNumber &&
        visitor.InitiatedDate.split("T")[0] === today
    );

    if (existingVisitor) {
      if (existingVisitor.Status !== "Cleared") {
        notification.warning({
          message: `Visitor ${existingVisitor.VisitorName} is already checked in.`,
        });
        return;
      }

      // If visitor exists, update their details before admitting
      const updatedVisitorData = {
        myAction: "create",
        // visitorNo: existingVisitor.No, // Keep the existing visitor number
        ...newVisitor,
      };

      try {
        await dispatch(createVisitor(updatedVisitorData)); // Update visitor details
        // message.success("Visitor details updated successfully!");

        // Now admit the visitor (change status)
        await dispatch(admitVisitor(existingVisitor.No));
        // Show success notification
        notification.success({
          message: "Visitor Checked In",
          description: `Visitor checked in successfully! Visitor No: ${existingVisitor.No}`,
        });
        form.resetFields();
        setNewVisitor({
          visitorCategory: null,
          personToVisit: "",
          personToVisitNo: "",
          idNumber: "",
          phoneNumber: "",
          carRegistrationNo: "",
          department: "Reception",
          visitorName: "",
          visitorPassNo: "",
          purposeOfVisit: "",
          reasonForVisit: "",
          firstName: "",
          middleName: "",
          lastName: "",
        });

        setLoadingVisitorCheck(false);
        setVisitorExistsError("");
      } catch (error) {
        console.error("Error updating visitor details:", error);
        message.error("Failed to update visitor details.");
      }
      return;
    }

    //if purpose of visit is not selected set it to other

    // If visitor does not exist, create a new record
    const visitorData = {
      myAction: "create",
      visitorNo: "",
      ...newVisitor,
    };

    try {
      const visitorId = await dispatch(createVisitor(visitorData));
      if (visitorId) {
        message.success("Visitor created successfully!");
        const admitVisitorResponse = await dispatch(admitVisitor(visitorId)); // Admit the newly created visitor
        notification.success(
          `Visitor Number: ${admitVisitorResponse} checked iin successfully!`
        );

        setVisitorPassCounter((prev) => prev + 1);
        form.resetFields();
        setNewVisitor({
          visitorCategory: null,
          personToVisit: "",
          personToVisitNo: "",
          idNumber: "",
          phoneNumber: "",
          carRegistrationNo: "",
          department: "Reception",
          visitorName: "",
          visitorPassNo: "",
          purposeOfVisit: "",
          reasonForVisit: "",
          firstName: "",
          middleName: "",
          lastName: "",
        });
        setLoadingVisitorCheck(false);
        setVisitorExistsError("");
      }
    } catch (error) {
      // console.error("Error creating visitor:", error);
      message.error("Failed to create visitor. Please try again.");
    }
  };

  useEffect(() => {
    dispatch(getEmployeesList());
    dispatch(getVisitorsList());
  }, [dispatch]);

  const handleIdNumberChange = (e) => {
    const value = e.target.value;
    setNewVisitor((prevState) => ({
      ...prevState,
      idNumber: value,
    }));

    // Delay the check to prevent rapid firing of API calls
    if (visitorSearchTimeout) clearTimeout(visitorSearchTimeout);
    setVisitorSearchTimeout(
      setTimeout(() => {
        setLoadingVisitorCheck(true);
        // Simulate checking visitor existence
        const existingVisitor = visitors?.find(
          (visitor) => visitor.IDNumber === value
        );
        if (existingVisitor) {
          message.success("Visitor Information already exists", 5);

          // Extract names from visitorName field
          const nameParts =
            existingVisitor?.VisitorName?.trim().split(/\s+/) || [];
          const firstName = nameParts[0] || "";
          const middleName =
            nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "";
          const lastName =
            nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

          setNewVisitor((prevState) => ({
            ...prevState,
            visitorName: existingVisitor?.VisitorName,
            phoneNumber: existingVisitor.PhoneNumber,
            carRegistrationNo: existingVisitor.CarRegNumber,
            visitorPassNo: generateVisitorPassNo(),
            firstName,
            middleName,
            lastName,
          }));

          form.setFieldsValue({
            visitorName: existingVisitor?.VisitorName,
            phoneNumber: existingVisitor.PhoneNumber,
            carRegistrationNo: existingVisitor.CarRegNumber,
            visitorPassNo: generateVisitorPassNo(),
            firstName,
            middleName,
            lastName,
          });
        } else {
          setVisitorExistsError("Visitor does not exist"); // Set error message
          setNewVisitor((prevState) => ({
            ...prevState,
            visitorName: "",
            phoneNumber: "",
            carRegistrationNo: "",
            // personToVisit: "",
            // personToVisitNo: "",
            // purposeOfVisit: "",
            // visitorCategory: "",
            // reasonForVisit: "",
            visitorPassNo: "",
          }));
          form.setFieldsValue({
            visitorName: "",
            phoneNumber: "",
            carRegistrationNo: "",
            // personToVisit: "",
            // personToVisitNo: "",
            // purposeOfVisit: "",
            // visitorCategory: "",
            // reasonForVisit: "",
            visitorPassNo: "",
          });
        }
        setLoadingVisitorCheck(false);
      }, 500) // Debounce delay (500ms)
    );
  };
  return (
    <div>
      <div className="row p-md-2 gap-4 gap-md-0">
        <Typography.Title level={3} style={{ color: "#003F6D" }}>
          Visitor Card
        </Typography.Title>
        <div className="col-12">
          <Card
            className="card-header"
            style={{ height: "auto", overflow: "auto" }}
          >
            <Typography.Title level={5} style={{ color: "#ac8342" }}>
              Visitor Details
            </Typography.Title>
            <LoadingSkeleton
              loading={admitVisitorLoading}
              rows={3}
              avatar={true}
            >
              <Form form={form} layout="vertical">
                <Row gutter={[16, 16]}>
                  {/* First Row */}
                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      label="Reason for Visit:"
                      name="reasonForVisit"
                      rules={[
                        {
                          required: true,
                          message: "Please select a reason for visit!",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Select category"
                        value={newVisitor.reasonForVisit}
                        onChange={(value) =>
                          handleInputChange("reasonForVisit", value)
                        }
                      >
                        <Select.Option value="1">Medication</Select.Option>
                        <Select.Option value="2">Official</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      label="ID Number:"
                      name="idNumber"
                      rules={[
                        {
                          required: true,
                          message: "Please enter the ID number!",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Enter ID number"
                        value={newVisitor.idNumber || existingVisitor?.IDNumber}
                        onChange={handleIdNumberChange}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      label="Visitor Name:"
                      name="visitorName"
                      rules={[
                        {
                          required: true,
                          message: "Please enter the visitor name!",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Enter visitor name"
                        value={
                          newVisitor.visitorName || existingVisitor?.VisitorName
                        }
                        onChange={(e) =>
                          handleInputChange("visitorName", e.target.value)
                        }
                      />
                    </Form.Item>
                  </Col>

                  {/* Second Row */}
                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      label="Phone Number:"
                      name="phoneNumber"
                      rules={[
                        {
                          required: true,
                          message: "Please enter the phone number!",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Enter phone number"
                        value={
                          newVisitor.phoneNumber || existingVisitor?.PhoneNumber
                        }
                        onChange={(e) =>
                          handleInputChange("phoneNumber", e.target.value)
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      label="Car Registration:"
                      name="carRegistrationNo"
                    >
                      <Input
                        placeholder="Enter car registration"
                        value={
                          newVisitor.carRegistrationNo ||
                          existingVisitor?.CarRegNumber
                        }
                        onChange={(e) =>
                          handleInputChange("carRegistrationNo", e.target.value)
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Form.Item
                      label="Person to See:"
                      name="visitorCategory"
                      rules={[
                        {
                          required: true,
                          message: "Please select a category!",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Select Visitor Category"
                        value={newVisitor.visitorCategory}
                        onChange={(value) =>
                          handleInputChange("visitorCategory", value)
                        }
                      >
                        <Select.Option value="2">Employee</Select.Option>
                        <Select.Option value="1">Patient</Select.Option>
                        <Select.Option value="0">Other</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  {/* Conditional Fields */}
                  {newVisitor.visitorCategory === "1" && (
                    <Col xs={24} sm={12} md={8}>
                      <Form.Item
                        label="Patient Name:"
                        name="patientName"
                        rules={[
                          {
                            required: true,
                            message: "Please enter the patient name!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Enter patient name"
                          value={newVisitor.patientName}
                          onChange={(e) =>
                            handleInputChange("patientName", e.target.value)
                          }
                        />
                      </Form.Item>
                    </Col>
                  )}

                  {newVisitor.visitorCategory === "2" && (
                    <>
                      <Col xs={24} sm={12} md={8}>
                        <Form.Item
                          label="Person to Visit Name:"
                          name="personToVisit"
                          rules={[
                            {
                              required: true,
                              message: "Please select a person!",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Select Name"
                            value={newVisitor.personToVisit}
                            onChange={(value) =>
                              handleInputChange("personToVisit", value)
                            }
                            onFocus={() => dispatch(getEmployeesList())}
                          >
                            {data.map((employee, index) => (
                              <Select.Option key={index} value={employee?.No}>
                                {`${employee.FirstName || ""} ${
                                  employee.MiddleName || ""
                                } ${employee.LastName || ""}`.trim()}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={8}>
                        <Form.Item
                          label="Person to Visit No:"
                          name="personToVisitNo"
                        >
                          <Input
                            placeholder="Enter visitor number"
                            value={newVisitor.personToVisitNo}
                            onChange={(e) =>
                              handleInputChange(
                                "personToVisitNo",
                                e.target.value
                              )
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={8}>
                        <Form.Item label="Department:" name="department">
                          <Input
                            placeholder="Auto-populated department"
                            value={newVisitor.department || "Reception"}
                            readOnly
                          />
                        </Form.Item>
                      </Col>
                    </>
                  )}

                  {newVisitor.visitorCategory === "0" && (
                    <Col xs={24} sm={12} md={8}>
                      <Form.Item
                        label="Purpose of Visit:"
                        name="purposeOfVisit"
                      >
                        <Input
                          placeholder="Enter purpose of visit"
                          value={newVisitor.purposeOfVisit || "Other"}
                          onChange={(e) =>
                            handleInputChange("purposeOfVisit", e.target.value)
                          }
                        />
                      </Form.Item>
                    </Col>
                  )}
                </Row>
              </Form>
            </LoadingSkeleton>
          </Card>
        </div>
        <div className="col-12 my-3">
          <Button
            type="primary"
            htmlType="submit"
            onClick={handleSubmit}
            block
            style={{
              float: "right",
              marginTop: "16px",
              borderRadius: "15px",
              backgroundColor: "#E89641",
              color: "#fff",
              fontSize: "16px",
            }}
          >
            Check In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VisitorForm;
