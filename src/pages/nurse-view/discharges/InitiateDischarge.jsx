import {
  Card,
  List,
  Checkbox,
  Button,
  Alert,
  Typography,
  Space,
  Row,
  Col,
} from "antd";
import PropTypes from "prop-types";

const { Title, Text } = Typography;

const InitiateDischarge = ({ handleInitiateDischarge }) => {
  const medicalInfo = [
    { label: "Primary Diagnosis", value: "Pneumonia" },
    { label: "Reason for Admission", value: "Acute respiratory distress" },
    { label: "Treatment Plan", value: "IV antibiotics, nebulization" },
    { label: "Pending Procedures/Tests", value: "None" },
    { label: "Attending Doctor", value: "Dr. John Doe" },
  ];

  const checklistItems = [
    { label: "All lab results received", checked: true },
    { label: "Discharge medications prepared", checked: true },
    { label: "Discharge summary written", checked: false },
    { label: "Sick off letter prepared", checked: false },
    { label: "Patient family informed", checked: true },
  ];

  const alerts = ["Patient allergic to Penicillin"];

  return (
    <div>
      {alerts.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          {alerts.map((alert, index) => (
            <Alert key={index} message={alert} type="warning" showIcon />
          ))}
        </div>
      )}
      <Card style={{ padding: "20px" }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Title level={4}>Medical Information</Title>
              <List
                size="small"
                bordered
                dataSource={medicalInfo}
                renderItem={(item) => (
                  <List.Item key={item.label}>
                    <Text strong>{item.label}:</Text> <Text> {item.value}</Text>
                  </List.Item>
                )}
              />
            </Col>

            <Col xs={24} md={12}>
              <Title level={4}>Discharge Checklist</Title>
              <List
                dataSource={checklistItems}
                bordered
                size="small"
                renderItem={(item) => (
                  <List.Item key={item.label}>
                    <Checkbox checked={item.checked} disabled>
                      {item.label}
                    </Checkbox>
                  </List.Item>
                )}
              />
            </Col>
          </Row>

          <Button type="primary" onClick={handleInitiateDischarge}>
            Proceed to Initiate Discharge
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default InitiateDischarge;
//props validation
InitiateDischarge.propTypes = {
  handleInitiateDischarge: PropTypes.func,
};
