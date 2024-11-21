import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  DatePicker,
  TimePicker,
  Select,
  message,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { postPatientVitals } from "../actions/patientActions";
import { SaveOutlined, CheckCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons'; // Import the icons

const { TextArea } = Input;
const { Option } = Select;

const NurseObservation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const patient = location.state?.patient || {};
  const triageRecord = location.state?.triage || {};
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { loading, success, error } = useSelector(
    (state) => state.postPatientVitals
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Set the initial date and time to now
    form.setFieldsValue({
      date: moment(), // current date
      time: moment(), // current time
    });
  }, [form]);

  const onFinish = async (values) => {
    setSubmitting(true);
    const vitals = {
      date: values.date.format("YYYY-MM-DD"),
      time: values.time.format("HH:mm"),
      temperature: values.temperature,
      pulseRate: values.pulseRate,
      respiratoryRate: values.respiratoryRate,
      systolic: values.systolic,
      diastolic: values.diastolic,
      oxygenSaturation: values.oxygenSaturation,
      consciousness: values.consciousness,
      painScore: values.painScore,
      observations: values.observations,
    };

    try {
      await dispatch(postPatientVitals(triageRecord.id, vitals));
      navigate("/Nurse/New-Patients");
    } catch (error) {
      console.error("Failed to submit observation:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/Nurse/New-Patients");
  };

  return (
    <div className="container">
      <h4 className="text-center p-3" style={{ color: "#ac8342" }}>
        Nurse Observation Form
      </h4>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type="link" onClick={handleBack} className="text-success">
          Back to New Patients List
        </Button>
      </div>
      {patient && (
        <div className="card-header" style={{ color: "#ac8342" }}>
          <h5>Patient Details</h5>
          <p>
            <strong>First Name:</strong> {patient.firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {patient.lastName}
          </p>
          <p>
            <strong>ID Number:</strong> {patient.idNumber}
          </p>
        </div>
      )}
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Date of Observation"
          className="pt-3"
          name="date"
          rules={[{ required: true, message: "Please select the date" }]}
          labelCol={{ style: { color: "#ac8342" } }}
        >
          <DatePicker
            format="YYYY-MM-DD"
            style={{ width: "100%" }}
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Time of Observation"
          name="time"
          rules={[{ required: true, message: "Please select the time" }]}
          labelCol={{ style: { color: "#ac8342" } }}
        >
          <TimePicker format="HH:mm" style={{ width: "100%" }} size="large" />
        </Form.Item>

        <Form.Item
          label="Temperature (°C)"
          name="temperature"
          rules={[{ required: true, message: "Please enter temperature" }]}
          labelCol={{ style: { color: "#ac8342" } }}
        >
          <InputNumber
            min={34}
            max={42}
            step={0.1}
            placeholder="e.g., 37.0"
            style={{ width: "100%" }}
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Pulse Rate (bpm)"
          name="pulseRate"
          rules={[{ required: true, message: "Please enter pulse rate" }]}
          labelCol={{ style: { color: "#ac8342" } }}
        >
          <InputNumber
            min={30}
            max={200}
            placeholder="e.g., 80"
            style={{ width: "100%" }}
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Respiratory Rate (breaths per minute)"
          name="respiratoryRate"
          rules={[{ required: true, message: "Please enter respiratory rate" }]}
          labelCol={{ style: { color: "#ac8342" } }}
        >
          <InputNumber
            min={10}
            max={60}
            placeholder="e.g., 20"
            style={{ width: "100%" }}
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Blood Pressure (mmHg)"
          required
          labelCol={{ style: { color: "#ac8342" } }}
        >
          <Input.Group compact>
            <Form.Item
              name="systolic"
              noStyle
              rules={[
                { required: true, message: "Please enter systolic pressure" },
              ]}
              labelCol={{ style: { color: "#ac8342" } }}
            >
              <InputNumber
                placeholder="Systolic"
                min={50}
                max={250}
                style={{ width: "49%" }}
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="diastolic"
              noStyle
              rules={[
                { required: true, message: "Please enter diastolic pressure" },
              ]}
              labelCol={{ style: { color: "#ac8342" } }}
            >
              <InputNumber
                placeholder="Diastolic"
                min={30}
                max={150}
                style={{ width: "49%", marginLeft: "2%" }}
                size="large"
              />
            </Form.Item>
          </Input.Group>
        </Form.Item>

        <Form.Item
          label="Oxygen Saturation (%)"
          name="oxygenSaturation"
          rules={[
            { required: true, message: "Please enter oxygen saturation" },
          ]}
          labelCol={{ style: { color: "#ac8342" } }}
        >
          <InputNumber
            min={70}
            max={100}
            placeholder="e.g., 98"
            style={{ width: "100%" }}
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Consciousness Level"
          name="consciousness"
          rules={[
            { required: true, message: "Please select consciousness level" },
          ]}
          labelCol={{ style: { color: "#ac8342" } }}
        >
          <Select
            placeholder="Select consciousness level"
            style={{ width: "100%" }}
            size="large"
          >
            <Option value="alert">Alert</Option>
            <Option value="drowsy">Drowsy</Option>
            <Option value="unconscious">Unconscious</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Pain Score (0-10)"
          name="painScore"
          labelCol={{ style: { color: "#ac8342" } }}
        >
          <InputNumber
            min={0}
            max={10}
            placeholder="0-10 scale"
            style={{ width: "100%" }}
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Other Observations"
          name="observations"
          labelCol={{ style: { color: "#ac8342" } }}
        >
          <TextArea
            rows={4}
            placeholder="Enter any additional observations or notes"
            size="large"
          />
        </Form.Item>

        <Form.Item className="d-flex justify-content-end gap-2">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={submitting || loading}
            size="large"
            icon={<SaveOutlined />} // Add Save icon
          >
            Submit Observation
          </Button>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ marginLeft: "10px" }}
            disabled={submitting || loading}
            size="large"
            icon={<CheckCircleOutlined />} // Add Check Circle icon
          >
            Dispatch to Doctor
          </Button>

          <Button
            type="default"
            onClick={handleBack}
            style={{ marginLeft: "10px" }}
            size="large"
            icon={<ArrowLeftOutlined />} // Add Arrow Left icon
          >
            Back to New Patients
          </Button>
        </Form.Item>

        {error && <div style={{ color: "red" }}>{error}</div>}
      </Form>
    </div>
  );
};

export default NurseObservation;
