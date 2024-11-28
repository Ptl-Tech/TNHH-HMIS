import {
  Card,
  InputNumber,
  Typography,
  Form,
  Input,
  Select,
  Divider,
  DatePicker,
  TimePicker,
  Tabs,
  Row,
  Col,
  Switch,
  Avatar,
  Button,
} from "antd";
import React, { useState } from "react";
import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const { TabPane } = Tabs;

const NurseObservation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const patient = location.state?.patient || {};
  const triageRecord = location.state?.triage || {};
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isPosted, setIsPosted] = useState(false); // State to manage post status

  const handleSwitchChange = (checked) => {
    setIsPosted(checked); // Toggle the isPosted state
  };
  const handleDispatchClick = () => {
    // Handle the dispatch to doctor logic here
    console.log("Dispatch to doctor clicked");
  };
  return (
    <div className="container">
      {/* Container for the header and button */}
      <div style={{ position: "relative", marginBottom: "16px" }}>
        <h4 className="text-start p-3" style={{ color: "#E89641" }}>
          Triage Observation Form
        </h4>
        {/* Dispatch button positioned at the top right */}
        <Button
          type="primary"
          style={{
            position: "absolute",
            right: "0",
            top: "0",
            marginTop: "10px", // Optional margin to adjust the position from the top
          }}
          onClick={handleDispatchClick}
        >
          Dispatch to Doctor
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {/* Left Column (Patient Info) */}
        {patient && (
          <Col xs={24} md={8}>
            {/* General Patient Info Card */}
            <Card className="card-header">
              <Typography.Title level={4} style={{ color: "#ac8342" }}>
                General Patient Info
              </Typography.Title>

              {/* User Info Container */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                {/* User Avatar */}
                <Avatar
                  // src="https://via.placeholder.com/50" // Replace with actual image URL if available
                  alt="User Avatar"
                  size={60}
                  style={{
                    marginRight: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#8bc34a", // Greenish-yellow background
                  }}
                />
                {/* User Name and Location */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Typography.Text strong style={{ fontSize: "16px" }}>
                    {`${patient.firstName? patient.firstName + " " : ""} ${
                      patient.middlename ? patient.middlename + " " : ""
                    }${patient.lastName? patient.lastName : ""}`}
                  </Typography.Text>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <span>USA |</span>
                    <span> California</span>
                  </div>
                </div>
              </div>

              {/* Patient Details */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <Typography.Text strong style={{ fontSize: "14px" }}>
                    Patient IDNumber:
                  </Typography.Text>
                  <Typography.Text style={{ fontSize: "14px" }}>
                  {patient.idNumber}
                  </Typography.Text>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <Typography.Text strong style={{ fontSize: "14px" }}>
                    Gender:
                  </Typography.Text>
                  <Typography.Text style={{ fontSize: "16px" }}>
                    Male
                  </Typography.Text>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <Typography.Text strong style={{ fontSize: "14px" }}>
                    Age:
                  </Typography.Text>
                  <Typography.Text style={{ fontSize: "16px" }}>
                    28 <span style={{ color: "#888" }}>Years</span>
                  </Typography.Text>
                </div>
              </div>
            </Card>

            {/* Consultation Details Card */}
            <Card className="card-header mt-3">
              <Typography.Title level={4} style={{ color: "#ac8342" }}>
                Consultation Details
              </Typography.Title>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <Form.Item label="Clinic" name="clinic">
                  <Input placeholder="Enter clinic name" />
                </Form.Item>
                <Form.Item label="Doctor" name="doctor">
                  <Input placeholder="Enter doctor name" />
                </Form.Item>
                <Form.Item label="Patient Type" name="patientType">
                  <Input placeholder="Enter patient type" />
                </Form.Item>
              </div>
            </Card>
          </Col>
        )}

        {/* Right Column (Tabs Section) */}
        <Col xs={24} md={16}>
          <Card className="card-header">
            <Tabs defaultActiveKey="1">
              {/* Tab 1: Triage General Information */}
              <TabPane tab="Triage General Info" key="1">
                <Form layout="vertical">
                  <Form.Item
                    label="Temperature (°C)"
                    name="temperature"
                    rules={[
                      { required: true, message: "Please enter temperature" },
                    ]}
                  >
                    <InputNumber
                      min={34}
                      max={42}
                      step={0.1}
                      placeholder="e.g., 37.0"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Pulse Rate (bpm)"
                    name="pulseRate"
                    rules={[
                      { required: true, message: "Please enter pulse rate" },
                    ]}
                  >
                    <InputNumber
                      min={30}
                      max={200}
                      placeholder="e.g., 80"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Respiratory Rate (breaths per minute)"
                    name="respirationRate"
                    rules={[
                      {
                        required: true,
                        message: "Please enter respiratory rate",
                      },
                    ]}
                  >
                    <InputNumber
                      min={10}
                      max={60}
                      placeholder="e.g., 20"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                  <Form.Item label="Blood Pressure (mmHg)" required>
                    <Input.Group compact>
                      <Form.Item
                        name="bloodPreasure"
                        noStyle
                        rules={[
                          {
                            required: true,
                            message: "Enter systolic pressure",
                          },
                        ]}
                      >
                        <InputNumber
                          placeholder="Systolic"
                          min={50}
                          max={250}
                          style={{ width: "49%" }}
                        />
                      </Form.Item>
                      <Form.Item
                        name="bloodPreasure"
                        noStyle
                        rules={[
                          {
                            required: true,
                            message: "Enter diastolic pressure",
                          },
                        ]}
                      >
                        <InputNumber
                          placeholder="Diastolic"
                          min={30}
                          max={150}
                          style={{ width: "49%", marginLeft: "2%" }}
                        />
                      </Form.Item>
                    </Input.Group>
                  </Form.Item>
                  <Form.Item
                    label="Oxygen Saturation (%)"
                    name="sP02"
                    rules={[
                      {
                        required: true,
                        message: "Please enter oxygen saturation",
                      },
                    ]}
                  >
                    <InputNumber
                      min={70}
                      max={100}
                      placeholder="e.g., 98"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Form>
              </TabPane>

              {/* Tab 2: Allergy and Medical History */}
              <TabPane tab="Allergy & Medical History" key="2">
                <Form layout="vertical">
                  <Form.Item
                    label="Observation Number"
                    name="observationNo"
                    rules={[
                      {
                        required: true,
                        message: "Patient Observation Number is required",
                      },
                    ]}
                    // labelCol={{ style: { color: "#ac8342" } }}
                  >
                    <InputNumber
                      min={1}
                      max={100}
                      placeholder="e.g., APP_0001"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Reason for Visit"
                    name="reasonForVisit"
                    // labelCol={{ style: { color: "#ac8342" } }}
                    rules={[
                      {
                        required: true,
                        message: "Reason for Visit is required",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Reason for Visit"
                      size="medium"
                      style={{ width: "100%" }}
                    >
                      <Select.Option value="3">New Presentation</Select.Option>
                      <Select.Option value="4">Follow-up Visit</Select.Option>
                      <Select.Option value="2">
                        Patient Detoriated
                      </Select.Option>
                      <Select.Option value="1">
                        Patient not Improving
                      </Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Complaints"
                    name="complaints"
                    // labelCol={{ style: { color: "#ac8342" } }}
                    rules={[
                      { required: true, message: "Complaints are required" },
                    ]}
                  >
                    <Input placeholder="e.g., Headache" />
                  </Form.Item>
                  <Form.Item
                    label="Drug Allergies"
                    name="drugAllergy"
                    rules={[
                      {
                        required: true,
                        message: "Drug Allergies are required",
                      },
                    ]}
                  >
                    <Input placeholder="e.g., Penicillin" />
                  </Form.Item>
                  <Form.Item
                    label="Food Allergies"
                    name="foodAllergy"
                    rules={[
                      {
                        required: true,
                        message: "Food Allergies are required",
                      },
                    ]}
                  >
                    <Input placeholder="e.g., Eggs" />
                  </Form.Item>
                  <Form.Item label="Assessed By" name="assessedBy">
                    <Input placeholder="e.g., Dr. Smith" readOnly />
                  </Form.Item>
                </Form>
              </TabPane>

              {/* Tab 3: Injections and Medications */}
              <TabPane tab="Injections & Medications" key="3">
                <Form layout="vertical">
                  <Form.Item
                    label="Injections"
                    name="injectionNo"
                    rules={[
                      { required: true, message: "Injections are required" },
                    ]}
                  >
                    <Select placeholder="Injections" style={{ width: "100%" }}>
                      <Select.Option value="1">1</Select.Option>
                      <Select.Option value="2">2</Select.Option>
                      <Select.Option value="3">3</Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="Quantity"
                    name="quantity"
                    rules={[
                      { required: true, message: "Quantity is required" },
                    ]}
                  >
                    <InputNumber
                      min={1}
                      max={100}
                      placeholder="e.g., 1"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Injection Date"
                    name={["injectionDate", "year"]}
                    rules={[
                      { required: true, message: "Injection Date is required" },
                    ]}
                  >
                    <DatePicker
                      format="YYYY-MM-DD"
                      style={{ width: "100%" }}
                      placeholder="Select Date"
                      defaultValue={moment()} // Set default date to current date
                    />
                  </Form.Item>

                  <Form.Item
                    label="Injection Time"
                    name="injectionTime"
                    rules={[
                      { required: true, message: "Injection Time is required" },
                    ]}
                  >
                    <TimePicker
                      format="HH:mm"
                      style={{ width: "100%" }}
                      placeholder="Select Time"
                      defaultValue={moment()} // Set default time to current time
                    />
                  </Form.Item>

                  <Form.Item label="Injection Remarks" name="injectionRemarks">
                    <Input placeholder="e.g., Injection Remarks" />
                  </Form.Item>

                  {/* Switch to toggle post status */}
                  <Form.Item label="Post Status" name="posted">
                    <Switch
                      checked={isPosted}
                      onChange={handleSwitchChange}
                      checkedChildren="Posted"
                      unCheckedChildren="Not Posted"
                    />
                  </Form.Item>
                </Form>
              </TabPane>

              <TabPane tab="Triage Dressing" key="4">
                <Form layout="vertical">
                  <Form.Item
                    label="Process Number"
                    name="processNo"
                    rules={[
                      { required: true, message: "Process Number is required" },
                    ]}
                  >
                    <Select placeholder="Injections" style={{ width: "100%" }}>
                      <Select.Option value="1">1</Select.Option>
                      <Select.Option value="2">2</Select.Option>
                      <Select.Option value="3">3</Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="Item Number"
                    name="itemNo"
                    rules={[
                      { required: true, message: "Item Number is required" },
                    ]}
                  >
                    <InputNumber
                      min={1}
                      max={100}
                      placeholder="e.g., 1"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Unit of Measurement (UOM) and Quantity"
                    name="unitOfMeasure"
                    rules={[
                      {
                        required: true,
                        message: "UOM and Quantity are required",
                      },
                    ]}
                  >
                    <Input.Group compact>
                      <Input
                        style={{ width: "48%", marginRight: "4%" }}
                        placeholder="Select unit Of Measure"
                      />
                      <InputNumber
                        style={{ width: "48%" }}
                        placeholder="Select Quantity"
                      />
                    </Input.Group>
                  </Form.Item>
                  <Form.Item label=" Remarks" name="remarks">
                    <Input placeholder="e.g., Remarks" />
                  </Form.Item>
                </Form>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default NurseObservation;
