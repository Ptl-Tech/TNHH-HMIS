import { Button, Card, Col, Form, Input, Row, Select, Space, Table, Typography, Modal } from "antd";
import { handOverNurse, hospitalBranchesTotalWards, selectBed } from "../../../constants/nurse-constants";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { SearchOutlined } from '@ant-design/icons'; // Import icon

const AdmitPatientForm = () => {
  const [historyVisible, setHistoryVisible] = useState(false);

  // Sample patient admission history data
  const admissionHistoryData = [
    { key: '1', admissionDate: '01/01/2024', admissionArea: 'Ward A', admissionNurse: 'Nurse A', reason: 'General Checkup' },
    { key: '2', admissionDate: '05/02/2024', admissionArea: 'Ward B', admissionNurse: 'Nurse B', reason: 'Surgery' },
    // Add more records here as needed
  ];

  // Table columns for the admission history
  const admissionHistoryColumns = [
    { title: 'Admission Date', dataIndex: 'admissionDate', key: 'admissionDate' },
    { title: 'Admission Area', dataIndex: 'admissionArea', key: 'admissionArea' },
    { title: 'Admission Nurse', dataIndex: 'admissionNurse', key: 'admissionNurse' },
    { title: 'Reason for Admission', dataIndex: 'reason', key: 'reason' },
  ];

  // Function to show the modal
  const handleHistoryClick = () => {
    setHistoryVisible(true);
  };

  // Function to close the modal
  const handleCancel = () => {
    setHistoryVisible(false);
  };

  return (
    <div>
      {/* Button Section with View Patient History and Cancel Admission */}
      <div style={{ marginBottom: '20px' }}>
        <Typography.Title level={4} style={{ color: "#0F5689", display: 'inline-block', marginRight: '10px' }}>
          <SearchOutlined style={{ marginRight: '8px' }} />
          View Patient History
        </Typography.Title>
        
        <Button 
          type="default" 
          onClick={handleHistoryClick} 
          style={{ marginRight: '10px' }}
        >
          Show History
        </Button>
        
        <Button 
          type="danger" 
          style={{ marginLeft: '10px' }}
        >
          Cancel Admission
        </Button>
      </div>

      <Card style={{ margin: '20px 10px 10px 10px' }}>
        <Form layout="vertical" className="admit-patient-card-container">
          {/* Patient Information Form */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Admission Number" name="admissionNumber">
                <Input type="text" disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Patient Number" name="patientNumber">
                <Input type="text" disabled />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Patient Name" name="patientName">
                <Input type="text" disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Admission Date" name="admissionDate">
                <Input type="text" disabled />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Admission Area" name="admissionArea">
                <Input type="text" disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Admission Nurse" name="admissionNurse">
                <Input type="text" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Select Ward" name="selectWard">
                <Select style={{ width: '100%' }} optionFilterProp="label" options={hospitalBranchesTotalWards} placeholder="Select ward" showSearch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Handover Nurse" name="handoverNurse">
                <Select style={{ width: '100%' }} optionFilterProp="label" options={handOverNurse} placeholder="Select nurse" showSearch />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Admission Reason" name="admissionReason">
                <TextArea />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Select Bed" name="selectBed">
                <Select style={{ width: '100%' }} optionFilterProp="label" options={selectBed} placeholder="Select bed" showSearch />
              </Form.Item>
            </Col>
          </Row>

          <Space>
            <Form.Item>
              <Button type="primary" htmlType="submit">Save Admission</Button>
            </Form.Item>
          </Space>
        </Form>
      </Card>

      {/* Modal for Patient Admission History */}
      <Modal
        title="Patient Admission History"
        visible={historyVisible}
        onCancel={handleCancel}
        footer={
          <Button type="primary" onClick={handleCancel}>
            Close
          </Button>
        }
        width={800} // You can adjust the modal width
      >
        <Table
          dataSource={admissionHistoryData}
          columns={admissionHistoryColumns}
          pagination={false}
        />
      </Modal>
    </div>
  );
};

export default AdmitPatientForm;
