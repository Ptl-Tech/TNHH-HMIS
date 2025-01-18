import React from "react";
import { Form, Row, Col, Select, Button, Input, Checkbox } from "antd";
import { PlusOutlined, SaveOutlined } from "@ant-design/icons";

const { Option } = Select;

const DiagnosisForm = ({
  diagnosisType, // 1 for primary, 2 for secondary
  data, // Primary diagnosis data
  secondaryDiagnosis, // Secondary diagnosis data
  diagnosisInput,
  setDiagnosisInput,
  diagnosisList,
  handleAddDiagnosis,
  handleUpdateDiagnosis,
  handleRemoveDiagnosis,
  handleSubmit,
  loading,
  onclose
}) => {
  return (
    <Form
      layout="vertical"
      initialValues={{
        diagnosisCode: "",
      }}
      autoComplete="off"
    >
      <Row gutter={24} style={{ paddingBottom: "16px" }}>
        <Col span={18}>
          {/* Primary Diagnosis Select */}
          {diagnosisType === 1 && (
            <Form.Item
              name="diagnosisCode"
              label="Primary Diagnosis"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Select Diagnosis"
                onChange={setDiagnosisInput}
                value={diagnosisInput}
                name="diagnosisCode"
                size="large"
                showSearch
                filterOption={(input, option) =>
                  option?.children?.toLowerCase().includes(input.toLowerCase())
                }
              >
                {data?.map((item) => (
                  <Option key={item.Code} value={item.Code}>
                    {item.Description}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {/* Secondary Diagnosis Select */}
          {diagnosisType === 2 && (
            <Form.Item
              name="secondaryDiagnosisCode"
              label="Comorbid Issues"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Select Diagnosis"
                onChange={setDiagnosisInput}
                value={diagnosisInput}
                name="secondaryDiagnosisCode"
                size="large"
                showSearch
                filterOption={(input, option) =>
                  option?.children?.toLowerCase().includes(input.toLowerCase())
                }
              >
                {data?.map((item) => (
                  <Option key={item.DiagnosisCode} value={item.DiagnosisCode}>
                    {item.Description}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </Col>

        <Col span={6}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleAddDiagnosis(diagnosisType)}
            style={{ width: "100%", marginTop: "30px" }}
            size="large"
          >
            Add
          </Button>
        </Col>
      </Row>

      {diagnosisList.length > 0 && (
        <div
          style={{
            marginTop: "16px",
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontWeight: "bold",
              padding: "8px 0",
              borderBottom: "1px solid #ddd",
            }}
          >
            <div style={{ flex: "1" }}>#</div>
            <div style={{ flex: "3" }}>Diagnosis Code</div>
            <div style={{ flex: "2" }}>Confirmed</div>
            <div style={{ flex: "4" }}>Remarks</div>
            <div style={{ flex: "1" }}>Action</div>
          </div>
          {diagnosisList.map((diagnosis, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                padding: "8px 0",
                borderBottom: "1px solid #f0f0f0",
                alignItems: "center",
              }}
            >
              <div style={{ flex: "1" }}>{index + 1}</div>
              <div style={{ flex: "3" }}>
                <Input
                  value={diagnosis.diagnosisCode}
                  onChange={(e) =>
                    handleUpdateDiagnosis(
                      index,
                      "diagnosisCode",
                      e.target.value,
                      diagnosisType
                    )
                  }
                />
              </div>
              <div style={{ flex: "2", marginLeft: "20px" }}>
                <Checkbox
                  checked={diagnosis.confirmed}
                  onChange={(e) =>
                    handleUpdateDiagnosis(
                      index,
                      "confirmed",
                      e.target.checked,
                      diagnosisType
                    )
                  }
                >
                  Confirm
                </Checkbox>
              </div>
              <div style={{ flex: "4" }}>
                <Input
                  value={diagnosis.remarks}
                  onChange={(e) =>
                    handleUpdateDiagnosis(
                      index,
                      "remarks",
                      e.target.value,
                      diagnosisType
                    )
                  }
                />
              </div>
              <div style={{ flex: "1" }}>
                <Button
                  type="text"
                  danger
                  onClick={() => handleRemoveDiagnosis(index, diagnosisType)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          marginTop: "16px",
          marginBottom: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "15px",
        }}
      >
        <Button
          type="primary"
          htmlType="submit"
          style={{ width: "150px", float: "right" }}
          icon={<SaveOutlined />}
          loading={loading}
          onClick={handleSubmit}
        >
          Save Diagnosis
        </Button>
        <Button type="default" onclose={onclose} danger>
          Close
        </Button>
      </div>
    </Form>
  );
};

export default DiagnosisForm;
