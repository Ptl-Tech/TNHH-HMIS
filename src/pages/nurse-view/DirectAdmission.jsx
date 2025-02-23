import { DisconnectOutlined } from "@ant-design/icons";
import NurseInnerHeader from "../../partials/nurse-partials/NurseInnerHeader";
import PatientInfo from "./nurse-patient-file/PatientInfo";
import { Button, Card, Col, Form, Input, Row } from "antd";
const DirectAdmission = () => {
  return (
    <div>
      <PatientInfo />

      <div style={{ marginTop: "20px" }}>
        <NurseInnerHeader
          icon={<DisconnectOutlined />}
          title="Direct Admissions Form"
        />
        <div style={{ marginTop: "20px" }}>
          <Card style={{ padding: "20px" }}>
            <Form layout="vertical" style={{ paddingTop: "10px" }}>
              <Row gutter={[16, 16]}>
                <Col md={12} sm={24}>
                  <Form.Item label="Admission Reason">
                    <Input
                      type="text"
                      placeholder="Enter admission reason"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item label="Psychiatric coding">
                    <Input
                      type="text"
                      placeholder="Enter psychiatric coding"
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col md={12} sm={24}>
                  <Form.Item label="Code Reason">
                    <Input
                      type="text"
                      placeholder="Enter code reason"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item label="Select Ward">
                    <Input
                      type="text"
                      placeholder="Please select ward"
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col md={12} sm={24}>
                  <Form.Item label="Select Ward Room">
                    <Input
                      type="text"
                      placeholder="Please select ward room"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item label="Select Bed">
                    <Input
                      type="text"
                      placeholder="Please select bed"
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={{ width: "50%" }}
                icon={<DisconnectOutlined />}
              >
                Admit Patient
              </Button>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DirectAdmission;
