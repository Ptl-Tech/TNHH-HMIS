import React, { useState } from "react";
import { Button, Steps, Form, Input, Checkbox, Typography } from "antd";
import { useDispatch } from "react-redux";
import { FileOutlined } from "@ant-design/icons";
import { postPatientHistoryNotes } from "../../../actions/Doc-actions/posPatientHistoryNotes";

const { TextArea } = Input;
const { Step } = Steps;

const PatientSigns = ({ treatmentNo, patientNo }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const steps = [
    {
      key: "1",
      title: "Chief Complaints & Allegations",
      content: (
        <>
          <Form.Item
            name="1"
            label="Chief Complaints (Pt own words and duration)"
            rules={[
              {
                required: true,
                message: "Please enter the chief complaints!",
              },
            ]}
          >
            <TextArea
              placeholder="Enter patient's chief complaints..."
              autoSize={{ minRows: 3 }}
            />
          </Form.Item>
          <Form.Item
            name="2"
            label="Allegations (from others who brought the patient)"
            rules={[
              {
                required: true,
                message: "Please enter allegations!",
              },
            ]}
          >
            <TextArea
              placeholder="Enter allegations..."
              autoSize={{ minRows: 3 }}
            />
          </Form.Item>
        </>
      ),
      notesType: "1",
    },
    {
      key: "2",
      title: "History of Presenting Illness",
      content: (
        <Form.Item
          name="4"
          label="History of Presenting Illness"
          rules={[
            {
              required: true,
              message: "Please provide details of presenting illness!",
            },
          ]}
        >
          <TextArea
            placeholder="Describe the illness in detail..."
            autoSize={{ minRows: 4, maxRows: 8 }}
          />
        </Form.Item>
      ),
      notesType: "3",
    },
    {
      key: "3",
      title: "Risk & Medical History",
      content: (
        <>
          <Form.Item
            name="5"
            label="Risk History"
            rules={[
              {
                required: true,
                message: "Please enter the risk history!",
              },
            ]}
          >
            <TextArea
              placeholder="Enter risk history..."
              autoSize={{ minRows: 3 }}
            />
          </Form.Item>
          <Form.Item name="6" label="Past Psychiatric & Medical History">
            <TextArea
              placeholder="Enter psychiatric and medical history..."
              autoSize={{ minRows: 3 }}
            />
          </Form.Item>
          <Form.Item name="substanceUse" valuePropName="checked">
            <Checkbox>History of substance use</Checkbox>
          </Form.Item>
        </>
      ),
      notesType: "4",
    },
    {
      key: "4",
      title: "Family & Personal History",
      content: (
        <>
          <Form.Item name="7" label="Family History">
            <TextArea
              placeholder="Enter family history..."
              autoSize={{ minRows: 3 }}
            />
          </Form.Item>
          <Form.Item name="personalHistory" label="Personal History">
            <TextArea
              placeholder="Enter personal history..."
              autoSize={{ minRows: 3 }}
            />
          </Form.Item>
        </>
      ),
      notesType: "6",
    },
    {
      key: "5",
      title: "Forensic & Premorbid Personality",
      content: (
        <>
          <Form.Item name="8" label="Forensic History">
            <TextArea
              placeholder="Enter forensic history..."
              autoSize={{ minRows: 3 }}
            />
          </Form.Item>
          <Form.Item name="9" label="Premorbid Personality">
            <TextArea
              placeholder="Describe premorbid personality..."
              autoSize={{ minRows: 3 }}
            />
          </Form.Item>
        </>
      ),
      notesType: "8",
    },
  ];

  const handleNext = async () => {
    try {
      const values = await form.validateFields(); // Validate form fields
      const currentStepData = steps[currentStep];

      // Initialize an array to hold the note objects
      const notesArray = [];

      // Handle step 1 separately (Chief Complaints & Allegations)
      if (currentStepData.key === "1") {
        // Chief Complaints (NotesType 1)
        if (values["1"]) {
          notesArray.push({
            myAction: "create",
            recId: "",
            notesType: "1", // NotesType for Chief Complaints
            notes: values["1"],
            treatmentNo: treatmentNo,
            patientNo: patientNo,
          });
        }

        // Allegations (NotesType 2)
        if (values["2"]) {
          notesArray.push({
            myAction: "create",
            recId: "",
            notesType: "2", // NotesType for Allegations
            notes: values["2"],
            treatmentNo: treatmentNo,
            patientNo: patientNo,
          });
        }
      } else {
        // For other steps, process each note as its respective NotesType
        const fieldNames = Object.keys(values);
        fieldNames.forEach((fieldName) => {
          if (values[fieldName]) {
            // Determine NotesType for the current step
            let notesType = "";
            switch (currentStepData.key) {
              case "2":
                notesType = "3"; // History of Presenting Illness
                break;
              case "3":
                notesType = "4"; // Risk & Medical History
                break;
              case "4":
                notesType = "5"; // Family & Personal History
                break;
              case "5":
                notesType = "6"; // Forensic & Premorbid Personality
                break;
              case "6":
                notesType = "7"; // Social History
                break;
              case "7":
                notesType = "8"; // Family History
                break;
              case "8":
                notesType = "9"; // Personal History
                break;
              case "9":
                notesType = "10"; // Premorbid Personality
                break;
              default:
                break;
            }

            // Add the note for the current field and NotesType
            notesArray.push({
              myAction: "create",
              recId: "",
              notesType: notesType,
              notes: values[fieldName],
              treatmentNo: treatmentNo,
              patientNo: patientNo,
            });
          }
        });
      }

      // Remove empty notes
      const nonEmptyNotes = notesArray.filter(
        (note) => note.notes.trim() !== ""
      );

      // Dispatch each non-empty note separately
      nonEmptyNotes.forEach((note) => dispatch(postPatientHistoryNotes(note)));

      // Move to the next step
      setCurrentStep((prev) => prev + 1);
    } catch (error) {
      console.error("Validation failed:", error);
    }
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
        <FileOutlined /> Patient History
      </Typography.Text>
      <Steps current={currentStep} size="small" style={{ marginBottom: 24 }}>
        {steps.map((step) => (
          <Step key={step.key} title={step.title} />
        ))}
      </Steps>
      <Form form={form} layout="vertical">
        {steps[currentStep].content}
        <div className="steps-action">
          {currentStep > 0 && (
            <Button style={{ marginRight: 8 }} onClick={handlePrev}>
              Previous
            </Button>
          )}
          {currentStep < steps.length - 1 && (
            <Button type="primary" onClick={handleNext}>
              Next
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button type="primary" onClick={handleNext}>
              Submit
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default PatientSigns;
