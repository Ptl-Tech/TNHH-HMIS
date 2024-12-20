import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, message, Typography } from "antd";
import axios from "axios";

const DoctorNotes = () => {
  const [signOptions, setSignOptions] = useState([]); // Always initialize as an empty array
  const [systemOptions, setSystemOptions] = useState([]); // Same for systemOptions
  const [action, setAction] = useState("add"); // Store the selected action

  // Fetch setup data for signs and systems (Replace with your API logic)
  useEffect(() => {
    // Fetch QySignsSetup (Sign Numbers)
    axios
      .get("/api/QySignsSetup")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setSignOptions(response.data); // Only set if it's an array
        } else {
          console.error(
            "Expected an array for signOptions, but got:",
            response.data
          );
          setSignOptions([]); // Fallback to empty array
        }
      })
      .catch((error) => {
        console.error("Error fetching signs:", error);
        message.error("Failed to fetch signs data.");
        setSignOptions([]); // Fallback to empty array
      });

    // Fetch QyHMSSystems (Systems)
    axios
      .get("/api/QyHMSSystems")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setSystemOptions(response.data); // Only set if it's an array
        } else {
          console.error(
            "Expected an array for systemOptions, but got:",
            response.data
          );
          setSystemOptions([]); // Fallback to empty array
        }
      })
      .catch((error) => {
        console.error("Error fetching systems:", error);
        message.error("Failed to fetch systems data.");
        setSystemOptions([]); // Fallback to empty array
      });
  }, []);

  const onFinishSigns = (values) => {
    // Call POST for PatientSigns
    axios
      .post("/Doctor/PatientSigns", {
        myAction: action,
        treatmentNo: values.treatmentNo,
        signNo: values.signNo,
        system: values.system,
      })
      .then((response) => {
        message.success("Patient Signs Saved Successfully");
      })
      .catch((error) => {
        message.error("Error saving Patient Signs");
        console.error(error);
      });
  };

  const onFinishSymptoms = (values) => {
    // Call POST for PatientSymptoms
    axios
      .post("/Doctor/PatientSymptoms", {
        myAction: action,
        treatmentNo: values.treatmentNo,
        symptomCode: values.symptomCode,
        system: values.system,
        duration: values.duration,
        description: values.description,
        characteristics: values.characteristics,
      })
      .then((response) => {
        message.success("Patient Symptoms Saved Successfully");
      })
      .catch((error) => {
        message.error("Error saving Patient Symptoms");
        console.error(error);
      });
  };

  return (
    <div>
      <Typography.Title level={4}>Patient Signs and Symptoms</Typography.Title>

      <Typography.Title
        level={5}
        style={{
          color: "#0F5689",
          fontSize: "16px",
          marginBottom: "12px",
        }}
      >
        Patient Signs
      </Typography.Title>

      <Form
        name="patientSigns"
        onFinish={onFinishSigns}
        initialValues={{ myAction: "add" }} // default action
      >
        <Form.Item
          name="myAction"
          label="Action"
          rules={[{ required: true, message: "Please select an action!" }]}
        >
           <div>
            <Button
            type='primary'
              onClick={() => setAction('add')}
              style={{ marginRight: 8 }}
            >
              Add
            </Button>
            <Button
              type="default"
              onClick={() => setAction('update')}
              style={{ marginRight: 8 }}
              
            >
              Update
            </Button>
            <Button
              type={action === 'delete' ? 'primary' : 'default'}
              onClick={() => setAction('delete')}
              danger
            >
              Delete
            </Button>
          </div>
        </Form.Item>

        <Form.Item
          name="treatmentNo"
          label="Treatment Number"
          rules={[
            { required: true, message: "Please enter treatment number!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="signNo"
          label="Sign Number"
          rules={[{ required: true, message: "Please select a sign!" }]}
        >
          <Select>
            {signOptions.map((option) => (
              <Select.Option key={option.signNo} value={option.signNo}>
                {option.signName}
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
            {systemOptions.map((option) => (
              <Select.Option key={option.systemId} value={option.systemId}>
                {option.systemName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>

      <Typography.Title
        level={5}
        style={{
          color: "#0F5689",
          fontSize: "16px",
          marginBottom: "12px",
        }}
      >
        Patient Symptoms
      </Typography.Title>

      <Form
        name="patientSymptoms"
        onFinish={onFinishSymptoms}
        initialValues={{ myAction: "add" }} // default action
      >
        <Form.Item
          name="treatmentNo"
          label="Treatment Number"
          rules={[
            { required: true, message: "Please enter treatment number!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="symptomCode"
          label="Symptom Code"
          rules={[{ required: true, message: "Please select a symptom!" }]}
        >
          <Select>
            {signOptions.map((option) => (
              <Select.Option
                key={option.symptomCode}
                value={option.symptomCode}
              >
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
            {systemOptions.map((option) => (
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
