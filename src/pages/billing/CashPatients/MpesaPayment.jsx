import { Button, Divider, Form, Input, Modal } from "antd";
import React from "react";

const MpesaPayment = ({ visible, onClose, activeVisitNo }) => {
  return (
    <div>
      <Modal
        title="Mpesa Payment"
        visible={visible}
        onCancel={onClose}
        footer={null}
      >
        <Form layout="vertical">
          <Form.Item label="Phone Number">
            <Input type="number" placeholder="Enter Mpesa Number" />
          </Form.Item>
          <Form.Item label="Bill Amount">
            <Input type="number" placeholder="Enter Amount" />
          </Form.Item>
          <Divider />
          <div className="d-flex flex-row gap-2">
            <Button type="primary">Initiate Payment</Button>
            <Button type="default" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default MpesaPayment;
