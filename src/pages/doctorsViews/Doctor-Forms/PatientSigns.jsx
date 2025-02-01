import React, { useEffect, useState, useMemo } from "react";
import { Button, Steps, Form, Input, Typography, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { FileOutlined } from "@ant-design/icons";
import { postPatientHistoryNotes } from "../../../actions/Doc-actions/posPatientHistoryNotes";
import { getPatientHistorySlice } from "../../../actions/Doc-actions/getPatientHistoryNotes";
import PatientHistoryNotesTable from "../tables/PatientHistoryNotesTable";
import useAuth from "../../../hooks/useAuth";

const { TextArea } = Input;
const { Step } = Steps;

// Mapping form keys to the corresponding API note type titles.
const notesTypeMap = {
  "1": "Chief Complaints",
  "2": "Allegations",
  "3": "History of Presenting Illness",
  "5": "Past Psychiatric and Medical History",
  "6": "Family History",
  "7": "Personal History",
  "8": "Forensic History",
  "9": "Premorbid Personality",
  "20": "Medical",
  "23": "Gynecology"
};

const PatientSigns = ({ treatmentNo, patientNo, moveToNextTab }) => {
  const role = useAuth().userData.departmentName;
  const { loading: saveNotesLoading } = useSelector(
    (state) => state.postPatientHistory
  );
  const { data } = useSelector(
    (state) => state.getPatientHistoryNotesReducer
  );

  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // Fetch patient history notes when treatmentNo is available.
  useEffect(() => {
    if (treatmentNo) {
      dispatch(getPatientHistorySlice(treatmentNo));
    }
  }, [dispatch, treatmentNo]);

  // Build initial form values based on the fetched data.
  // The keys here match those in notesTypeMap.
  const initialValues = useMemo(() => ({
    "1":
      data.filter((note) => note.Notes_Type === notesTypeMap["1"]).at(0)
        ?.Notes || "",
    "2":
      data.filter((note) => note.Notes_Type === notesTypeMap["2"]).at(0)
        ?.Notes || "",
    "3":
      data.filter((note) => note.Notes_Type === notesTypeMap["3"]).at(0)
        ?.Notes || "",
    "5":
      data.filter((note) => note.Notes_Type === notesTypeMap["5"]).at(0)
        ?.Notes || "",
    "6":
      data.filter((note) => note.Notes_Type === notesTypeMap["6"]).at(0)
        ?.Notes || "",
    "7":
      data.filter((note) => note.Notes_Type === notesTypeMap["7"]).at(0)
        ?.Notes || "",
    "8":
      data.filter((note) => note.Notes_Type === notesTypeMap["8"]).at(0)
        ?.Notes || "",
    "9":
      data.filter((note) => note.Notes_Type === notesTypeMap["9"]).at(0)
        ?.Notes || "",
    "20":
      data.filter((note) => note.Notes_Type === notesTypeMap["20"]).at(0)
        ?.Notes || "",
    "23":
      data.filter((note) => note.Notes_Type === notesTypeMap["23"]).at(0)
        ?.Notes || ""
  }), [data]);

  // Track the latest saved notes using the same keys as initialValues.
  const [lastSavedNotes, setLastSavedNotes] = useState(initialValues);

  // Set form fields when initial values change.
  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  const steps = [
    {
      key: "1",
      title: "Chief Complaints & Allegations",
      content: (
        <>
          <Form.Item
            name="1"
            label="Chief Complaints"
            rules={[{ required: true }]}
          >
            <TextArea
              placeholder="Enter chief complaints..."
              autoSize={{ minRows: 3 }}
            />
          </Form.Item>
          <Form.Item name="2" label="Allegations">
            <TextArea
              placeholder="Enter allegations..."
              autoSize={{ minRows: 3 }}
            />
          </Form.Item>
        </>
      ),
      notesType: ["1", "2"]
    },
    {
      key: "2",
      title: "History of Presenting Illness",
      content: (
        <Form.Item
          name="3"
          label="History of Presenting Illness"
          rules={[{ required: true }]}
        >
          <TextArea
            placeholder="Describe the illness..."
            autoSize={{ minRows: 4 }}
          />
        </Form.Item>
      ),
      notesType: ["3"]
    },
    {
      key: "3",
      title: "Past Psychiatric and Medical History",
      content: (
        <>
          <Form.Item name="20" label="Medical">
            <TextArea
              placeholder="Enter past medical notes..."
              autoSize={{ minRows: 4 }}
            />
          </Form.Item>
          <Form.Item
            name="5"
            label="Past Psychiatric History"
            rules={[{ required: true }]}
          >
            <TextArea
              placeholder="Enter past psychiatric history..."
              autoSize={{ minRows: 4 }}
            />
          </Form.Item>
          <Form.Item name="23" label="Obstetric & Gynecology">
            <TextArea
              placeholder="Enter past obstetric & gynecology notes..."
              autoSize={{ minRows: 4 }}
            />
          </Form.Item>
        </>
      ),
      notesType: ["5", "20", "23"]
    },
    {
      key: "4",
      title: "Family & Personal History",
      content: (
        <>
          <Form.Item name="6" label="Family History">
            <TextArea
              placeholder="Enter family history..."
              autoSize={{ minRows: 3 }}
            />
          </Form.Item>
          <Form.Item name="7" label="Personal History">
            <TextArea
              placeholder="Enter personal history..."
              autoSize={{ minRows: 3 }}
            />
          </Form.Item>
        </>
      ),
      notesType: ["6", "7"]
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
      notesType: ["8", "9"]
    }
  ];

  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      const currentStepData = steps[currentStep];

      // For each field in the current step, determine if we should create or edit.
      const updatedNotes = currentStepData.notesType
        .map((key) => {
          // Lookup the corresponding API note type title.
          const actualNotesType = notesTypeMap[key];
          // Find an existing note by matching on the title.
          const existingNote = data.find(
            (note) => note.Notes_Type === actualNotesType
          );
          return {
            formKey: key,
            myAction: existingNote ? "edit" : "create",
            recId: existingNote ? existingNote.SystemId : "",
            // Always pass the integer value from the form key.
            notesType: parseInt(key, 10),
            notes: values[key],
            treatmentNo,
            patientNo
          };
        })
        // Only send notes that are non-empty and that have changed.
        .filter((note) =>
          note.notes?.trim() !== "" &&
          note.notes !== lastSavedNotes[note.formKey]
        );

      if (updatedNotes.length) {
        console.log("updatedNotes", updatedNotes);
        const results = await Promise.all(
          updatedNotes.map((note) => dispatch(postPatientHistoryNotes(note)))
        );
        if (results.every((res) => res === "success")) {
          message.success("Notes saved successfully!");
          // Update the lastSavedNotes for the corresponding fields.
          setLastSavedNotes((prev) => ({
            ...prev,
            ...Object.fromEntries(
              updatedNotes.map((note) => [note.formKey, note.notes])
            )
          }));
          // Refresh the notes data.
          dispatch(getPatientHistorySlice(treatmentNo));
        } else {
          message.error("Failed to save some notes.");
        }
      }

      // Move to the next step or finish.
      if (currentStep === steps.length - 1) {
        moveToNextTab();
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Validation failed:", err);
    }
  };

  const handlePrev = () => setCurrentStep((prev) => prev - 1);

  return (
    <div className="mt-4">
      <Typography.Text style={{ fontWeight: "bold", color: "#0f5689" }}>
        <FileOutlined /> Patient History Notes
      </Typography.Text>
      {(role === "Doctor" || role === "Psychology") && (
        <>
          <Steps current={currentStep} size="small" style={{ marginBottom: 24 }}>
            {steps.map((step) => (
              <Step key={step.key} title={step.title} />
            ))}
          </Steps>
          <Form form={form} layout="vertical">
            {steps[currentStep].content}
            <div className="steps-action">
              {currentStep > 0 && (
                <Button onClick={handlePrev}>Previous</Button>
              )}
              <Button
                type="primary"
                loading={saveNotesLoading}
                onClick={handleNext}
              >
                {currentStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </Form>
        </>
      )}
      <PatientHistoryNotesTable data={data} />
    </div>
  );
};

export default PatientSigns;
