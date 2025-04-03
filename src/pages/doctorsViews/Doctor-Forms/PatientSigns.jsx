import { useEffect, useState, useMemo } from "react";
import { Button, Steps, Form, Input, Typography, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { FileOutlined } from "@ant-design/icons";
import { postPatientHistoryNotes } from "../../../actions/Doc-actions/posPatientHistoryNotes";
import { getPatientHistorySlice } from "../../../actions/Doc-actions/getPatientHistoryNotes";
import PatientHistoryNotesTable from "../tables/PatientHistoryNotesTable";
import useAuth from "../../../hooks/useAuth";
import { useLocation } from "react-router-dom";
import Loading from "../../../partials/nurse-partials/Loading";

const { TextArea } = Input;
const { Step } = Steps;

const PatientSigns = ({ treatmentNo, patientNo, moveToNextTab }) => {
  const role = useAuth().userData.departmentName;
  const location = useLocation();
  const patientDetails = location.state?.patientDetails;
  const { loading: saveNotesLoading } = useSelector(
    (state) => state.postPatientHistory
  );
  const { loading:loadingHistory, data } = useSelector((state) => state.getPatientHistoryNotesReducer);

  const notesType = [
    { value: "1", label: "Chief Complaints" },
    { value: "2", label: "Allegations" },
    { value: "3", label: "History of Presenting Complaint" },
    { value: "4", label: "Past Psychiatric and Medical History" },
    { value: "5", label: "Family History" },
    { value: "6", label: "Personal History" },
    { value: "7", label: "Forensic History" },
    { value: "8", label: "Premorbid Personality" },
    { value: "9", label: "Medical" },
    { value: "10", label: "Gynecology" },
  ];

  const filterCollapseData = data.filter((item) =>
    notesType.map((note) => note.label).includes(item.Notes_Type)
  );

  const allNotesPresent = notesType.every((note) =>
    filterCollapseData.some((item) => item.Notes_Type === note.label)
  );
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
  const initialValues = useMemo(
    () => ({
      1:
        data.filter((note) => note.Notes_Type === "Chief Complaints").at(-1)
          ?.Notes || "",
      2:
        data.filter((note) => note.Notes_Type === "Allegations").at(-1)
          ?.Notes || "",
      3:
        data
          .filter(
            (note) => note.Notes_Type === "History of Presenting Complaint"
          )
          .at(-1)?.Notes || "",
      5:
        data
          .filter(
            (note) => note.Notes_Type === "Past Psychiatric and Medical History"
          )
          .at(-1)?.Notes || "",
      6:
        data.filter((note) => note.Notes_Type === "Family History").at(-1)
          ?.Notes || "",
      7:
        data.filter((note) => note.Notes_Type === "Personal History").at(-1)
          ?.Notes || "",
      8:
        data.filter((note) => note.Notes_Type === "Forensic History").at(-1)
          ?.Notes || "",
      9:
        data
          .filter((note) => note.Notes_Type === "Premorbid Personality")
          .at(-1)?.Notes || "",
      20:
        data.filter((note) => note.Notes_Type === "Medical History").at(-1)?.Notes ||
        "",
      23:
        data.filter((note) => note.Notes_Type === "Gynecology").at(-1)?.Notes ||
        "",
    }),
    [data]
  );

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
          <Form.Item
            name="1"
            label="Presentation by Patient "
            rules={[{ required: true }]}
          >
            <TextArea
              placeholder="Enter presentation by patient..."
              autoSize={{ minRows: 3 }}
            />
          </Form.Item>
          <Form.Item name="2" label="Presentation by Family" rules={[{ required: true }]}>
            <TextArea
              placeholder="Enter presentation by family..."
              autoSize={{ minRows: 3 }}
            />
          </Form.Item>
        </>
      ),
      notesType: ["1", "2"],
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
      notesType: ["3"],
    },
    {
      key: "3",
      title: "Past Psychiatric and Medical History",
      content: (
        <>
          <Form.Item name="20" label="Past Medical History" rules={[{ required: true }]}>
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
              placeholder="Enter past psychiatric History..."
              autoSize={{ minRows: 4 }}
            />
          </Form.Item>
          <Form.Item
            name="23"
            label="Past Obstetric & Gynecology Notes"
            // rules={[{ required: true }]}
          >
            <TextArea
              placeholder="Enter past Obstetric & Gynecology notes..."
              autoSize={{ minRows: 4 }}
            />
          </Form.Item>
        </>
      ),
      notesType: ["5", "20", "23"],
    },
    {
      key: "4",
      title: "Family & Personal History",
      content: (
        <>
          <Form.Item
            name="6"
            label="Family History"
            rules={[{ required: true }]}
          >
            <TextArea
              placeholder="Enter family history..."
              autoSize={{ minRows: 3 }}
            />
          </Form.Item>
          <Form.Item
            name="7"
            label="Personal History"
            rules={[{ required: true }]}
          >
            <TextArea
              placeholder="Enter personal history..."
              autoSize={{ minRows: 3 }}
            />
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
          <Form.Item
            name="8"
            label="Forensic History"
            rules={[{ required: true }]}
          >
            <TextArea
              placeholder="Enter forensic history..."
              autoSize={{ minRows: 3 }}
            />
          </Form.Item>
          <Form.Item
            name="9"
            label="Premorbid Personality"
            rules={[{ required: true }]}
          >
            <TextArea
              placeholder="Describe premorbid personality..."
              autoSize={{ minRows: 3 }}
            />
          </Form.Item>
        </>
      ),
      notesType: ["8", "9"],
    },
  ];

  const handleNext = async () => {
    console.log("button clicked 1");
    try {
      // Ensure latest form values are retrieved
      const values = await form.validateFields();
      
      // Ensure correct step data
      const currentStepData = steps[currentStep];
    
      // Generate updated notes
      const updatedNotes =
        currentStepData?.notesType?.map((type) => ({
          myAction: "create",
          recId: "",
          notesType: type,
          notes: values[type], // Ensure values[type] exists
          treatmentNo,
          patientNo,
        })) || []; // Ensure it doesn't become undefined
  
      console.log("button clicked 3", updatedNotes);
  
      if (updatedNotes.length > 0) {
  
        // Ensure dispatch works correctly
        const results = await Promise.all(
          updatedNotes.map(async (note) => {
            const response = await dispatch(postPatientHistoryNotes(note));
            return response.payload || response; // Ensure proper response handling
          })
        );
  
        // Check for success
        if (results.every((res) => res === "success")) {
          message.success("Notes saved successfully!");
  
          // Ensure state updates properly
          setLastSavedNotes((prev) => ({
            ...prev,
            ...Object.fromEntries(
              updatedNotes.map((note) => [note.notesType, note.notes])
            ),
          }));
  
          dispatch(getPatientHistorySlice(treatmentNo));
        } else {
          message.error("Failed to save some notes.");
        }
      } else {
        console.warn("No updated notes found, skipping API call.");
      }
  
      // Move to the next step
      if (currentStep === steps.length - 1) {
        moveToNextTab();
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Error occurred:", err);
    }
  };
  

  const handlePrev = () => setCurrentStep((prev) => prev - 1);
  // console.log(currentStep, 'currentStep');

  if (!patientDetails) return <Loading />;

  return (
    <div className="mt-4">
      <Typography.Text style={{ fontWeight: "bold", color: "#0f5689" }}>
        <FileOutlined /> Patient History Notes
      </Typography.Text>
      {(role === "Doctor" || role === "Psychology") &&
        !allNotesPresent &&
        patientDetails?.Status !== "Completed" && (
          <>
            <Steps
              current={currentStep}
              size="small"
              style={{ marginBottom: 24 }}
            >
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

      <PatientHistoryNotesTable data={data} patientDetails={patientDetails} loadingHistory={loadingHistory}/>
    </div>
  );
};

export default PatientSigns;
