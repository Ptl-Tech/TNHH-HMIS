import React from "react";
import { Button, Form, Input, Select } from "antd";
import { UserOutlined } from "@ant-design/icons";

const VisitorForm  = () => {

  const handleRegister = () => {
    // Placeholder for form submission logic
    console.log("Visitor registered!");
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between">
        <h5 className="card-title" style={{ color: "#ac8342", display: "flex", alignItems: "center" }}>
          <UserOutlined style={{ marginRight: 8, fontSize: "40px" }} />
          Visitor Registration
        </h5>
      </div>
      <div className="card-body">
        <Form layout="vertical">
          <div className="row g-3 py-1 align-items-center justify-content-center">
            {/* Visitor Number */}
            <div className="col-12 col-md-6">
              <Form.Item label="Visitor Number:" name="visitorNumber">
                <Input placeholder="VIS_0001" readOnly />
              </Form.Item>
            </div>

            {/* Visitor Category */}
            <div className="col-12 col-md-6">
              <Form.Item
                label="Visitor Category:"
                name="visitorCategory"
                rules={[{ required: true, message: "Please select a category" }]}
              >
                <Select placeholder="Select Category">
                  <Select.Option value="employee">Employee</Select.Option>
                  <Select.Option value="contractor">Contractor</Select.Option>
                  <Select.Option value="visitor">Visitor</Select.Option>
                </Select>
              </Form.Item>
            </div>
          </div>

          <div className="row g-3 py-1 align-items-center justify-content-center">
            {/* Visitor Name */}
            <div className="col-12 col-md-6">
              <Form.Item
                label="Visitor's Name:"
                name="visitorName"
                rules={[{ required: true, message: "Please enter the visitor's name" }]}
              >
                <Input placeholder="Enter Visitor's Name" />
              </Form.Item>
            </div>

            {/* Purpose of Visit */}
            <div className="col-12 col-md-6">
              <Form.Item
                label="Purpose of Visit:"
                name="purposeOfVisit"
                rules={[{ required: true, message: "Please enter the purpose of the visit" }]}
              >
                <Input placeholder="Enter Purpose of Visit" />
              </Form.Item>
            </div>
          </div>

          <div className="row g-3 py-1 align-items-center justify-content-center">
            {/* ID Number */}
            <div className="col-12 col-md-6">
              <Form.Item
                label="ID Number:"
                name="idNumber"
                rules={[{ required: true, message: "Please enter ID number" }]}
              >
                <Input placeholder="Enter ID Number" />
              </Form.Item>
            </div>

            {/* Phone Number */}
            <div className="col-12 col-md-6">
              <Form.Item
                label="Phone Number:"
                name="phoneNumber"
                rules={[{ required: true, message: "Please enter phone number" }]}
              >
                <Input placeholder="Enter Phone Number" />
              </Form.Item>
            </div>
          </div>

          <div className="row g-3 py-1 align-items-center justify-content-center">
            {/* Visitor Car Registration Number */}
            <div className="col-12 col-md-6">
              <Form.Item label="Visitor Car Registration Number:" name="carRegNumber">
                <Input placeholder="Enter Car Registration Number" />
              </Form.Item>
            </div>

            {/* Person to Visit Number */}
            <div className="col-12 col-md-6">
              <Form.Item
                label="Person to Visit Number:"
                name="personToVisitNumber"
                rules={[{ required: true, message: "Please enter person to visit number" }]}
              >
                <Input placeholder="Enter Person to Visit Number" />
              </Form.Item>
            </div>
          </div>

          <div className="row g-3 py-1 align-items-center justify-content-center">
            {/* Person to Visit Name */}
            <div className="col-12 col-md-6">
              <Form.Item
                label="Person to Visit Name:"
                name="personToVisitName"
                rules={[{ required: true, message: "Please enter person to visit name" }]}
              >
                <Input placeholder="Enter Person to Visit Name" />
              </Form.Item>
            </div>

            {/* Department */}
            <div className="col-12 col-md-6">
              <Form.Item
                label="Department:"
                name="department"
                rules={[{ required: true, message: "Please enter department" }]}
              >
                <Input placeholder="Enter Department" />
              </Form.Item>
            </div>
          </div>

          <div className="row g-3 py-1 align-items-center justify-content-center">
            {/* Visitor Pass Number */}
            <div className="col-12 col-md-6">
              <Form.Item
                label="Visitor Pass Number:"
                name="visitorPassNumber"
                rules={[{ required: true, message: "Please enter visitor pass number" }]}
              >
                <Input placeholder="Enter Visitor Pass Number" />
              </Form.Item>
            </div>

            {/* Status */}
            <div className="col-12 col-md-6">
              <Form.Item
                label="Status:"
                name="status"
                rules={[{ required: true, message: "Please select status" }]}
              >
                <Select placeholder="Select Status">
                  <Select.Option value="arrived">Arrived</Select.Option>
                  <Select.Option value="pending">Pending</Select.Option>
                  <Select.Option value="left">Left</Select.Option>
                </Select>
              </Form.Item>
            </div>
          </div>

          <div className="row g-3 py-2 align-items-center justify-content-center">
            <div className="col-12 d-flex justify-content-center">
              <Button
                type="primary"
                size="large"
                onClick={handleRegister}
                
              >
                Register Visitor
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default VisitorForm ;
