import { Button, Card, Form, Input, message, Select, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeesList } from "../actions/DropdownListActions";
import { admitVisitor, createVisitor } from "../actions/visitorsActions";

const VisitorForm = () => {
  const { loading, success, error, data } = useSelector(
    (state) => state.getEmployees );
    const { loading:regVisitorLoading, success:regVisitorSuccess, error:regVisitorError, data:regVisitorData } = useSelector(
      (state) => state.registerVisitor );

      const { loading:admitVisitorLoading, success:admitVisitorSuccess, error:admitVisitorError, data:admitVisitorData } = useSelector(
        (state) => state.admitVisitor );

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [visitorPassCounter, setVisitorPassCounter] = useState(5000); // Start visitor pass number at 5000

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

  // Generate a unique visitor pass number
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
        const updatedDepartment = selectedEmployee.Shortcut_Dimension_2_Code || "";
        const personToVisitNo = selectedEmployee.No || "";
        setNewVisitor((prevState) => ({
          ...prevState,
          department: updatedDepartment, // Update with the correct property
          personToVisitNo: personToVisitNo
        }));
        form.setFieldsValue({ department: updatedDepartment, personToVisitNo: personToVisitNo });
      }
    }


    // Automatically generate the visitor pass number when the name is updated
    if (name === "visitorName" ) { // Only generate if category is 'Employee'
      setNewVisitor((prevState) => ({
        ...prevState,
        visitorPassNo: generateVisitorPassNo(), // Generate a new visitor pass number
      }));
      form.setFieldsValue({ visitorPassNo: generateVisitorPassNo() });
    }
  };



 const handleSubmit = async () => {
    if (!newVisitor.visitorName || !newVisitor.visitorCategory) {
      message.error("Please complete all required fields.");
      return;
    }

    const visitorData = {
      myAction: "create",
      visitorNo: "",
      ...newVisitor,
    };

    try {
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
        });
      }
    } catch (error) {
      message.error("Failed to create and admit visitor.");
    }
  };

  useEffect(() => {
    if (success) {
    message.success("Visitor added successfully!");
    }
  }, [success]);

  useEffect(() => { 
    //AUTO GENERATE VISITOR PASS NUMBER
    if (newVisitor.visitorName && newVisitor.visitorCategory) {
      // Only increment if a new record is created
      setVisitorPassCounter((prevCounter) => prevCounter + 1);
    }
  }, [newVisitor.visitorName, newVisitor.visitorCategory]);

  useEffect(() => {
    dispatch(getEmployeesList());
    console.log(data);
  }, [dispatch]);

  return (
    <div>
      <div className="row p-md-2 gap-4 gap-md-0">
        <Typography.Title level={3} style={{ color: "#003F6D" }}>
          Visitor Form
        </Typography.Title>
        <div className="col-12 col-md-5">
        <Card className="card-header" style={{ height: '500px', overflow: 'auto' }}>
        <Typography.Title level={5} style={{ color: "#ED1C24" }}>
              General Information
            </Typography.Title>

            <Form form={form} layout="vertical">
             
              <Form.Item
                label="Visitor Category:"
                name="visitorCategory"
                rules={[{ required: true, message: "Please select a category!" }]}
              >
                <Select
                  placeholder="Select Visitor Category"
                  value={newVisitor.visitorCategory}
                  onChange={(value) => handleInputChange("visitorCategory", value)}
                >
                  <Select.Option value="2">Employee</Select.Option>
                  <Select.Option value="1">Patient</Select.Option>
                  <Select.Option value="0">Other</Select.Option>
                </Select>
              </Form.Item>
                 {/* Conditional rendering for Person to Visit */}
                 {newVisitor.visitorCategory === '2' && (
                <Form.Item
                  label="Person to visit Name:"
                  name="personToVisit"
                  rules={[{ required: true, message: "Please select a person!" }]}
                >
                  <Select
                    placeholder="Select Name"
                    value={newVisitor.personToVisit}
                    onChange={(value) => handleInputChange("personToVisit", value)}
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

              {newVisitor.visitorCategory !== '2' && (
                <Form.Item
                  label="Person to Visit Name:"
                  name="personToVisit"
                  rules={[{ required: true, message: "Please enter the name!" }]}
                >
                  <Input
                    placeholder="Enter name"
                    value={newVisitor.personToVisit}
                    onChange={(e) => handleInputChange("personToVisit", e.target.value)}
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
                  disabled={newVisitor.visitorCategory !== '2'}
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
                { required: true, message: "Please enter the purpose of visit!" },
              ]}
            >
              <Input
                placeholder="Enter purpose of visit"
                value={newVisitor.purposeOfVisit}
                onChange={(e) => handleInputChange("purposeOfVisit", e.target.value)}
              />
            </Form.Item>
            </Form>
          </Card>
        </div>
        <div className="col-12 col-md-7">
        <Card className="card-header" style={{ height: '500px', overflow: 'auto' }}>
        <Typography.Title level={5} style={{ color: "#ED1C24" }}>
              Visitors Information
            </Typography.Title>
            <Form form={form} layout="vertical">
              <Form.Item
                label="Visitor's Name:"
                name="visitorName"
                rules={[{ required: true, message: "Please enter the name!" }]}
              >
                <Input
                  placeholder="Enter name"
                  value={newVisitor.visitorName}
                  onChange={(e) =>
                    handleInputChange("visitorName", e.target.value)
                  }
                />
              </Form.Item>
              <Form.Item
                label="ID Number:"
                name="idNumber"
                rules={[
                  { required: true, message: "Please enter the ID number!" },
                ]}
              >
                <Input
                  placeholder="Enter ID number"
                  value={newVisitor.idNumber}
                  onChange={(e) =>
                    handleInputChange("idNumber", e.target.value)
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
                  value={newVisitor.phoneNumber}
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
                    required: true,
                    message: "Please enter the car registration number!",
                  },
                ]}
              >
                <Input
                  placeholder="Enter car registration number"
                  value={newVisitor.carRegistrationNo}
                  onChange={(e) =>
                    handleInputChange("carRegistrationNo", e.target.value)
                  }
                />
              </Form.Item>
              <Form.Item
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
