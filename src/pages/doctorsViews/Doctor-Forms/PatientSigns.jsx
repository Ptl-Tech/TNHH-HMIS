import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Form,
  Input,
  Popconfirm,
  message,
  Typography,
  Steps,
  Radio,
  Checkbox,
  DatePicker,
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
const { TextArea } = Input;
const { Step } = Steps;
const PatientSigns = ({ treatmentNo }) => {
  
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
        Patient History
      </Typography.Text>
      <>
              <Steps
                current={currentStep}
                size="small"
                style={{ marginBottom: 24, marginTop: 24 }}
              >
                <Step title="Chief Complaints & Allegations" />
                <Step title="History of Presenting Illness" />
                <Step title="Risk & Medical History" />
                <Step title="Family & Personal History" />
                <Step title="Forensic & Premorbid Personality" />
              </Steps>

              <Form
                name="medicalHistoryForm"
                onFinish={handleFinish}
                initialValues={formData}
                layout="vertical"
              >
                {currentStep === 0 && (
                  <>
                    <Form.Item
                      name="chiefComplaints"
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
                      name="allegations"
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
                )}

                {currentStep === 1 && (
                  <>
                    <Form.Item
                      name="historyOfIllness"
                      label="History of Presenting Illness"
                      rules={[
                        {
                          required: true,
                          message:
                            "Please provide details of presenting illness!",
                        },
                      ]}
                    >
                      <TextArea
                        placeholder="Describe the illness in detail..."
                        autoSize={{ minRows: 4, maxRows: 8 }}
                      />
                    </Form.Item>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <Form.Item
                      name="riskHistory"
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
                    <Form.Item
                      name="psychiatricHistory"
                      label="Past Psychiatric & Medical History"
                    >
                      <TextArea
                        placeholder="Enter psychiatric and medical history..."
                        autoSize={{ minRows: 3 }}
                      />
                    </Form.Item>
                    <Form.Item
                      name="substanceUse"
                      label="Substance Use"
                      valuePropName="checked"
                    >
                      <Checkbox>Has a history of substance use</Checkbox>
                    </Form.Item>
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <Form.Item name="familyHistory" label="Family History">
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
                )}

                {currentStep === 4 && (
                  <>
                    <Form.Item name="forensicHistory" label="Forensic History">
                      <TextArea
                        placeholder="Enter forensic history..."
                        autoSize={{ minRows: 3 }}
                      />
                    </Form.Item>
                    <Form.Item
                      name="premorbidPersonality"
                      label="Premorbid Personality"
                    >
                      <TextArea
                        placeholder="Describe premorbid personality..."
                        autoSize={{ minRows: 3 }}
                      />
                    </Form.Item>
                  </>
                )}

                <div className="steps-action">
                  {currentStep > 0 && (
                    <Button style={{ marginRight: 8 }} onClick={handlePrev}>
                      Previous
                    </Button>
                  )}
                  {currentStep < 4 && (
                    <Button type="primary" onClick={handleNext}>
                      Next
                    </Button>
                  )}
                  {currentStep === 4 && (
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

export default PatientSigns;
