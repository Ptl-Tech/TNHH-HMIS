import { Button, DatePicker, Form, Input, Modal, Select, Space, Typography } from 'antd'
import { useState } from 'react'
import { PlusOutlined, ProfileOutlined, FolderViewOutlined } from '@ant-design/icons'
import JacksonVisualFormTable from '../tables/nurse-tables/JacksonVisualFormTable';

const JacksonVisualForm = () => {
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
              Jackson Visual Form
          </Typography.Text>
        </Space>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
          <Button type="primary" style={{ width: '100%' }} onClick={()=>showModal()}><PlusOutlined /> Add Form
          </Button>
          <Button color="default" variant="outlined" style={{ width: '100%' }}><FolderViewOutlined />
            Preview Form
          </Button>
        </div>

        <JacksonVisualFormTable showModal={showModal} />


        <Modal title="Jackson Visual Form" 
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
                name="admission_no"
                hasFeedback
                >
                <Input placeholder="Admission No"
                    type='text'
                    disabled
                />
            </Form.Item>

            <Form.Item 
                label="Nurse" 
                name="nurse"
                hasFeedback
                >
                <Input placeholder="Nurse"
                    type="text"
                    disabled
                    
                />
            </Form.Item>
          
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
                label="Score" 
                name="score"
                hasFeedback
                >
                <Input placeholder="Score"
                    type='number'
                />
            </Form.Item>

            <Form.Item
            label="IV Line"    
            name="iv_line"
            hasFeedback
            >
                <Select>
                    <Select.Option value="morning">Removal</Select.Option>
                    <Select.Option value="afternoon">Insertion</Select.Option>
                </Select>
            </Form.Item>
            </Form>
        </Modal>

    </div>
  )
}

export default JacksonVisualForm