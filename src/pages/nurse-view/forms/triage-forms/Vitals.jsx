import { Button, Col, Form, Input, message, Row, Space, Table } from "antd";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { postTriageListVitalsSlice } from "../../../../actions/triage-actions/postTriageListVitalsSlice";
import { getVitalsLinesSlice } from "../../../../actions/triage-actions/getVitalsLinesSlice";
import { useEffect, useState } from "react";
import Loading from "../../../../partials/nurse-partials/Loading";
import { SaveOutlined, EditOutlined } from "@ant-design/icons";
import { updateTriageListVitalsSlice } from "../../../../actions/triage-actions/updateTriageListVitalsSlice";

const FormVitals = ({ observationNumber, patientNumber }) => {
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const { loadingVitalsLines, vitalsLines } = useSelector(
    (state) => state.getVitalsLines
  );
  const { loading } = useSelector((state) => state.postTriageListVitals);
  const [isEditing, setIsEditing] = useState(false);
  const [editingLine, setEditingLine] = useState([]);

  useEffect(() => {
    dispatch(getVitalsLinesSlice(observationNumber));
  }, [dispatch, observationNumber]);

  useEffect(() => {
   if (Array.isArray(vitalsLines) && vitalsLines.length > 0) {
  const latest = vitalsLines[vitalsLines.length - 1]; // last record in array
  form.setFieldsValue({
    vitals: {
      pulseRate: latest?.PulseRate || "",
      height: latest?.Height || "",
      weight: latest?.Weight || "",
      temperature: latest?.Temperature || "",
      systolic: latest?.BloodPressure
        ? latest?.BloodPressure.split("/")[0]
        : "",
      diastolic: latest?.BloodPressure
        ? latest?.BloodPressure.split("/")[1]
        : "",
      sP02: latest?.SP02 || "",
      respirationRate: latest?.RespirationRate || "",
      bmi: latest?.BMI ? latest?.BMI.toFixed(2) : "0.0",
    },
  });
} else {
  form.resetFields();
}

  }, [vitalsLines, form]);

  const onFinish = async (values) => {
    try {
      const {
        pulseRate,
        height,
        weight,
        temperature,
        // bloodPreasure,
        systolic,
        diastolic,
        sP02,
        respirationRate,
      } = values.vitals;

      // Transform values
      const transformedValues = {
        pulseRate,
        height: parseFloat(cleanValue(height)),
        weight: parseFloat(cleanValue(weight)),
        temperature: parseFloat(cleanValue(temperature)),
        bloodPressure:'',
        systolicBp:  parseFloat(cleanValue(systolic)),
        diastolicBp: parseFloat(cleanValue(diastolic)),
        sP02,
        respirationRate,
       // BMI: calculateBMI(height, weight),
      };

      // Common payload properties
      const baseVitals = {
        ...transformedValues,
        patientNo: patientNumber,
        observationNo: observationNumber,
      };

      setIsEditing(false);

      // Create or update logic
      if (isEditing) {
        // Update vitals
        const updateVitals = {
          ...baseVitals,
          lineNo: editingLine?.LineNo,
          type: 1,
          myAction: "edit",
        };

        await dispatch(updateTriageListVitalsSlice(updateVitals));
        message.success("Successfully updated vitals");
        dispatch(getVitalsLinesSlice(observationNumber));
        form.resetFields();
      } else {
        // Create vitals
        const createVitals = {
          ...baseVitals,
          type: 0,
          myAction: "create",
        };

        await dispatch(postTriageListVitalsSlice(createVitals)).then((data) => {
          if (data) {
            message.success("Vitals successfully created");
            dispatch(getVitalsLinesSlice(observationNumber));
            form.resetFields();
          } else {
            message.error(data?.status || "Error saving vitals data");
          }
        });
      }
    } catch (error) {
      // Generic error handling
      message.error(
        error.message || "An error occurred while saving vitals data."
      );
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

  const columns = [
     {
          title: "No",
          dataIndex: "No",
          key: "No",
          render: (_, __, index) => index + 1,
          width: 50,  
        },
    {
      title: "Observation No",
      dataIndex: "ObservationNo",
      key: "ObservationNo",
      fixed: "left",
      width: 150,
    },
    {
      title: "Pulse Rate",
      dataIndex: "PulseRate",
      key: "PulseRate",
    },
    {
      title: "Height",
      dataIndex: "Height",
      key: "Height",
    },
    {
      title: "Weight",
      dataIndex: "Weight",
      key: "Weight",
    },
    {
      title: "Temperature",
      dataIndex: "Temperature",
      key: "Temperature",
    },
    // {
    //   title: "Blood BloodPressure",
    //   dataIndex: "BloodPressure",
    //   key: "BloodPressure",
    // },
    {
      title: "SP02",
      dataIndex: "SP02",
      key: "SP02",
    },
    {
      title: "Respiratory Rate",
      dataIndex: "RespirationRate",
      key: "RespirationRate",
    },
    {
      title: "BMI",
      dataIndex: "BMI",
      key: "BMI",
      //render BMI in two decimal places
      render: (text) => <span>{text ? text.toFixed(2) : "0.0"}</span>,
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 150,
      render(_, record) {
        return (
          <Space size="middle">
            <Button
              type="primary"
              onClick={() => handleEdit(record)}
              icon={<EditOutlined />}
            >
              Update
            </Button>
            {/* <Button type="primary" danger onClick={() => handleDelete(record)} icon={<DeleteOutlined />}> 
              Delete
            </Button> */}
          </Space>
        );
      },
    },
  ];

  const handleEdit = (record) => {
    setIsEditing(true);
    setEditingLine(record);
    const [systolic, diastolic] = record.BloodPressure
      ? record.BloodPressure.split("/").map((v) => v.trim())
      : ["", ""];
    form.setFieldsValue({
      vitals: {
        pulseRate: record.PulseRate || "",
        height: record.Height || "",
        weight: record.Weight || "",
        temperature: record.Temperature || "",
        // bloodPreasure: record.BloodPressure || "",
        systolic: systolic,
        diastolic: diastolic,
        sP02: record.SP02,
        respirationRate: record.RespirationRate || "",
        bmi: record.BMI ? record.BMI.toFixed(2) : "0.0",
      },
    });
  };

  return (
    <div>
      {loadingVitalsLines ? (
        <Loading />
      ) : (
        <div>
          <Form
            layout="vertical"
            form={form}
            onFinish={onFinish}
            initialValues={{
              vitals: {
                pulseRate: "",
                bloodPreasure: "",
                temperature: "",
                systolic: "",
                diastolic: "",
                sP02: "",
                height: "",
                weight: "",
                respirationRate: "",
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
                      pattern: /^[0-9]+$/,
                      message: "Pulse rate must be a valid number!",
                    },
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();
                        if (value < 40 || value > 180) {
                          return Promise.reject(
                            new Error(
                              "Pulse rate must be between 40 and 180 bpm!"
                            )
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input type="number" placeholder="e.g. 70" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Blood Pressure (mmHg)" required>
                  <Row gutter={8} align="middle">
                    <Col span={11}>
                      <Form.Item
                        name={["vitals", "systolic"]}
                        noStyle
                        rules={[
                          { required: true, message: "Systolic is required!" },
                          {
                            pattern: /^[0-9]+$/,
                            message: "Must be a valid number!",
                          },
                        ]}
                      >
                        <Input placeholder="Systolic" type="number" />
                      </Form.Item>
                    </Col>

                    <Col span={2} style={{ textAlign: "center" }}>
                      /
                    </Col>

                    <Col span={11}>
                      <Form.Item
                        name={["vitals", "diastolic"]}
                        noStyle
                        rules={[
                          { required: true, message: "Diastolic is required!" },
                          {
                            pattern: /^[0-9]+$/,
                            message: "Must be a valid number!",
                          },
                        ]}
                      >
                        <Input placeholder="Diastolic" type="number" />
                      </Form.Item>
                    </Col>
                  </Row>
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
                  rules={[{ required: true, message: "Please input SPO2!" }]}
                >
                  <Input type="number" name="sP02" placeholder="eg 98%" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
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
                    type="number"
                    name="respirationRate"
                    placeholder="eg 18"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="BMI" name={["vitals", "bmi"]}>
                  <Input type="text" disabled />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Button type="primary" loading={loading} htmlType="submit">
                <SaveOutlined />

                {isEditing ? "Update vitals" : "Save vitals"}
              </Button>
            </Form.Item>
          </Form>

          {vitalsLines && Object.keys(vitalsLines).length > 0 && (
            <div style={{ marginTop: "10px" }}>
              <Table
                columns={columns}
                size="middle"
                dataSource={
  Array.isArray(vitalsLines)
    ? [...vitalsLines].reverse() // reverse order for newest first
    : [vitalsLines]
}
                pagination={{
                  defaultPageSize: 10,
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "30", "40", "50"],
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FormVitals;

//prop type validation
FormVitals.propTypes = {
  observationNumber: PropTypes.string.isRequired,
  patientNumber: PropTypes.string.isRequired,
};
