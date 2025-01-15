import React, { useEffect, useState } from "react";
import { Button, Steps, Form, Input, Checkbox, Typography, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { FileOutlined } from "@ant-design/icons";
import { postPatientHistoryNotes } from "../../../actions/Doc-actions/posPatientHistoryNotes";
import { getPatientHistorySlice } from "../../../actions/Doc-actions/getPatientHistoryNotes";
import { useMemo } from "react";


const { TextArea } = Input;
const { Step } = Steps;

const PatientSigns = ({ treatmentNo, patientNo }) => {
  const{loading:saveNotesLoading}=useSelector(state=>state.postPatientHistory)
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { data } = useSelector((state) => state.getPatientHistoryNotesReducer);

  console.log('patient No:', patientNo)

  useEffect(() => {
    if (patientNo) {
      dispatch(getPatientHistorySlice(patientNo));
    }
  }, [dispatch, patientNo]);

  const initialValues = useMemo(() => ({
    1: data.filter((note) => note.Notes_Type === "Chief Complaints").at(-1)?.Notes || "",
    2: data.filter((note) => note.Notes_Type === "Allegations").at(-1)?.Notes || "",
    4: data.filter((note) => note.Notes_Type === "History of Presenting Complaint").at(-1)?.Notes || "",
    5: data.filter((note) => note.Notes_Type === "Family History").at(-1)?.Notes || "",
    6: data.filter((note) => note.Notes_Type === "4").at(-1)?.Notes || "",
    substanceUse: data.filter((note) => note.Notes_Type === "4").at(-1)?.Notes || "",
    7: data.filter((note) => note.Notes_Type === "Family History").at(-1)?.Notes || "",
    personalHistory: data.filter((note) => note.Notes_Type === "Personal History").at(-1)?.Notes || "",
    8: data.filter((note) => note.Notes_Type === "Forensic History").at(-1)?.Notes || "",
    9: data.filter((note) => note.Notes_Type === "Premorbid Personality").at(-1)?.Notes || "",
  }), [data]);

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
            label="Chief Complaints (Put own words and duration)"
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
                required: false,
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
    // {
    //   key: "3",
    //   title: "Risk & Medical History",
    //   content: (
    //     <>
    //       <Form.Item
    //         name="5"
    //         label="Risk History"
    //         rules={[
    //           {
    //             required: true,
    //             message: "Please enter the risk history!",
    //           },
    //         ]}
    //       >
    //         <TextArea
    //           placeholder="Enter risk history..."
    //           autoSize={{ minRows: 3 }}
    //         />
    //       </Form.Item>
    //       <Form.Item name="6" label="Past Psychiatric & Medical History">
    //         <TextArea
    //           placeholder="Enter psychiatric and medical history..."
    //           autoSize={{ minRows: 3 }}
    //         />
    //       </Form.Item>
    //       <Form.Item name="substanceUse" valuePropName="checked">
    //         <Checkbox>History of substance use</Checkbox>
    //       </Form.Item>
    //     </>
    //   ),
    //   notesType: "4",
    // },
    {
      key: "3",
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
      key: "4",
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

      const notesArray = [];

      if (currentStepData.key === "1") {
        if (values["1"]) {
          notesArray.push({
            myAction: "create",
            recId: "",
            notesType: "1",
            notes: values["1"],
            treatmentNo: treatmentNo,
            patientNo: patientNo,
          });
        }

        if (values["2"]) {
          notesArray.push({
            myAction: "create",
            recId: "",
            notesType: "2",
            notes: values["2"],
            treatmentNo: treatmentNo,
            patientNo: patientNo,
          });
        }
      } else {
        const fieldNames = Object.keys(values);
        fieldNames.forEach((fieldName) => {
          if (values[fieldName]) {
            notesArray.push({
              myAction: "create",
              recId: "",
              notesType: currentStepData.notesType,
              notes: values[fieldName],
              treatmentNo: treatmentNo,
              patientNo: patientNo,
            });
          }
        });
      }

      const nonEmptyNotes = notesArray.filter((note) => note.notes.trim() !== "");

      if (nonEmptyNotes.length > 0) {
        const results = await Promise.all(
          nonEmptyNotes.map((note) => dispatch(postPatientHistoryNotes(note)))
        );

        const allSuccess = results.every((status) => status === "success");
        if (allSuccess) {
          message.success("Notes Saved Successfully!");
        } else {
          message.error("Failed to complete some notes. Please try again.");
        }
      }

      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        // form.resetFields();
        setCurrentStep(0);
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };
  /* const handleFinal = async () => {
    try {
      const values = await form.validateFields(); // Validate form fields
      const currentStepData = steps[currentStep];

      const notesArray = [];

      if (currentStepData.key === "1") {
        if (values["1"]) {
          notesArray.push({
            myAction: "create",
            recId: "",
            notesType: "1",
            notes: values["1"],
            treatmentNo: treatmentNo,
            patientNo: patientNo,
          });
        }

        if (values["2"]) {
          notesArray.push({
            myAction: "create",
            recId: "",
            notesType: "2",
            notes: values["2"],
            treatmentNo: treatmentNo,
            patientNo: patientNo,
          });
        }
      } else {
        const fieldNames = Object.keys(values);
        fieldNames.forEach((fieldName) => {
          if (values[fieldName]) {
            notesArray.push({
              myAction: "create",
              recId: "",
              notesType: currentStepData.notesType,
              notes: values[fieldName],
              treatmentNo: treatmentNo,
              patientNo: patientNo,
            });
          }
        });
      }

      const nonEmptyNotes = notesArray.filter((note) => note.notes.trim() !== "");

      if (nonEmptyNotes.length > 0) {
        const results = await Promise.all(
          nonEmptyNotes.map((note) => dispatch(postPatientHistoryNotes(note)))
        );

        const allSuccess = results.every((status) => status === "success");
        if (allSuccess) {
          message.success("Notes Saved Successfully!");
        } else {
          message.error("Failed to complete some notes. Please try again.");
        }
      }

      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        form.resetFields();
        setCurrentStep(0);
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  }; */

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
            <Button type="primary" loading={saveNotesLoading} onClick={handleNext}>
              Next
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button type="primary" loading={saveNotesLoading} onClick={handleNext}>
              Submit
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default PatientSigns;
