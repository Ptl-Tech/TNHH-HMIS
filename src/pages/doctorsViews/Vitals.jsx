import React, { useEffect, useState } from "react";
import { Button, Col, Divider, Form, Input, message, Row, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  getPatientVitalsLinesSlice,
  getVitalsLinesSlice,
} from "../../actions/triage-actions/getVitalsLinesSlice";
import Loading from "../../partials/nurse-partials/Loading";
import { PlusOutlined } from "@ant-design/icons";
import { IoListOutline } from "react-icons/io5";
import { updateTriageListVitalsSlice } from "../../actions/triage-actions/updateTriageListVitalsSlice";
import { postTriageListVitalsSlice } from "../../actions/triage-actions/postTriageListVitalsSlice";

const FormVitals = ({ observationNo, patientNo }) => {
  const [form] = Form.useForm();
  const [showForm, setShowForm] = useState(false); // Toggle between table and form
  const dispatch = useDispatch();

  const { loading: loadingVitalsLines, vitals: vitalsLines } = useSelector(
    (state) => state.getPatientVital
  );

  const columns = [
    {
      title: "Observation No",
      dataIndex: "ObservationNo",
      key: "ObservationNo",
      render: (text) => (
        <span style={{ fontWeight: "bold", color: "#0f5689" }}>{text}</span>
      ),
    },
    { title: "Temperature (°C)", dataIndex: "temperature", key: "temperature" },
    { title: "Pulse Rate", dataIndex: "pulseRate", key: "pulseRate" },
    {
      title: "Respiration Rate",
      dataIndex: "respirationRate",
      key: "respirationRate",
    },
    {
      title: "Blood Pressure",
      dataIndex: "bloodPreasure",
      key: "bloodPreasure",
    },
    { title: "SpO₂", dataIndex: "sP02", key: "sP02" },
    { title: "Pain", dataIndex: "pain", key: "pain" },
    { title: "Height (cm)", dataIndex: "height", key: "height" },
    { title: "Weight (kg)", dataIndex: "weight", key: "weight" },
    {
      title: "BMI",
      dataIndex: "BMI",
      key: "BMI",
      render: (text) => (text !== "-" ? parseFloat(text).toFixed(2) : "-"),
    },
  ];

  // Check if vitalsLines is an object, and map its values into an array
  const dataSource = vitalsLines
    .filter((item) => {
      // Filter based on the observationNo or patientNo, modify this as per your needs
      return (
        item.ObservationNo === observationNo || item.PatientNo === patientNo
      );
    })
    .map((item) => ({
      key: item.LineNo, // Unique key for each row
      ObservationNo: item.ObservationNo,
      temperature: item.Temperature,
      pulseRate: item.PulseRate,
      respirationRate: item.RespirationRate,
      bloodPreasure: item.BloodPressure,
      sP02: item.SP02,
      pain: item.Pain,
      height: item.Height,
      weight: item.Weight,
      BMI: item.BMI,
    }));

  useEffect(() => {
    dispatch(getPatientVitalsLinesSlice());
  }, [dispatch]);

  const handleToggleForm = () => {
    setShowForm(!showForm);
  };

  const onFinish = async (values) => {
    try {
      const {
        pulseRate,
        pain,
        height,
        weight,
        temperature,
        bloodPreasure,
        sP02,
        respirationRate,
      } = values.vitals;

      // Transform values
      const transformedValues = {
        pulseRate,
        // pain: parseInt(cleanValue(pain)),
        // height: parseFloat(cleanValue(height)),
        // weight: parseFloat(cleanValue(weight)),
        temperature: parseFloat(cleanValue(temperature)),
        bloodPreasure,
        sP02,
        respirationRate,
        // BMI: calculateBMI(height, weight),
      };

      // Common payload properties
      const baseVitals = {
        ...transformedValues,
        patientNo: patientNo,
        observationNo: observationNo,
      };

      // Create new vitals record
      const createVitals = {
        ...baseVitals,
        type: 0,
        myAction: "create",
      };

    await dispatch(postTriageListVitalsSlice(createVitals)).then((data)=>{
      if (data) {
        message.success("Vitals successfully saved");
         dispatch(getPatientVitalsLinesSlice());
        //show the table and hide the form
         setShowForm(true);
      } else {
        message.error("Error saving vitals data");
      }
    })
      
           
    } catch (error) {
      // Generic error handling
      message.error("An error occurred while saving vitals data.");
      console.error("Error saving vitals:", error);
    }
  };

  const cleanValue = (value) => {
    if (typeof value === "string") {
      return value.replace(/[^\d.-]/g, "");
    }
    return value;
  };

  const calculateBMI = (height, weight) => {
    if (!height || !weight) {
      return null;
    }
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(2);
  };
  const handleValuesChange = (_, allValues) => {
    const { height, weight } = allValues.vitals || {};
    if (height && weight) {
      const bmi = calculateBMI(height, weight);
      form.setFieldsValue({
        vitals: { ...allValues.vitals, bmi }, // Update BMI field
      });
    }
  };

  return (
    <div>
      {loadingVitalsLines ? (
        <Loading />
      ) : (
        <div>
          {!showForm ? (
            <>
            <div className="d-flex justify-content-end ">
           
              <Button
                type="primary"
                onClick={handleToggleForm}
                icon={<PlusOutlined />}
              >
                Add Vitals
              </Button>
            
            </div>
            <Divider />
              <Table
                columns={columns}
                dataSource={dataSource}
                pagination={{
                  position: ["bottom", "right"],
                  showSizeChanger: true,
                  pageSize: 10,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`,
                }}
              />
              
            </>
          ) : (
            <Form
              layout="vertical"
              form={form}
              onFinish={onFinish}
              initialValues={{
                vitals: {
                  pulseRate: "",
                  bloodPreasure: "",
                  temperature: "",
                  sP02: "",
                  height: "",
                  weight: "",
                  respirationRate: "",
                  pain: 0,
                  bmi: "0.0",
                },
              }}
              autoComplete="off"
              onValuesChange={handleValuesChange}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Pulse Rate (bpm)"
                    name={["vitals", "pulseRate"]}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Please input pulse rate!",
                      },
                      {
                        pattern: /^[0-9]+$/, // Validate numeric input
                        message: "Pulse rate must be a valid number!",
                      },
                      {
                        validator: (_, value) => {
                          if (!value) {
                            return Promise.resolve(); // Skip if no value (handled by required rule)
                          }
                          if (value < 40 || value > 180) {
                            return Promise.reject(
                              new Error(
                                "Pulse rate must be between 40 and 180 bpm!"
                              )
                            );
                          }
                          return Promise.resolve(); // Valid input
                        },
                      },
                    ]}
                  >
                    <Input type="text" placeholder="eg 70" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Blood Pressure (mmHg)"
                    name={["vitals", "bloodPreasure"]}
                    validateTrigger={["onBlur", "onChange"]}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Blood Pressure is required!",
                      },
                      {
                        validator(_, value) {
                          const regex = /^\d{2,3}\/\d{2,3}$/; // Pattern to match "120/80"
                          if (!regex.test(value)) {
                            return Promise.reject(
                              new Error("Enter a valid format (e.g., 120/80)")
                            );
                          }

                          const [systolic, diastolic] = value
                            .split("/")
                            .map(Number);
                          if (
                            systolic < 90 ||
                            systolic > 200 ||
                            diastolic < 60 ||
                            diastolic > 120
                          ) {
                            return Promise.reject(
                              new Error(
                                "Values out of range. Systolic: 90-200, Diastolic: 60-120."
                              )
                            );
                          }

                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input type="text" placeholder="eg 120/80" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Temperature (&deg;C)"
                    name={["vitals", "temperature"]}
                    validateTrigger={["onBlur", "onChange"]}
                    hasFeedback
                    rules={[
                      { required: true, message: "Please input temperature!" },
                      {
                        validator(_, value) {
                          if (
                            value === undefined ||
                            value === null ||
                            value === ""
                          ) {
                            return Promise.reject(
                              new Error("Temperature is required!")
                            );
                          }

                          const temperature = parseFloat(value);
                          if (isNaN(temperature)) {
                            return Promise.reject(
                              new Error("Temperature must be a number!")
                            );
                          }

                          if (temperature < 35.0 || temperature > 42.0) {
                            return Promise.reject(
                              new Error(
                                "Temperature must be between 35.0°C and 42.0°C."
                              )
                            );
                          }

                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input type="number" placeholder="eg: 32.7" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="SPO2 (%)"
                    name={["vitals", "sP02"]}
                    validateTrigger={["onBlur", "onChange"]}
                    hasFeedback
                    rules={[
                      { required: true, message: "Please input SPO2!" },
                      {
                        validator(_, value) {
                          if (
                            value === undefined ||
                            value === null ||
                            value.trim() === ""
                          ) {
                            return Promise.reject(
                              new Error("SPO2 is required!")
                            );
                          }

                          // Ensure value is a valid percentage
                          const percentageMatch =
                            value.match(/^(\d{1,2}|100)$/);
                          if (!percentageMatch) {
                            return Promise.reject(
                              new Error(
                                "SPO2 must be a valid percentage (e.g., 98%)."
                              )
                            );
                          }

                          const numericValue = parseInt(percentageMatch[1], 10);
                          if (numericValue < 0 || numericValue > 100) {
                            return Promise.reject(
                              new Error("SPO2 must be between 0% and 100%.")
                            );
                          }

                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input type="text" name="sP02" placeholder="eg 98%" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
              <Col span={12}>
                  <Form.Item
                    label="Respiration Rate (bpm)"
                    name={["vitals", "respirationRate"]}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Please input respiration rate!",
                      },
                      {
                        pattern: /^[0-9]+$/,
                        message: "Respiration rate must be a valid number!",
                      },
                      {
                        validator(_, value) {
                          if (!value || (value >= 12 && value <= 25)) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              "Respiration rate must be between 12 and 25 bpm!"
                            )
                          );
                        },
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      name="respirationRate"
                      placeholder="eg 18"
                    />
                  </Form.Item>
                </Col>
                {/* <Col span={12}>
                  <Form.Item
                    label="Height (cm)"
                    name={["vitals", "height"]}
                    validateTrigger={["onBlur", "onChange"]}
                    hasFeedback
                    rules={[
                      { required: true, message: "Please input height!" },
                      {
                        type: "number",
                        min: 30,
                        max: 300,
                        transform(value) {
                          return value ? Number(value) : null;
                        },
                        message: "Height must be between 30 cm and 300 cm!",
                      },
                    ]}
                  >
                    <Input type="number" placeholder="eg 170" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Weight (kg)"
                    name={["vitals", "weight"]}
                    validateTrigger={["onBlur", "onChange"]}
                    hasFeedback
                    rules={[
                      { required: true, message: "Please input weight!" },
                      {
                        type: "number",
                        min: 1,
                        max: 500,
                        transform(value) {
                          return value ? Number(value) : null;
                        },
                        message: "Weight must be between 1 kg and 500 kg!",
                      },
                    ]}
                  >
                    <Input type="number" placeholder="eg 70" />
                  </Form.Item>
                </Col> */}
              </Row>
              <Row gutter={16}>
{/*                 
                <Col span={12}>
                  <Form.Item
                    label="Pain (Scale 0-10)"
                    name={["vitals", "pain"]}
                    validationTrigger={["onBlur", "onChange"]}
                    hasFeedback
                    rules={[
                      { required: true, message: "Please input pain level!" },
                      {
                        validator(_, value) {
                          if (value >= 0 && value <= 10) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("Pain level must be a scale of 0-10 !")
                          );
                        },
                      },
                    ]}
                  >
                    <Input type="text" placeholder="eg 1" />
                  </Form.Item>
                </Col> */}
              </Row>
              <Row gutter={16}>
                {/* <Col span={12}>
                  <Form.Item label="BMI" name={["vitals", "bmi"]}>
                    <Input
                      type="text"
                      disabled
                      style={{ color: "#0f5689", fontWeight: "bold" }}
                    />
                  </Form.Item>
                </Col> */}
              </Row>
              <Row>
                <Col span={24}>
                  <Button type="primary" htmlType="submit">
                    Save Vitals
                  </Button>
                  <Button style={{ marginLeft: 8 }} onClick={handleToggleForm}>
                    Cancel
                  </Button>
                  {/* Add the "Back to List" Button */}
                  <Button
                    style={{ marginLeft: 8 }}
                    onClick={handleToggleForm}
                    type="primary"
                  >
                    <IoListOutline />
                    Back to List
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </div>
      )}
    </div>
  );
};

export default FormVitals;
