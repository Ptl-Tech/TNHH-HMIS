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
  } from "antd";
  import React, { useState } from "react";
  import { SaveOutlined, PlusOutlined } from "@ant-design/icons";
  import TextArea from "antd/es/input/TextArea";
  
  const { Option } = Select;
  
  const LabResultsEntry = () => {
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
        <Typography.Title level={5} style={{ color: "#0F5689", marginBottom: "12px" }}>
          Results Recording
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
            {/* Section for Test Method Modification */}
            <Row gutter={24} style={{ marginBottom: "16px" }}>
              <Col span={12}>
                <Form.Item name="testModified" label="Is Test Method Modified" rules={[{ required: true }]}>
                  <Select
                    placeholder="Select"
                    value={labRequest.testModified}
                    onChange={(value) => handleFieldChange("testModified", value)}
                  >
                    <Option value={true}>Yes</Option>
                    <Option value={false}>No</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="generalComments" label="General Comments" rules={[{ required: true }]}>
                  <TextArea
                    value={labRequest.generalComments}
                    onChange={(e) => handleFieldChange("generalComments", e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Row>
  
            {/* Section for Sending Test for Review */}
            <div style={{ marginBottom: "16px" }}>
              <Typography.Title level={5} style={{ color: "#0F5689", marginBottom: "12px" }}>
                Send Test for Review
              </Typography.Title>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item name="technician" label="Technician Name" rules={[{ required: true }]}>
                    <Select
                      placeholder="Select Technician"
                      value={labRequest.technician}
                      onChange={(value) => handleFieldChange("technician", value)}
                    >
                      <Option value="John Doe">John Doe</Option>
                      <Option value="Jane Doe">Jane Doe</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item>
                    <Button
                      type="primary"
                      style={{
                        marginTop: "16px",
                        marginBottom: "16px",
                        marginRight: "16px",
                        float: "right",
                        width: "150px",
                      }}
                      icon={<SaveOutlined />}
                      onClick={handleSave}
                    >
                      Send For Review
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </div>
  
            {/* Section for Recalling Test Results */}
            <div style={{ marginBottom: "16px" }}>
              <Typography.Title level={5} style={{ color: "#0F5689", marginBottom: "12px" }}>
                Recall Test Results
              </Typography.Title>
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item name="recallResults" label="Recall Results" rules={[{ required: true }]}>
                    <Input
                      type="text"
                      value={labRequest.recallResults}
                      onChange={(e) => handleFieldChange("recallResults", e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item>
                    <Button danger onClick={handleRecallTestResults}style={{
                        marginTop: "16px",
                        marginBottom: "16px",
                        marginRight: "16px",
                        float: "right",
                        width: "150px",
                      }}>
                      Recall Results
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </div>
  
            {/* Final Save Button */}
            <div className="my-2">
              <Button
                type="primary"
                style={{
                  marginTop: "16px",
                  marginBottom: "16px",
                  marginRight: "16px",
                  float: "right",
                }}
                onClick={handleSave}
              >
                <SaveOutlined />
                Forward as Completed
              </Button>
            </div>
          </Form>
        )}
      </div>
    );
  };
  
  export default LabResultsEntry;
  