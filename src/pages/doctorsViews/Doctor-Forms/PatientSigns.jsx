import React, { useEffect, useState, useMemo } from "react";
import { Button, Steps, Form, Input, Typography, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { FileOutlined } from "@ant-design/icons";
import { postPatientHistoryNotes } from "../../../actions/Doc-actions/posPatientHistoryNotes";
import { getPatientHistorySlice } from "../../../actions/Doc-actions/getPatientHistoryNotes";

const { TextArea } = Input;
const { Step } = Steps;

const PatientSigns = ({ treatmentNo, patientNo }) => {
  const { loading: saveNotesLoading } = useSelector((state) => state.postPatientHistory);
  const { data } = useSelector((state) => state.getPatientHistoryNotesReducer);

  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // Fetch patient history notes
  useEffect(() => {
    if (treatmentNo) {
      dispatch(getPatientHistorySlice(treatmentNo));
    }
  }, [dispatch, treatmentNo]);

  // Extract initial values for the form
  const initialValues = useMemo(() => ({
    1: data.filter((note) => note.Notes_Type === "Chief Complaints").at(-1)?.Notes || "",
    2: data.filter((note) => note.Notes_Type === "Allegations").at(-1)?.Notes || "",
    4: data.filter((note) => note.Notes_Type === "History of Presenting Complaint").at(-1)?.Notes || "",
    7: data.filter((note) => note.Notes_Type === "Family History").at(-1)?.Notes || "",
    personalHistory: data.filter((note) => note.Notes_Type === "Personal History").at(-1)?.Notes || "",
    8: data.filter((note) => note.Notes_Type === "Forensic History").at(-1)?.Notes || "",
    9: data.filter((note) => note.Notes_Type === "Premorbid Personality").at(-1)?.Notes || "",
  }), [data]);


  //tracking last saved notes
  const [lastSavedNotes, setLastSavedNotes] = useState(initialValues);

  // Initialize form fields with initial values
  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  const steps = [
    {
      key: "1",
      title: "Chief Complaints & Allegations",
      content: (
        <>
          <Form.Item name="1" label="Chief Complaints" rules={[{ required: true }]}>
            <TextArea placeholder="Enter chief complaints..." autoSize={{ minRows: 3 }} />
          </Form.Item>
          <Form.Item name="2" label="Allegations">
            <TextArea placeholder="Enter allegations..." autoSize={{ minRows: 3 }} />
          </Form.Item>
        </>
      ),
      notesType: ["1", "2"],
    },
    {
      key: "2",
      title: "History of Presenting Illness",
      content: (
        <Form.Item name="3" label="History of Presenting Illness" rules={[{ required: true }]}>
          <TextArea placeholder="Describe the illness..." autoSize={{ minRows: 4 }} />
        </Form.Item>
      ),
      notesType: ["3"],
    },
    {
      key: "3",
      title: "Past Psychiatric and Medical History",
      content: (
        <Form.Item name="5" label="Past Psychiatric and Medical History" rules={[{ required: true }]}>
          <TextArea placeholder="Enter past psychiatric and medical history..." autoSize={{ minRows: 4 }} />
        </Form.Item>
      ),
      notesType: ["5"],

    },
    {
      key: "4",
      title: "Family & Personal History",
      content: (
        <>
          <Form.Item name="6" label="Family History">
            <TextArea placeholder="Enter family history..." autoSize={{ minRows: 3 }} />
          </Form.Item>
          <Form.Item name="7" label="Personal History">
            <TextArea placeholder="Enter personal history..." autoSize={{ minRows: 3 }} />
          </Form.Item>
        </>
      ),
      notesType: ["6", "7"],
    },
    {
      key: "5",
      title: "Forensic & Premorbid Personality",
      content: (
        <>
          <Form.Item name="8" label="Forensic History">
            <TextArea placeholder="Enter forensic history..." autoSize={{ minRows: 3 }} />
          </Form.Item>
          <Form.Item name="9" label="Premorbid Personality">
            <TextArea placeholder="Describe premorbid personality..." autoSize={{ minRows: 3 }} />
          </Form.Item>
        </>
      ),
      notesType: ["8", "9"],
    },
  ];

  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      const currentStepData = steps[currentStep];
      const updatedNotes = currentStepData.notesType
        .map((type) => ({
          myAction: "create",
          recId: "",
          notesType: type,
          notes: values[type],
          treatmentNo,
          patientNo,
        }))
        .filter((note) => note.notes?.trim() !== "" && !lastSavedNotes[note.notesType]);

      if (updatedNotes.length) {
        const results = await Promise.all(updatedNotes.map((note) => dispatch(postPatientHistoryNotes(note))));
        if (results.every((res) => res === "success")) {
          message.success("Notes saved successfully!");
          setLastSavedNotes((prev) => ({ ...prev, ...Object.fromEntries(updatedNotes.map((note) => [note.notesType, note.notes])) }));
        } else {
          message.error("Failed to save some notes.");
        }
      }

      // set the current step to the next step or the last step if it's the last step
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    } catch (err) {
      console.error("Validation failed:", err);
    }
  };

  const handlePrev = () => setCurrentStep((prev) => prev - 1);

  return (
    <div className="mt-4">
      <Typography.Text style={{ fontWeight: "bold", color: "#0f5689" }}>
        <FileOutlined /> Patient History
      </Typography.Text>
      <Steps current={currentStep} size="small" style={{ marginBottom: 24 }}>
        {steps.map((step) => (
          <Step key={step.key} title={step.title} />
        ))}
      </Steps>
      <Form form={form} layout="vertical">
        {steps[currentStep].content}
        <div className="steps-action  ">
          {currentStep > 0 && <Button onClick={handlePrev}>Previous</Button>}
          <Button type="primary" loading={saveNotesLoading} onClick={handleNext}>
            {currentStep === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default PatientSigns;
