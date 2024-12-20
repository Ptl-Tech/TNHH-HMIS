import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, message, Typography } from "antd";
import { FileTextOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";

const DoctorNotes = () => {
  const [signOptions, setSignOptions] = useState([]);
  const [systemOptions, setSystemOptions] = useState([]);
  const [action, setAction] = useState("add");

  // Fetch data for signs and systems
  useEffect(() => {
    axios
      .get("/api/QySignsSetup")
      .then((response) => {
        console.log("Signs API response:", response.data);
        setSignOptions(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        console.error("Error fetching signs:", error);
        message.error("Failed to fetch signs data.");
      });

    axios
      .get("/api/QyHMSSystems")
      .then((response) => {
        console.log("Systems API response:", response.data);
        setSystemOptions(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        console.error("Error fetching systems:", error);
        message.error("Failed to fetch systems data.");
      });
  }, []);

  const onFinish = (values) => {
    const requestBody = {
      myAction: action,
      ...values,
    };

    axios
      .post("/Doctor/SavePatientData", requestBody)
      .then(() => message.success("Data saved successfully"))
      .catch((error) => {
        console.error("Error saving data:", error);
        message.error("Error saving data");
      });
  };

  return (
    <div>
      <Typography.Title level={4} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <FileTextOutlined />
        Patient Signs and Symptoms
      </Typography.Title>

      <Form name="patientData" onFinish={onFinish} layout="vertical">
        <Form.Item>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
            <Button type="primary" onClick={() => setAction("add")}>
              Add
            </Button>
            <Button
              type={action === "delete" ? "primary" : "default"}
              onClick={() => setAction("delete")}
              danger
            >
              Delete
            </Button>
          </div>
        </Form.Item>

        <Typography.Title level={5} style={{ color: "#0F5689", fontSize: "16px", marginBottom: "12px" }}>
          <UserOutlined /> Patient Signs
        </Typography.Title>

        <Form.Item
          name="treatmentNo"
          label="Treatment Number"
          rules={[{ required: true, message: "Please enter treatment number!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="signNo"
          label="Sign Number"
          rules={[{ required: true, message: "Please select a sign!" }]}
        >
          <Select>
            {Array.isArray(signOptions) &&
              signOptions.map((option) => (
                <Select.Option key={option.signNo} value={option.signNo}>
                  {option.signName}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>

        <Typography.Title level={5} style={{ color: "#0F5689", fontSize: "16px", marginBottom: "12px" }}>
          Patient Symptoms
        </Typography.Title>

        <Form.Item
          name="symptomCode"
          label="Symptom Code"
          rules={[{ required: true, message: "Please select a symptom!" }]}
        >
          <Select>
            {Array.isArray(signOptions) &&
              signOptions.map((option) => (
                <Select.Option key={option.symptomCode} value={option.symptomCode}>
                  {option.symptomName}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="system"
          label="System"
          rules={[{ required: true, message: "Please select a system!" }]}
        >
          <Select>
            {Array.isArray(systemOptions) &&
              systemOptions.map((option) => (
                <Select.Option key={option.systemId} value={option.systemId}>
                  {option.systemName}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default DoctorNotes;
