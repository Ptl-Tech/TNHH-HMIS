import React, { useState } from 'react';
import { Card, Col, Form, Input, Row, Button, Typography, Modal } from 'antd';
import { UserOutlined, FileTextOutlined, SearchOutlined, MedicineBoxOutlined, PrinterOutlined, MailOutlined } from '@ant-design/icons'; // Import icons

const Referrals = () => {
  const [modalVisible, setModalVisible] = useState(false);

  // Function to show the modal
  const handleModalVisible = () => {
    setModalVisible(true);
  };

  // Function to close the modal
  const handleModalClose = () => {
    setModalVisible(false);
  };

  // Handle Print Transfer
  const handlePrintTransfer = () => {
    window.print(); // This will trigger the browser's print functionality
  };

  // Handle Send to Referral
  const handleSendToReferral = () => {
    // You can replace this with the actual logic to send the referral (API call or other actions)
    alert('Referral sent successfully!');
  };

  return (
    <div>
      {/* Button Section with Show Referral Details */}
      <div style={{ marginBottom: '20px' }}>
        <Typography.Title level={4} style={{ color: "#0F5689", display: 'inline-block', marginRight: '10px' }}>
          <FileTextOutlined style={{ marginRight: '8px' }} />
          Referral Details
        </Typography.Title>
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-start', gap: '10px' }}>
  <Button 
    type="default" 
    icon={<PrinterOutlined />} 
    onClick={handlePrintTransfer}
  >
    Print Transfer
  </Button>

  <Button 
    type="primary" 
    icon={<MailOutlined />} 
    onClick={handleSendToReferral}
  >
    Send to Referral
  </Button>

  <Button 
    type="default" 
    onClick={handleModalVisible}
  >
    Show Referral Details
  </Button>
</div>

       
      </div>

      {/* Referral Form Card */}
      <Card style={{ margin: '20px 10px 10px 10px' }}>
        <Form layout="vertical" className="referral-card-container">
          {/* Hospital / Doctor Information */}
          <Row gutter={16}>
            <Col span={20}>
              <Form.Item label="Hospital / Doctor" name="hospitalDoctor">
                <Input prefix={<UserOutlined />} />
              </Form.Item>
            </Col>
          </Row>

          {/* Summary of Clinical History */}
          <Row gutter={16}>
            <Col span={20}>
              <Form.Item label="Summary of Clinical History & Treatment" name="clinicalHistory">
                <Input.TextArea prefix={<FileTextOutlined />} />
              </Form.Item>
            </Col>
          </Row>

          {/* Significant Findings */}
          <Row gutter={16}>
            <Col span={20}>
              <Form.Item label="Significant Findings on Examination & Investigation" name="significantFindings">
                <Input.TextArea prefix={<MedicineBoxOutlined />} />
              </Form.Item>
            </Col>
          </Row>

          {/* Referral Reason */}
          <Row gutter={16}>
            <Col span={20}>
              <Form.Item label="Referral Reason" name="referralReason">
                <Input.TextArea prefix={<SearchOutlined />} />
              </Form.Item>
            </Col>
          </Row>

          {/* Referral Remarks */}
          <Row gutter={16}>
            <Col span={20}>
              <Form.Item label="Referral Remarks" name="referralRemarks">
                <Input.TextArea prefix={<FileTextOutlined />} />
              </Form.Item>
            </Col>
          </Row>

          <Button type="primary" onClick={handleModalVisible}>Submit Referral</Button>
        </Form>
      </Card>

      {/* Referral Buttons Section */}
     
      {/* Modal for Referral Details */}
      <Modal
        title="Referral Details"
        visible={modalVisible}
        onCancel={handleModalClose}
        footer={<Button type="primary" onClick={handleModalClose}>Close</Button>}
        width={800}
      >
        {/* Modal Content */}
        <Typography.Paragraph>
          Here you can view the details of the referral and any related information.
        </Typography.Paragraph>
      </Modal>
    </div>
  );
};

export default Referrals;
