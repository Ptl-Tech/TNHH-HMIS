import { Button, Card, Col, Form, Input, Row, Select, Space, Table, Typography, Modal } from "antd";
import { handOverNurse, hospitalBranchesTotalWards, selectBed } from "../../../constants/nurse-constants";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { SearchOutlined, CustomerServiceOutlined } from '@ant-design/icons'; // Import psychology icon

const TCA_Appointment = () => {
  const [historyVisible, setHistoryVisible] = useState(false);

  // Sample patient psychology visit history data
  const patientHistoryData = [
    { key: '1', visitDate: '01/01/2024', psychologist: 'Dr. Smith', reason: 'Anxiety Management' },
    { key: '2', visitDate: '05/02/2024', psychologist: 'Dr. Johnson', reason: 'Depression Therapy' },
    // Add more records here as needed
  ];

  // Table columns for the patient psychology visit history
  const patientHistoryColumns = [
    { title: 'Visit Date', dataIndex: 'visitDate', key: 'visitDate' },
    { title: 'Psychologist', dataIndex: 'psychologist', key: 'psychologist' },
    { title: 'Reason for Visit', dataIndex: 'reason', key: 'reason' },
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
      {/* Button Section with View Patient History and Cancel Dispatch */}
      <div style={{ marginBottom: '20px' }}>
        <Typography.Title level={4} style={{ color: "#b96000", display: 'inline-block', marginRight: '10px' }}>
          <CustomerServiceOutlined style={{ marginRight: '8px' }} /> {/* Psychology Icon */}
          View Psychology Visit History
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
          Cancel Dispatch
        </Button>
      </div>

      <Card style={{ margin: '20px 10px 10px 10px' }}>
        <Form layout="vertical" className="dispatch-patient-card-container">
          {/* Patient Information Form */}
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Patient Number" name="patientNumber">
                <Input type="text" disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Patient Name" name="patientName">
                <Input type="text" disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Psychologist" name="psychologist">
                <Select style={{ width: '100%' }} optionFilterProp="label" placeholder="Select Psychologist" showSearch />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Notes" name="notes">
                <TextArea />
              </Form.Item>
            </Col>
          </Row>

          <Space>
            <Form.Item>
              <Button type="primary" htmlType="submit">Dispatch to Psychology</Button>
            </Form.Item>
          </Space>
        </Form>
      </Card>

      {/* Modal for Patient Psychology Visit History */}
      <Modal
        title="Psychology Visit History"
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
          dataSource={patientHistoryData}
          columns={patientHistoryColumns}
          pagination={false}
        />
      </Modal>
    </div>
  );
};

export default TCA_Appointment;
