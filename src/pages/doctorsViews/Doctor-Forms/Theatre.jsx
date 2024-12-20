import React from 'react';
import { Form, Select, Input, DatePicker, TimePicker, Button, Typography, Row, Col, Space } from 'antd';
import { UserOutlined, PlusOutlined } from '@ant-design/icons'; // Import the icons
import moment from 'moment';

const { Option } = Select;

const Theatre = () => {
  return (
    <div>
      <Typography.Title level={4} style={{
        color: "#0F5689",
        marginBottom: "12px",
      }}>
        <UserOutlined style={{ marginRight: '8px' }} />
        Theatre Details
      </Typography.Title>
      <div className='d-flex justify-content-end gap-2'>
              <Col>
                {/* Add Record Button */}
                <Button type="dashed" icon={<PlusOutlined />} onClick={() => console.log('Add Record')}>
                  Add Record
                </Button>
              </Col>
              <Col>
                {/* Submit Button */}
                <Form.Item>
                  <Button type="primary" htmlType="submit" style={{ marginLeft: '8px', backgroundColor: '#0F5689' }}>
                    Send to theatre
                  </Button>
                </Form.Item>
              </Col>
            </div>
      <div className="row">
        <div className="col-12 col-md-12">
          <Form layout="vertical">
            {/* First Row with two columns */}
            <Row gutter={16}>
              <Col span={8}>
                {/* Operation */}
                <Form.Item
                  name="operation"
                  label="Operation"
                  rules={[{ required: true, message: "Please select an operation!" }]}
                >
                  <Select placeholder="Select operation">
                    <Option value="operation1">Operation 1</Option>
                    <Option value="operation2">Operation 2</Option>
                    <Option value="operation3">Operation 3</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                {/* Surgeon */}
                <Form.Item
                  name="surgeon"
                  label="Surgeon"
                  rules={[{ required: true, message: "Please select a surgeon!" }]}
                >
                  <Select placeholder="Select surgeon">
                    <Option value="surgeon1">Surgeon 1</Option>
                    <Option value="surgeon2">Surgeon 2</Option>
                    <Option value="surgeon3">Surgeon 3</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                {/* Anaesthetist */}
                <Form.Item
                  name="anaesthetist"
                  label="Anaesthetist"
                  rules={[{ required: true, message: "Please select an anaesthetist!" }]}
                >
                  <Select placeholder="Select anaesthetist">
                    <Option value="anaesthetist1">Anaesthetist 1</Option>
                    <Option value="anaesthetist2">Anaesthetist 2</Option>
                    <Option value="anaesthetist3">Anaesthetist 3</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* Second Row with two columns */}
            <Row gutter={16}>
              <Col span={12}>
                {/* Theatre Date */}
                <Form.Item
                  name="theatreDate"
                  label="Theatre Date"
                  rules={[{ required: true, message: "Please select a date!" }]}
                >
                  <DatePicker className="w-100" format="DD/MM/YYYY" />
                </Form.Item>
              </Col>
              <Col span={12}>
                {/* Theatre Time */}
                <Form.Item
                  name="theatreTime"
                  label="Theatre Time"
                  rules={[{ required: true, message: "Please select a time!" }]}
                >
                  <TimePicker className="w-100" format="HH:mm" defaultValue={moment('12:00', 'HH:mm')} />
                </Form.Item>
              </Col>
            </Row>

            {/* Third Row with two columns */}
            <Row gutter={16}>
              <Col span={12}>
                {/* Instructions */}
                <Form.Item
                  name="instructions"
                  label="Instructions"
                  rules={[{ required: true, message: "Please input instructions!" }]}
                >
                  <Input.TextArea rows={4} placeholder="Enter any instructions" />
                </Form.Item>
              </Col>
            </Row>

            {/* Action Buttons */}
            <Row justify="space-between">
              <Col>
                {/* Add Record Button */}
                <Button type="dashed" icon={<PlusOutlined />} onClick={() => console.log('Add Record')}>
                  Add Record
                </Button>
              </Col>
              <Col>
                {/* Submit Button */}
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Theatre;
