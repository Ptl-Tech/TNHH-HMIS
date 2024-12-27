import { Button, DatePicker, Form, Modal, Select, Space, Typography } from 'antd'
import { PlusOutlined, ProfileOutlined, FolderViewOutlined } from '@ant-design/icons'
import { useState } from 'react';
import TextArea from 'antd/es/input/TextArea';
import MentalStatusExaminationTable from '../tables/nurse-tables/MentalStatusExaminationTable';

const MentalStateExaminationForm = () => {
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
              Mental State Examination Form
          </Typography.Text>
        </Space>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
          <Button type="primary" style={{ width: '100%' }} onClick={()=>showModal()}><PlusOutlined /> Add Form
          </Button>
          <Button color="default" variant="outlined" style={{ width: '100%' }}><FolderViewOutlined />
            Preview Form
          </Button>
        </div>

        <MentalStatusExaminationTable showModal={showModal} />

        <Modal title="Suicidal Precaution Form" 
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
                label="Date" 
                name="date"
                hasFeedback
                >
                <DatePicker placeholder="Date"
                    type='text'
                    style={{ width: '100%' }}
                />
            </Form.Item>

            <Form.Item
            label="Status"    
            name="status"
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

export default MentalStateExaminationForm
