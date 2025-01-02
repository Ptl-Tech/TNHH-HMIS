import { Button, Col, Form, Input, Modal, Row, Space, Typography } from "antd";
import { useState } from "react";
import { ProfileOutlined, FolderViewOutlined } from "@ant-design/icons";
import VitalsTable from "../tables/triage-tables/VitalsTable";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

const Vitals = () => {
  const [selectedRowKey, setSelectedRowKey] = useState(null);
        const [isButtonDisabled, setIsButtonDisabled] = useState(true);
        const [selectedRow, setSelectedRow] = useState([]);
        const [ form ] = Form.useForm();
        const [isModalOpen, setIsModalOpen] = useState(false);
        const dispatch = useDispatch();
        const { patientDetails } = useLocation().state;

        const handleCancel = () => {
          setIsModalOpen(false);
        };

        const handleViewVitals = () => {
          setIsModalOpen(true);
        }

        const rowSelection = {
          selectedRowKeys: selectedRowKey ? [selectedRowKey] : [], // Controlled selection
          onChange: (selectedRowKeys, selectedRows) => {
            if (selectedRowKeys.length > 1) {
              setSelectedRowKey(selectedRowKeys[selectedRowKeys.length - 1]); // Keep the most recently selected row
              setSelectedRow([selectedRows[selectedRows.length - 1]]); // Update the selected row
            } else {
              setSelectedRowKey(selectedRowKeys[0]); // Update the selected row key
              setSelectedRow(selectedRows); // Update the selected row
            }
            setIsButtonDisabled(selectedRowKeys.length === 0); // Enable or disable buttons
          },
          getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User', // Disable specific rows if needed
          }),
      };
  return (
    <div>
      <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '30px', position: 'relative'}}>
          <ProfileOutlined />
          <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '14px'}}>
              Patient Vitals
          </Typography.Text>
        </Space>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
          <Button type="primary" style={{ width: '100%' }} disabled={!selectedRowKey} onClick={handleViewVitals}><FolderViewOutlined /> View Vitals</Button>
          <Button color="default" variant="outlined" style={{ width: '100%' }} disabled={!selectedRowKey} onClick={handleViewVitals}><FolderViewOutlined /> Preview Pain Assessment Tool</Button>
        </div>


        <VitalsTable  rowSelection={rowSelection} />


        <Modal title="Vitals" open={isModalOpen}
         footer={[
          <Button key="cancel" color="danger" onClick={handleCancel}>
            Cancel
          </Button>,
        ]}
        >
          <Form
          layout="vertical"
          form={form}
          autoComplete="off"
          >

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Pulse Rate (bpm)"
                  name={['vitals', 'pulseRate']}
                  hasFeedback
                  
                  rules={[
                    {
                      required: true,
                      message: 'Please input pulse rate!',
                    },
                    {
                      pattern: /^[0-9]+$/, // Validate numeric input
                      message: 'Pulse rate must be a valid number!',
                    },
                    {
                      validator: (_, value) => {
                        if (!value) {
                          return Promise.resolve(); // Skip if no value (handled by required rule)
                        }
                        if (value < 40 || value > 180) {
                          return Promise.reject(new Error('Pulse rate must be between 40 and 180 bpm!'));
                        }
                        return Promise.resolve(); // Valid input
                      },
                    },
                  ]}
                >
                  <Input type='text'
          
                    placeholder='eg 70'
                    
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Blood Pressure (mmHg)" 
                  name={['vitals', 'bloodPreasure']}
                  validateTrigger={['onBlur', 'onChange']}
                  hasFeedback
                  rules={[
                    { required: true, message: 'Blood Pressure is required!' },
                    {
                      validator(_, value) {
                        
                        const regex = /^\d{2,3}\/\d{2,3}$/; // Pattern to match "120/80"
                        if (!regex.test(value)) {
                          return Promise.reject(
                            new Error('Enter a valid format (e.g., 120/80)')
                          );
                        }
          
                        const [systolic, diastolic] = value.split('/').map(Number);
                        if (
                          systolic < 90 ||
                          systolic > 200 ||
                          diastolic < 60 ||
                          diastolic > 120
                        ) {
                          return Promise.reject(
                            new Error(
                              'Values out of range. Systolic: 90-200, Diastolic: 60-120.'
                            )
                          );
                        }
          
                        return Promise.resolve();
                      },
                    },
                  ]}
                  >
                  <Input type='text' 
                     
                      placeholder='eg 120/80'
                      
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Temperature (&deg;C)" name={['vitals', 'temperature']}
                  validateTrigger={['onBlur', 'onChange']}
                  hasFeedback
                  rules={[
                    { required: true, message: 'Please input temperature!' },
                    {
                      validator(_, value) {
                        if (value === undefined || value === null || value === '') {
                          return Promise.reject(new Error('Temperature is required!'));
                        }
                
                        const temperature = parseFloat(value);
                        if (isNaN(temperature)) {
                          return Promise.reject(new Error('Temperature must be a number!'));
                        }
                
                        if (temperature < 35.0 || temperature > 42.0) {
                          return Promise.reject(
                            new Error('Temperature must be between 35.0°C and 42.0°C.')
                          );
                        }
                
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input type='number' 
                   
                     placeholder='eg: 32.7'
                    
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="SPO2 (%)" name={['vitals', 'sP02']}
                    validateTrigger={['onBlur', 'onChange']}
                    hasFeedback
                    rules={[
                      { required: true, message: 'Please input SPO2!' },
                      {
                        validator(_, value) {
                          if (value === undefined || value === null || value.trim() === '') {
                            return Promise.reject(new Error('SPO2 is required!'));
                          }
                  
                          // Ensure value is a valid percentage
                          const percentageMatch = value.match(/^(\d{1,2}|100)%$/);
                          if (!percentageMatch) {
                            return Promise.reject(
                              new Error('SPO2 must be a valid percentage (e.g., 98%).')
                            );
                          }
                  
                          const numericValue = parseInt(percentageMatch[1], 10);
                          if (numericValue < 0 || numericValue > 100) {
                            return Promise.reject(
                              new Error('SPO2 must be between 0% and 100%.')
                            );
                          }
                  
                          return Promise.resolve();
                        },
                      },
                    ]}
                >
                  <Input type='text' 
                    name='sP02'
                    placeholder='eg 98%'
              
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Height (cm)" name={['vitals', 'height']}
                
                validateTrigger={['onBlur', 'onChange']}
                hasFeedback
                rules={[
                  { required: true, message: 'Please input height!' },
                  {
                    type: 'number', 
                    min: 30, 
                    max: 300, 
                    transform(value) {
                      return value ? Number(value) : null;
                    },
                    message: 'Height must be between 30 cm and 300 cm!',
                  },
                 
                ]}
                >
                  <Input type='number' 
                    
                    placeholder='eg 170'
                    
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Weight (kg)" name={['vitals', 'weight']}
                  validateTrigger={['onBlur', 'onChange']}
                  hasFeedback
                  rules={[
                    { required: true, message: 'Please input weight!' },
                    {
                      type: 'number',
                      min: 1,
                      max: 500,
                      transform(value) {
                        return value ? Number(value) : null;
                      },
                      message: 'Weight must be between 1 kg and 500 kg!',
                    },
                    
                  ]}
                >
                  <Input type='number' 
                  
                    placeholder='eg 70'
                
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Respiration Rate (bpm)" name={['vitals', 'respirationRate']}
                  hasFeedback
                   rules={[
                    { required: true, message: 'Please input respiration rate!' },
                    {
                      pattern: /^[0-9]+$/,
                      message: 'Respiration rate must be a valid number!',
                    },
                    {
                      validator(_, value) {
                        if (!value || (value >= 12 && value <= 25)) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Respiration rate must be between 12 and 25 bpm!'));
                      },
                    },
                  ]}
                >
                  <Input type='text' 
                  
                  name='respirationRate'
                  placeholder='eg 18'
                  
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Pain (Scale 0-10)" name={['vitals', 'pain']}
                validationTrigger={['onBlur', 'onChange']}
                hasFeedback
                rules={[
                  { required: true, message: 'Please input pain level!' },
                  {
                    validator(_, value) {
                      if (value >= 0 && value <= 10) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Pain level must be a scale of 0-10 !'));
                    },
                  },
                ]}

                >
                
                  <Input type='text' 
                   
                    placeholder='eg 1'
              
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
              <Form.Item label="BMI" name={['vitals', 'bmi']}
              >
                <Input type='text' 
                
                 
                  disabled

                />

                </Form.Item>
              </Col>
            </Row>

          </Form>
        </Modal>

    </div>
  )
}

export default Vitals