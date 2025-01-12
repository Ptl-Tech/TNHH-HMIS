import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Form,
  Input,
  Popconfirm,
  message,
  Typography,
  Steps, Collapse, Radio, Checkbox, DatePicker, Tooltip, Card
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  EditOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getSignsSetup } from "../../../actions/Doc-actions/qySignsSetup";
import { postSignsRequest } from "../../../actions/Doc-actions/postSigns";
import { getPatientSignsLines } from "../../../actions/Doc-actions/getPatientSignsLines";
import Loading from "../../../partials/nurse-partials/Loading";
import { IoListOutline } from "react-icons/io5";
import { render } from "react-dom";
const { Step } = Steps;
const { Panel } = Collapse;
const { TextArea } = Input;

const PatientSymptoms = ({ treatmentNo }) => {
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  

  // const handleFinish = (values) => {
  //   // Find the selected sign's system value from the signs data
  //   const selectedSign = signs.find((sign) => sign.SignCode === values.signNo);

  //   // Ensure the sign and system are found before proceeding
  //   if (!selectedSign) {
  //     message.error("Selected sign not found.");
  //     return;
  //   }

  //   const data = {
  //     ...values,
  //     system: selectedSign.System, // Add the system value from the selected sign
  //     myAction: editingRecord ? "edit" : "create", // Handle create or update
  //     treatmentNo: editingRecord ? editingRecord.TreatmentNo : treatmentNo,
  //   };

  //   // Dispatch postSignsRequest for both create and update
  //   dispatch(postSignsRequest(data)).then((data) => {
  //     if (postsignsSuccess) {
  //       dispatch(getPatientSignsLines()); // Reload data after successful request
  //       form.resetFields(); // Reset the form fields
  //       setEditingRecord(null);
  //     } else {
  //       message.error("An error occurred, please try again");
  //     }
  //   });
  // };

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleFinish = (values) => {
    setFormData(values);
    onSubmit(values);
  };



  return (
    <div className="mt-4">
      <Typography.Text
        style={{
          fontWeight: "bold",
          color: "#0f5689",
          fontSize: "14px",
          marginBottom: "10px",
        }}
      >
        <FileOutlined />
        MSE Form
      </Typography.Text>
      <>
      <Steps current={currentStep} size="small" style={{ marginBottom: 24, marginTop: 24 }}>
        <Step title="Appearance & Speech" />
        <Step title="Mood & Thinking" />
        <Step title="Sensorium & Perception" />
        <Step title="Judgement & Insight" />
      </Steps>

      <Form
        name="mentalStateExamForm"
        onFinish={handleFinish}
        initialValues={formData}
        layout="vertical"
      >
        {/* Step 1: Appearance & Speech */}
        {currentStep === 0 && (
          <>
            <Collapse>
              <Panel header="Appearance" key="1">
                <Form.Item
                  name="appearance"
                  label="Appearance (Personal Identification)"
                  rules={[{ required: true, message: 'Please describe appearance!' }]}
                >
                  <TextArea placeholder="e.g., cooperative, attentive, hostile..." autoSize={{ minRows: 3 }} />
                </Form.Item>
                <Form.Item
                  name="behavior"
                  label="Behavior and Psychomotor Activity"
                  rules={[{ required: true, message: 'Please describe behavior!' }]}
                >
                  <TextArea placeholder="e.g., gait, mannerisms, tics..." autoSize={{ minRows: 3 }} />
                </Form.Item>
              </Panel>
              <Panel header="Speech" key="2">
                <Form.Item
                  name="speech"
                  label="Speech"
                  rules={[{ required: true, message: 'Please describe speech!' }]}
                >
                  <TextArea placeholder="e.g., rapid, slow, pressured..." autoSize={{ minRows: 3 }} />
                </Form.Item>
              </Panel>
            </Collapse>
          </>
        )}

        {/* Step 2: Mood & Thinking */}
        {currentStep === 1 && (
          <>
            <Collapse>
              <Panel header="Mood & Affect" key="1">
                <Form.Item
                  name="mood"
                  label="Mood"
                  rules={[{ required: true, message: 'Please describe the patient\'s mood!' }]}
                >
                  <TextArea placeholder="e.g., depressed, anxious, euphoric..." autoSize={{ minRows: 3 }} />
                </Form.Item>
                <Form.Item
                  name="affect"
                  label="Affect"
                  rules={[{ required: true, message: 'Please describe the patient\'s affect!' }]}
                >
                  <TextArea placeholder="e.g., broad, restricted, blunted..." autoSize={{ minRows: 3 }} />
                </Form.Item>
              </Panel>
              <Panel header="Thinking & Perception" key="2">
                <Form.Item
                  name="thinkingForm"
                  label="Form of Thinking"
                  rules={[{ required: true, message: 'Please describe thinking form!' }]}
                >
                  <TextArea placeholder="e.g., overabundance of ideas, flight of ideas..." autoSize={{ minRows: 3 }} />
                </Form.Item>
                <Form.Item
                  name="thinkingContent"
                  label="Content of Thinking"
                >
                  <TextArea placeholder="e.g., preoccupations, obsessions, compulsions..." autoSize={{ minRows: 3 }} />
                </Form.Item>
                <Form.Item
                  name="perceptualDisturbances"
                  label="Perceptual Disturbances"
                >
                  <TextArea placeholder="e.g., hallucinations, illusions..." autoSize={{ minRows: 3 }} />
                </Form.Item>
              </Panel>
            </Collapse>
          </>
        )}

        {/* Step 3: Sensorium & Perception */}
        {currentStep === 2 && (
          <>
            <Collapse>
              <Panel header="Sensorium" key="1">
                <Form.Item
                  name="alertness"
                  label="Alertness"
                  rules={[{ required: true, message: 'Please describe alertness!' }]}
                >
                  <TextArea placeholder="e.g., attention span, GCS..." autoSize={{ minRows: 3 }} />
                </Form.Item>
                <Form.Item
                  name="orientation"
                  label="Orientation"
                  rules={[{ required: true, message: 'Please describe orientation!' }]}
                >
                  <TextArea placeholder="e.g., time, place, person..." autoSize={{ minRows: 3 }} />
                </Form.Item>
              </Panel>
              <Panel header="Memory" key="2">
                <Form.Item
                  name="memory"
                  label="Memory"
                  rules={[{ required: true, message: 'Please describe memory!' }]}
                >
                  <TextArea placeholder="e.g., recent, remote, episodic..." autoSize={{ minRows: 3 }} />
                </Form.Item>
              </Panel>
            </Collapse>
          </>
        )}

        {/* Step 4: Judgement & Insight */}
        {currentStep === 3 && (
          <>
            <Collapse>
              <Panel header="Judgement & Insight" key="1">
                <Form.Item
                  name="judgement"
                  label="Judgement"
                  rules={[{ required: true, message: 'Please describe judgement!' }]}
                >
                  <TextArea placeholder="e.g., social, test judgement..." autoSize={{ minRows: 3 }} />
                </Form.Item>
                <Form.Item
                  name="insight"
                  label="Insight"
                  rules={[{ required: true, message: 'Please describe insight!' }]}
                >
                  <TextArea placeholder="e.g., denial, intellectual insight..." autoSize={{ minRows: 3 }} />
                </Form.Item>
              </Panel>
            </Collapse>
          </>
        )}

        <div className="steps-action" style={{ marginTop: 20 }}>
          {currentStep > 0 && (
            <Button style={{ marginRight: 8 }} onClick={handlePrev}>
              Previous
            </Button>
          )}
          {currentStep < 3 && (
            <Button type="primary" onClick={handleNext}>
              Next
            </Button>
          )}
          {currentStep === 3 && (
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          )}
        </div>
      </Form>
            </>
    </div>
  );
};

export default PatientSymptoms;

