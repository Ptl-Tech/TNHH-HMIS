import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Form,
  Input,
  Steps,
  Collapse,
  message,
  Typography,
} from "antd";
import { FileOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useLocation } from "react-router-dom";
import { getPatientMSESlice } from "../../../actions/Doc-actions/getPatientMentalStateNotes";
import { postMSENotes } from "../../../actions/Doc-actions/postMentalStateForm";

const { Step } = Steps;
const { Panel } = Collapse;
const { TextArea } = Input;

const PatientSymptoms = ({ treatmentNo }) => {
  const { data } = useSelector((state) => state.getPatientMSE);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const patientNo = queryParams.get("PatientNo");

  const categories = [
    { step: 0, panels: ["APPEARANCE", "SPEECH"] },
    { step: 1, panels: ["ATTITUDE", "THINKING & PERCEPTION"] },
    { step: 2, panels: ["SENSORIUM", "MEMORY"] },
    { step: 3, panels: ["JUDGEMENT", "INSIGHT"] },
  ];

  useEffect(() => {
    if (patientNo) {
      dispatch(getPatientMSESlice(patientNo));
    }
  }, [dispatch, patientNo]);

  // Memoize initial values based on Redux data
  const initialValues = useMemo(() => {
    const initial = {};
    data.forEach((note) => {
      if (note.Category && note.Comments) {
        initial[note.Category.toLowerCase()] = note.Comments; // Map category to form field name
      }
    });
    return initial;
  }, [data]);

  const [lastSavedNotes, setLastSavedNotes] = useState(initialValues);


  // Update form field values when patient data is fetched
  useEffect(() => {
    if (initialValues) {
      setLastSavedNotes(initialValues);
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const saveNotes = async () => {
    try {
      const values = form.getFieldsValue();
      const currentCategory = categories[currentStep];

      const notesToSave = Object.keys(values)
        .map((key, index) => {
          if (lastSavedNotes[key] !== values[key]?.trim()) {
            return {
              myAction: "create",
              recId: "",
              patientNo: patientNo,
              date: moment().format("YYYY-MM-DD"),
              category: currentCategory.panels[index] || "",
              descriptor: currentCategory.panels[index] || "",
              comments: values[key]?.trim() || "",
            };
          }
          return null;
        })
        .filter(Boolean);

      if (notesToSave.length > 0) {
        const responses = await Promise.all(
          notesToSave.map((note) => dispatch(postMSENotes(note)))
        );
        if (responses.every((res) => res === "success")) {
          message.success("Notes saved successfully");
          setLastSavedNotes(values);
        } else {
          message.error("Failed to save some notes");
        }
      }
    } catch (error) {
      console.error("Error during saving notes:", error);
    }
  };

  const handleNext = async () => {
    // await saveNotes();
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    await saveNotes();
    message.success("Form submission complete!");
    form.resetFields();
    setCurrentStep(0);
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
        <FileOutlined /> MSE Form
      </Typography.Text>
      <Steps
        current={currentStep}
        size="small"
        style={{ marginBottom: 24, marginTop: 24 }}
      >
        <Step title="Appearance & Speech" />
        <Step title="Mood & Thinking" />
        <Step title="Sensorium & Perception" />
        <Step title="Judgement & Insight" />
      </Steps>

      <Form form={form} layout="vertical" >
        {/* Step 1: Appearance & Speech */}
        {currentStep === 0 && (
          <Collapse defaultActiveKey={["1", "2"]}>
            <Panel header="Appearance" key="1">
              <Form.Item
                name="appearance"
                label="Appearance (Personal Identification)"
                rules={[{ required: true, message: "Please describe appearance!" }]}
              >
                <TextArea
                  placeholder="e.g., cooperative, attentive, hostile..."
                  autoSize={{ minRows: 5}}
                />
              </Form.Item>
              {/* <Form.Item
                name="behavior"
                label="Behavior and Psychomotor Activity"
                rules={[{ required: true, message: "Please describe behavior!" }]}
              >
                <TextArea
                  placeholder="e.g., gait, mannerisms, tics..."
                  autoSize={{ minRows: 3 }}
                />
              </Form.Item> */}
            </Panel>
            <Panel header="Speech" key="2">
              <Form.Item
                name="speech"
                label="Describe patient Speech Pattern"
                rules={[{ required: true, message: "Please describe speech!" }]}
              >
                <TextArea
                  placeholder="e.g., rapid, slow, pressured..."
                  autoSize={{ minRows: 5 }}
                />
              </Form.Item>
            </Panel>
          </Collapse>
        )}

               {/* Step 2: Mood & Thinking */}
        {currentStep === 1 && (
          <Collapse defaultActiveKey={["1"]} >
            <Panel header="Mood & Affect" key="1">
              <Form.Item
                name="mood"
                label="Describe Patient Form of Thought."
                rules={[{ required: true, message: "Please describe mood!" }]}
              >
                <TextArea
                  placeholder="e.g., thoughts, dreams, memories..."
                  autoSize={{ minRows: 6 }}
                />
              </Form.Item>
              <Form.Item
                name="mood"
                label="Describe Patient Thought Content"
                rules={[{ required: true, message: "Please decribe patient Thought Content!" }]}
              >
                <TextArea
                  placeholder="e.g., thoughts, dreams, memories..."
                  autoSize={{ minRows: 6 }}
                />
              </Form.Item>
            </Panel>
          </Collapse>
        )}

        {/* Step 3: Sensorium & Perception */}
        {currentStep === 2 && (
          <Collapse defaultActiveKey={["1"]}>
            <Panel header="Sensorium" key="1">
              <Form.Item
                name="alertness"
                label="Alertness"
                rules={[
                  { required: true, message: "Please describe alertness!" },
                ]}
              >
                <TextArea
                  placeholder="e.g., attention span, GCS..."
                  autoSize={{ minRows: 5 }}
                />
              </Form.Item>
            </Panel>
          </Collapse>
        )}

        {/* Step 4: Judgement & Insight */}
        {currentStep === 3 && (
          <Collapse defaultActiveKey={["1"]}>
            <Panel header="Judgement & Insight" key="1">
              <Form.Item
                name="judgement"
                label="Judgement"
                rules={[
                  { required: true, message: "Please describe judgement!" },
                ]}
              >
                <TextArea
                  placeholder="e.g., social, test judgement..."
                  autoSize={{ minRows: 5 }}
                />
              </Form.Item>
            </Panel>
          </Collapse>
        )}


<div className="d-block d-md-flex gap-4 justify-content-end align-items-center" style={{ marginTop: 20 }}>
          <Button type="primary" style={{ marginRight: 8 }} onClick={saveNotes}>
            Save
          </Button>
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
          {/* {currentStep === 3 && (
            <Button type="primary" onClick={handleSubmit}>
              Submit
            </Button>
          )} */}
        </div>
      </Form>
    </div>
  );
};

export default PatientSymptoms;
