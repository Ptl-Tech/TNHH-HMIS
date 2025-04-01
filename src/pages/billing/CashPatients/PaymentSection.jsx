import { Form, Card, Select, Row ,Col, Input, Button} from "antd";
import React from "react";
import { PlusOutlined } from "@ant-design/icons";
const PaymentSection = () => {
  return (
    <div>
      <Card title="Add Payment Options" style={{padding: "10px 16px"}}>
        <Form layout="vertical">
          <Row gutter={16}> 
            <Col span={8}>
            <Form.Item label="Payment Method" name="paymentType">
              <Select placeholder="Choose payment method">
                <Select.Option value="cash">Cash</Select.Option>
                <Select.Option value="card">Card</Select.Option>
              </Select>
            </Form.Item>
            </Col>
            <Col span={8}>
            <Form.Item label="Amount" name="amount">
                {/* place is ksh amount to dp */}
              <Input type="number" placeholder="ksh 0.00" />
            </Form.Item>
            </Col>
            <Col span={8}>
            <Form.Item label="Reference Code" name="discount" rules={[{ required: true }]}> 
             <Input type="text" placeholder="Enter ref. code" />
            </Form.Item>
            </Col>
            </Row>
            <Row gutter={16}>
                <Col span={8}>
                <Button type="primary" iconPosition="end" icon={<PlusOutlined />}>Add Payment Option </Button>
                </Col>
              </Row>
        </Form>
      </Card>
    </div>
  );
};

export default PaymentSection;
