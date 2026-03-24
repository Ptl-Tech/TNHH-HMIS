import {
    Form,
    Input,
    Row,
    Col,
    Button,
    Typography,
    Select,
    Table,
    message,
    Upload,
  } from "antd";
  import React, { useState } from "react";
  import { SaveOutlined, PlusOutlined, InboxOutlined } from "@ant-design/icons";
  
  const { Option } = Select;
  const { Dragger } = Upload;
  
  const ExternalLabResults = () => {
    const [showForm, setShowForm] = useState(false); // Toggle between table and form
    const [labRequest, setLabRequest] = useState({
      testModified: null,
      generalComments: "",
      technician: "",
      recallResults: "",
      positive: false,
    });
  
    const handleFieldChange = (field, value) => {
      setLabRequest((prev) => ({
        ...prev,
        [field]: value,
      }));
    };
  
    const handleSave = () => {
      console.log(labRequest); // Replace with dispatch to save lab results
      message.success("Lab results saved successfully!");
    };
  
    const handleRecallTestResults = () => {
      console.log("Test results recalled"); // Replace with the logic for recalling the test
      message.success("Test results recalled!");
    };
  
    const columns = [
      { title: "Specimen Code", dataIndex: "specimenCode", key: "specimenCode" },
      { title: "Unit of Measure", dataIndex: "unitOfMeasure", key: "unitOfMeasure" },
      { title: "Count Value", dataIndex: "countValue", key: "countValue" },
      { title: "Positive", dataIndex: "positive", key: "positive" },
      { title: "Remarks", dataIndex: "remarks", key: "remarks" },
    ];
  
    const dataSource = []; // Replace with actual data from Redux or API
  
    return (
      <div>
        <Typography.Title level={5} style={{ color: "#b96000", marginBottom: "12px" }}>
     External     Results Recording
        </Typography.Title>
  
        <div className="d-flex justify-content-end my-2">
          <Button
            type="primary"
            onClick={() => setShowForm(!showForm)}
            icon={<PlusOutlined />}
          >
            {!showForm ? "New Request" : "View History"}
          </Button>
        </div>
  
        {!showForm ? (
          <Table columns={columns} dataSource={dataSource} pagination={false} />
        ) : (
          <Form layout="vertical" autoComplete="off">
            {/* Section for Lab Report Upload */}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Lab Report"
                  name="labReport"
                  rules={[
                    {
                      required: true,
                      message: "Please upload the lab report",
                    },
                  ]}
                >
                  <Dragger>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">Supports single or bulk uploads.</p>
                  </Dragger>
                </Form.Item>
              </Col>
            </Row>
  
            {/* Section for General Comments */}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="General Comments"
                  name="generalComments"
                  rules={[
                    {
                      required: true,
                      message: "Please provide general comments",
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={4}
                    value={labRequest.generalComments}
                    onChange={(e) => handleFieldChange("generalComments", e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Row>
  
            {/* Save Button */}
            <Row justify="end">
              <Col>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                  style={{ marginTop: "16px" }}
                >
                  Save Lab Results
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </div>
    );
  };
  
  export default ExternalLabResults;
  