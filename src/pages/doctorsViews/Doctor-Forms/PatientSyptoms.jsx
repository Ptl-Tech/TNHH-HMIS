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
import MentalStatusExamTable from "../tables/MentalStatusExamTable";

const { Step } = Steps;
const { Panel } = Collapse;
const { TextArea } = Input;

const PatientSymptoms = ({ treatmentNo, moveToNextTab }) => {
  const { data } = useSelector((state) => state.getPatientMSE);
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const patientNo = queryParams.get("PatientNo");

  console.log("Query Params:", queryParams.toString()); // View all query params
  console.log("Extracted PatientNo:", patientNo); // Check the extracted value

  const categories = [
    { step: 0, panels: ["APPEARANCE", "SPEECH"] },
    { step: 1, panels: ["FORM OF THOUGHT", "THOUGHT CONTENT"] },
    { step: 2, panels: ["SENSORIUM", "MEMORY"] },
    { step: 3, panels: ["JUDGEMENT", "INSIGHT"] },
  ];

  useEffect(() => {
    if (patientNo) {
      dispatch(getPatientMSESlice(patientNo));
    }
  }, [dispatch, patientNo]);

  const initialValues = useMemo(() => {
    const initial = {};
    data.forEach((note) => {
      if (note.Category && note.Comments) {
        initial[note.Category.toLowerCase().replace(/ /g, "_")] = note.Comments; // Map category to form field name
      }
    });
    return initial;
  }, [data]);

  const [lastSavedNotes, setLastSavedNotes] = useState(initialValues);

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

      const notesToSave = currentCategory.panels
        .map((panel) => {
          const fieldName = panel.toLowerCase().replace(/ /g, "_");
          if (lastSavedNotes[fieldName] !== values[fieldName]?.trim()) {
            return {
              myAction: "create",
              recId: "",
              patientNo: patientNo,
              date: moment().format("YYYY-MM-DD"),
              category: panel,
              descriptor: panel,
              comments: values[fieldName]?.trim() || "",
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
          dispatch(getPatientMSESlice(patientNo));
        } else {
          message.error("Failed to save some notes");
        }
      }
      if (
        currentStep >= categories.length - 1 ||
        currentStep === categories.length
      ) {
        // Trigger the parent callback to move to the next tab if this is the last step
        moveToNextTab();
      } else {
        // Move to the next step
        setCurrentStep((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error during saving notes:", error);
    }
  };

  const handleNext = () => {
    saveNotes();
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
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

      <Form form={form} layout="vertical">
        {/* Step 1 */}
        {currentStep === 0 && (
          <Collapse defaultActiveKey={["1", "2"]}>
            <Panel header="Appearance" key="1">
              <Form.Item
                name="appearance"
                label="Appearance (Personal Identification)"
                rules={[
                  { required: true, message: "Please describe appearance!" },
                ]}
              >
                <TextArea
                  placeholder="e.g., cooperative, attentive, hostile..."
                  autoSize={{ minRows: 5 }}
                />
              </Form.Item>
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

        {/* Step 2 */}
        {currentStep === 1 && (
          <Collapse defaultActiveKey={["1", "2"]}>
            <Panel header="Form of Thought" key="1">
              <Form.Item
                name="form_of_thought"
                label="Describe Patient Form of Thought"
                rules={[
                  {
                    required: true,
                    message: "Please describe Form of Thought!",
                  },
                ]}
              >
                <TextArea
                  placeholder="e.g., logical, fragmented..."
                  autoSize={{ minRows: 5 }}
                />
              </Form.Item>
            </Panel>
            <Panel header="Thought Content" key="2">
              <Form.Item
                name="thought_content"
                label="Describe Patient Thought Content"
                rules={[
                  {
                    required: true,
                    message: "Please describe Thought Content!",
                  },
                ]}
              >
                <TextArea
                  placeholder="e.g., delusions, hallucinations..."
                  autoSize={{ minRows: 5 }}
                />
              </Form.Item>
            </Panel>
          </Collapse>
        )}

        {/* Step 3 */}
        {currentStep === 2 && (
          <Collapse defaultActiveKey={["1"]}>
            <Panel header="Sensorium" key="1">
              <Form.Item
                name="sensorium"
                label="Sensorium"
                rules={[
                  { required: true, message: "Please describe sensorium!" },
                ]}
              >
                <TextArea
                  placeholder="e.g., orientation, perception..."
                  autoSize={{ minRows: 5 }}
                />
              </Form.Item>
            </Panel>
          </Collapse>
        )}

        {/* Step 4 */}
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
                  placeholder="e.g., decision-making ability..."
                  autoSize={{ minRows: 5 }}
                />
              </Form.Item>
            </Panel>
          </Collapse>
        )}

        <div
          className="d-flex justify-content-end gap-3"
          style={{ marginTop: 20 }}
        >
          {currentStep > 0 && <Button onClick={handlePrev}>Previous</Button>}
          {currentStep < 3 && (
            <Button type="primary" onClick={handleNext}>
              Next
            </Button>
          )}
          {currentStep === 3 && (
            <Button type="primary" onClick={saveNotes}>
              Finish
            </Button>
          )}
        </div>
      </Form>

      <MentalStatusExamTable data={data}/>
    </div>
  );
};

export default PatientSymptoms;
