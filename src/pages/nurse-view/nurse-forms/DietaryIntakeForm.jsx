import { Button, Col, Divider, Form, Input, Modal, Row, Select, Space, Typography } from 'antd'
import { PlusOutlined, ProfileOutlined, FolderViewOutlined } from '@ant-design/icons'
import { useState } from 'react';
import TextArea from 'antd/es/input/TextArea';
import DietaryIntakeTable from '../tables/nurse-tables/DietaryIntakeTable';

const DietaryIntakeForm = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
      setIsModalOpen(true);
    };
    const handleOk = () => {
      setIsModalOpen(false);
    };
    const handleCancel = () => {
      setIsModalOpen(false);
    };
  
    const [ form ] = Form.useForm();
  return (
    <div>
        <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '30px', position: 'relative'}}>
          <ProfileOutlined />
          <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '14px'}}>
              Dietary Intake Form
          </Typography.Text>
        </Space>


        <div>
            <Form
                style={{ paddingTop: '10px'}} 
                form={form}
                layout="vertical"
            >

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="Admission No"
                        name="admissionNo"
                        hasFeedback
                    >
                        <Input placeholder="Admission No" disabled/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Height"
                        name="height"
                        hasFeedback
                    >
                        <Input placeholder="Height" type='number'/>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="Weight"
                        name="weight"
                        hasFeedback
                    >
                        <Input placeholder="Weight" type='number'/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="RM"
                        name="rm"
                        hasFeedback
                    >
                        <Input placeholder="RM" type='number'/>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="Meal Preference"
                        name="mealPreference"
                        hasFeedback
                    >
                        <Input placeholder="Meal Preference" type='text'/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Beverage Preference"
                        name="beveragePreference"
                        hasFeedback
                    >
                        <Input placeholder="Beverage Preference" type='text'/>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Button type="primary" style={{ width: '100%' }}><PlusOutlined /> Save
                    </Button>
                </Col>
            </Row>

            </Form>
        </div>

        <Divider />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
          <Button type="primary" style={{ width: '100%' }} onClick={()=>showModal()}><PlusOutlined /> Add Form
          </Button>
          <Button color="default" variant="outlined" style={{ width: '100%' }}><FolderViewOutlined />
            Preview Form
          </Button>
        </div>

        <DietaryIntakeTable showModal={showModal} />

        <Modal title="Dietary Intake Form" 
          open={isModalOpen} 
          onOk={handleOk} 
          onCancel={handleCancel}
          okText="Save Form"
        >
            <Form
            
            layout="vertical" 
                style={{ paddingTop: '10px'}} 
                form={form}
            >
          
            <Form.Item 
                label="Admission No" 
                name="admissionNo"
                hasFeedback
                >
                <Input placeholder="Admission No"
                    type='text'
                    disabled
                />
            </Form.Item>

            <Form.Item
            label="Category"    
            name="category"
            hasFeedback
            >
                <Select>
                    <Select.Option value="morning">Good</Select.Option>
                    <Select.Option value="afternoon">Average</Select.Option>
                    <Select.Option value="evening">Poor</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item 
                label="Comments" 
                name="comments"
                hasFeedback
                >
                <TextArea placeholder="Comments"
                    type="text"
                    
                />
            </Form.Item>
            </Form>
        </Modal> 
    </div>
  )
}

export default DietaryIntakeForm