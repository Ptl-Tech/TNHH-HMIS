import {
  Button,
  Card,
  Form,
  Input,
  message,
  Select,
  Spin,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeesList } from "../actions/DropdownListActions";
import { admitVisitor, createVisitor, getVisitorsList } from "../actions/visitorsActions";

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
  const[existingVisitor, setExistingVisitor] = useState(null);
  const [visitorExistsError, setVisitorExistsError] = useState(""); // To store error message for existing visitor check
  const [isEditing, setIsEditing] = useState(false);
  const [newVisitor, setNewVisitor] = useState({
    visitorCategory: null,
    personToVisit: "",
    personToVisitNo: "",
    idNumber: "",
    phoneNumber: "",
    carRegistrationNo: "",
    department: "",
    visitorName: "",
    visitorPassNo: "",
    purposeOfVisit: "",
  });

  // Generate the visitor pass number using the visitorPassCounter
  const generateVisitorPassNo = () => {
    return `VS_${visitorPassCounter}`;
  };

  const handleInputChange = (name, value) => {
    setNewVisitor((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // If 'personToVisit' is updated, auto-update 'department'
    if (name === "personToVisit" && data) {
      const selectedEmployee = data.find((employee) => employee.No === value);
      if (selectedEmployee) {
        const updatedDepartment =
          selectedEmployee.Shortcut_Dimension_2_Code || "";
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

    if (name === "visitorName") {
      // Only generate if category is 'Employee'
      setNewVisitor((prevState) => ({
        ...prevState,
        visitorPassNo: generateVisitorPassNo(), // Generate a new visitor pass number
      }));
      form.setFieldsValue({ visitorPassNo: generateVisitorPassNo() });
    }

    // Additional logic for autopopulating fields
    if (name === "reasonForVisit") {
      if (value === "1") {
        // Medication
        setNewVisitor((prevState) => ({
          ...prevState,
          purposeOfVisit: "Medication",
          visitorCategory: "",
          personToVisit: "",
        }));

        form.setFieldsValue({
          purposeOfVisit: "Medication",
          visitorCategory: "",
          personToVisit: "",
        });
        message.info("Purpose of visit set to Medication.");
      }
    }
  };

  const handleSubmit = async () => {
    if ( !newVisitor.reasonForVisit) {
      message.error("Please complete all required fields.");
      return;
    }

    if (newVisitor.visitorCategory === "0") {
      newVisitor.personToVisit = "";
    }

    const visitorData = {
      myAction: "create",
      visitorNo: "",
      ...newVisitor,
    };

    const visitorId = await dispatch(createVisitor(visitorData));
    console.log("Visitor created with ID:", visitorId);
    if (visitorId) {
      message.success("Visitor created successfully!");
      dispatch(admitVisitor(visitorId));
      setVisitorPassCounter((prev) => prev + 1); // Increment counter
      form.resetFields(); // Reset form fields
      setNewVisitor({
        visitorCategory: null,
        personToVisit: "",
        personToVisitNo: "",
        idNumber: "",
        phoneNumber: "",
        carRegistrationNo: "",
        department: "",
        visitorName: "",
        visitorPassNo: "",
        purposeOfVisit: "",
        reasonForVisit: "",
      });

      setVisitorExistsError("");
    }
  };

  useEffect(() => {
    dispatch(getEmployeesList());
dispatch(getVisitorsList());
    console.log(visitors);
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
          // Fill in the details if the visitor exists
setExistingVisitor(existingVisitor);

          setNewVisitor((prevState) => ({
            ...prevState,
            visitorName: existingVisitor.VisitorName,
            phoneNumber: existingVisitor.PhoneNumber,
            carRegistrationNo: existingVisitor.CarRegNumber,
            personToVisit: existingVisitor.PersonToSee,
            personToVisitNo: existingVisitor.PersonToVisitNo,
            purposeOfVisit: existingVisitor.PurposeOfVisit,
            visitorCategory: existingVisitor.VisitorCategory,
            reasonForVisit: existingVisitor.ReasonForVisit,
            visitorPassNo: generateVisitorPassNo(),
          }));
          form.setFieldsValue({
            visitorName: existingVisitor.VisitorName,
            phoneNumber: existingVisitor.PhoneNumber,
            carRegistrationNo: existingVisitor.CarRegNumber,
            personToVisit: existingVisitor.PersonToSee,
            personToVisitNo: existingVisitor.PersonToVisitNo,
            purposeOfVisit: existingVisitor.PurposeOfVisit,
            visitorCategory: existingVisitor.VisitorCategory,
            reasonForVisit: existingVisitor.ReasonForVisit,
            visitorPassNo: generateVisitorPassNo(),
          });
          setVisitorExistsError("Patient already exists"); // Clear any previous error
        } else {
          setVisitorExistsError("Visitor does not exist"); // Set error message
          form.resetFields();
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
        <div className="col-12 col-md-6">
          <Card
            className="card-header"
            style={{ height: "500px", overflow: "auto" }}
          >
            <Typography.Title level={5} style={{ color: "#ac8342" }}>
              Personal Details
            </Typography.Title>
            <Form form={form} layout="vertical">
              <Form.Item
                label="Reason for visit:"
                name="reasonForVsit"
                rules={[
                  { required: true, message: "Please select a category!" },
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
              <Form.Item
                label="ID Number:"
                name="idNumber"
                rules={[
                  { required: true, message: "Please enter the ID number!" },
                ]}
                help={
                  visitorExistsError && (
                    <span
                      style={{
                        color:
                          visitorExistsError === "Patient already exists"
                            ? "green"
                            : "red",
                      }}
                    >
                      {visitorExistsError}
                    </span>
                  )
                }
              >
                <Input
                  placeholder="Enter ID number"
                  value={newVisitor.idNumber || existingVisitor?.IDNumber}
                  onChange={handleIdNumberChange}
                  suffix={
                    loadingVisitorCheck ? (
                      <span style={{ marginLeft: 8 }}>
                        <span className="loading-dots">...</span>
                      </span>
                    ) : (
                      <span />
                    )
                  }
                />
              </Form.Item>
              <Form.Item
                label="Visitor's Name:"
                name="visitorName"
                rules={[{ required: true, message: "Please enter the name!" }]}
              >
                <Input
                  placeholder="Enter name"
                  value={newVisitor.visitorName || existingVisitor?.VisitorName}
                  onChange={(e) =>
                    handleInputChange("visitorName", e.target.value)
                  }
                />
              </Form.Item>
              <Form.Item
                label="Phone Number:"
                name="phoneNumber"
                rules={[
                  { required: true, message: "Please enter the phone number!" },
                ]}
              >
                <Input
                  placeholder="Enter phone number"
                  value={newVisitor.phoneNumber || existingVisitor?.PhoneNumber}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                />
              </Form.Item>
              <Form.Item
                label="Car Registration:"
                name="carRegistrationNo"
                rules={[
                  {
                    required: false,
                    message: "Please enter the car registration number!",
                  },
                ]}
              >
                <Input
                  placeholder="Enter car registration number"
                  value={newVisitor.carRegistrationNo || existingVisitor?.CarRegNumber}
                  onChange={(e) =>
                    handleInputChange("carRegistrationNo", e.target.value)
                  }
                />
              </Form.Item>
              {/* <Form.Item
                label="Visitor Pass No:"
                name="visitorPassNo"
                rules={[{ required: true }]}
              >
                <Input
                  value={newVisitor.visitorPassNo}
                  onChange={(e) =>
                    handleInputChange("visitorPassNo", e.target.value)
                  }
                  readOnly
                  disabled
                />
              </Form.Item> */}
            </Form>
          </Card>
        </div>
        <div className="col-12 col-md-6">
          <Card
            className="card-header"
            style={{ height: "500px", overflow: "auto" }}
          >
            <Typography.Title level={5} style={{ color: "#ac8342" }}>
              Person to Visit Information
            </Typography.Title>

            <Form form={form} layout="vertical">
              <Form.Item
                label="Visitor Category:"
                name="visitorCategory"
                rules={[
                  { required: true, message: "Please select a category!" },
                ]}
              >
                <Select
                  placeholder="Select Visitor Category"
                  value={
                    newVisitor.reasonForVisit !== "2"
                      ? undefined
                      : newVisitor.visitorCategory
                  } // Clear value if reasonForVisit is Medication
                  onChange={(value) =>
                    handleInputChange("visitorCategory", value)
                  }
                  disabled={
                    newVisitor.reasonForVisit !== "2" && !visitorExistsError
                  }
                >
                  <Select.Option value="2">Employee</Select.Option>
                  <Select.Option value="1">Patient</Select.Option>
                  <Select.Option value="0">Other</Select.Option>
                </Select>
              </Form.Item>
              {/* Conditional rendering for Person to Visit */}
              {newVisitor.visitorCategory === "2" && (
                <Form.Item
                  label="Person to visit Name:"
                  name="personToVisit"
                  rules={[
                    { required: true, message: "Please select a person!" },
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
                    <Select.Option value="">--Select Name--</Select.Option>
                    {data && data.length > 0 ? (
                      data.map((employee, index) => (
                        <Select.Option key={index} value={employee?.No}>
                          {`${employee.FirstName || ""} ${
                            employee.MiddleName || ""
                          } ${employee.LastName || ""}`.trim()}
                        </Select.Option>
                      ))
                    ) : (
                      <Select.Option value="" disabled>
                        No data available
                      </Select.Option>
                    )}
                  </Select>
                </Form.Item>
              )}

              {newVisitor.visitorCategory !== "2" && (
                <Form.Item
                  label="Person to Visit Name:"
                  name="personToVisit"
                  rules={[
                    { required: true, message: "Please enter the name!" },
                  ]}
                >
                  <Input
                    placeholder="Enter name"
                    value={newVisitor.personToVisit}
                    onChange={(e) =>
                      handleInputChange("personToVisit", e.target.value)
                    }
                    disabled={
                      newVisitor.visitorCategory !== "1" &&
                      newVisitor.visitorCategory !== "0"
                    }
                  />
                </Form.Item>
              )}

              <Form.Item
                label="Person to visit No:"
                name="personToVisitNo"
                rules={[
                  {
                    required: true,
                    message: "!",
                  },
                ]}
              >
                <Input
                  placeholder="Enter visitor number"
                  value={newVisitor.personToVisitNo}
                  onChange={(e) =>
                    handleInputChange("personToVisitNo", e.target.value)
                  }
                  disabled={newVisitor.visitorCategory !== "2"}
                />
              </Form.Item>
              <Form.Item
                label="Person to visit Department:"
                name="department"
                rules={[
                  { required: true, message: "Please enter the department!" },
                ]}
              >
                <Input
                  placeholder="Auto-populated department"
                  name="department"
                  value={newVisitor.department}
                  onChange={(e) =>
                    handleInputChange("department", e.target.value)
                  }
                  readOnly
                  disabled
                  style={{
                    color: "#ff4500", // Custom text color
                    backgroundColor: "#f9f9f9", // Light background for better contrast
                    fontWeight: "bold", // Bold for better visibility
                    //    border: "1px solid primary", // Optional: Custom border
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Purpose of Visit:"
                name="purposeOfVisit"
                rules={[
                  {
                    required: true,
                    message: "Please enter the purpose of visit!",
                  },
                ]}
              >
                <Input
                  placeholder="Enter purpose of visit"
                  value={newVisitor.purposeOfVisit}
                  onChange={(e) =>
                    handleInputChange("purposeOfVisit", e.target.value)
                  }
                  disabled={
                    newVisitor.visitorCategory !== "1" &&
                    newVisitor.visitorCategory !== "0"
                  }
                  style={{
                    color: "#ff4500", // Custom text color
                    backgroundColor: "#f9f9f9", // Light background for better contrast
                    fontWeight: "bold", // Bold for better visibility
                    //    border: "1px solid primary", // Optional: Custom border
                  }}
                />
              </Form.Item>
            </Form>
          </Card>
        </div>
        <div className="col-12 my-3">
          <Button
            type="primary"
            htmlType="submit"
            onClick={handleSubmit}
            block
            variant="primary"
            style={{
              float: "right",
              marginTop: "16px",
              borderRadius: "15px",
              backgroundColor: "#E89641",
              color: "#fff",
              border: "none",
              boxShadow: "none",
              fontSize: "16px",
              fontWeight: "medium",
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
