import React from "react";
import { Card, Row, Col, Typography, Button, Tag } from "antd";
import {
  CheckCircleOutlined,
  PrinterOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { MdOutlineAssignmentInd, MdOutlinePerson } from "react-icons/md";

const { Title, Text } = Typography;

const PatientCard = () => {
  return (
    <Card
      bordered={false}
      style={{
        margin: "20px",
        background: "#FBEEDB", // Warm eye-pleasing background color
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        padding: "20px",
      }}
    >
      {/* Patient Info Section */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={4} style={{ marginBottom: 0 }}>
            <MdOutlineAssignmentInd style={{ marginRight: 8 }} />
            Patient Info
          </Title>
        </Col>
        <Col span={8}>
          <Text strong>Patient ID:</Text> <Tag color="blue">P00223</Tag>
        </Col>
        <Col span={8}>
          <Text strong>Name:</Text> <Tag color="green">Amos Kumali DC</Tag>
        </Col>
        <Col span={8}>
          <Text strong>Age:</Text> <Tag color="volcano">30 Years</Tag>
        </Col>
        <Col span={8}>
          <Text strong>Phone:</Text> 0715933404
        </Col>
        <Col span={8}>
          <Text strong>Visit No:</Text> 000178
        </Col>
        <Col span={8}>
          <Text strong>TR No:</Text> TR-00240
        </Col>
        <Col span={8}>
          <Text strong>Date:</Text> 8/19/2024 12:00:00 AM
        </Col>
      </Row>

      <hr style={{ margin: "20px 0", border: "1px solid #e8e8e8" }} />

      {/* Settlement Type Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
        <Col span={12}>
          <Text strong>Settlement Type:</Text>{" "}
          <Tag color="purple">Insurance Payer</Tag>
        </Col>
        <Col span={12}>
          <Text strong>Insurance:</Text> <Tag color="magenta">NHIF</Tag>
        </Col>
        <Col span={24} style={{ textAlign: "start" }}>
          <Button
            type="primary"
            style={{
              backgroundColor: "#1890ff",
              borderColor: "#1890ff",
              color: "#fff",
              borderRadius: "20px",
              padding: "5px 20px",
            }}
          >
            Patient Bill Balance: Kshs. 500
          </Button>
        </Col>
      </Row>

      <hr style={{ margin: "20px 0", border: "1px solid #e8e8e8" }} />

      {/* Allergies and Chronic Section */}
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: "20px" }}
      >
        <Col>
          <Title level={5} style={{ color: "#ff4d4f" }}>
            Allergies and Chronics
          </Title>
        </Col>
        <Col>
          <Button type="primary" danger icon={<CheckCircleOutlined />}>
            Finalize
          </Button>
          <Button
            type="default"
            style={{ marginLeft: "10px" }}
            icon={<SyncOutlined />}
          >
            Transfer/Assign Patient
          </Button>
          <Button
            type="default"
            style={{ marginLeft: "10px" }}
            icon={<PrinterOutlined />}
          >
            Print Interim Invoice
          </Button>
        </Col>
      </Row>

      <Row gutter={[8, 8]}>
        {[
          "Add Allergies",
          "Vitals",
          "Doctors Notes",
          "Lab/Results",
          "Imaging",
          "Diagnosis",
          "Medication",
          "Outpatient Procedures",
          "Theatre",
          "Admission",
          "TCA / Appointment",
          "Referrals",
          "Sick Off",
          "Medical Report",
          "Charges",
          "Consumables",
        ].map((label, index) => (
          <Col key={index} span={6}>
            <Button block type="default">
              {label}
            </Button>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default PatientCard;
