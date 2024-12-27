import { Button, DatePicker, Form, Input, Modal, Space, TimePicker, Typography } from 'antd'
import { PlusOutlined, ProfileOutlined, FolderViewOutlined } from '@ant-design/icons'
import { useState } from 'react';
import TextArea from 'antd/es/input/TextArea';
import SuicidalFormTable from '../tables/nurse-tables/SuicidalFormTable';

const SuicidalForm = () => {
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
              Suicidal Precaution Form
          </Typography.Text>
        </Space>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
          <Button type="primary" style={{ width: '100%' }} onClick={()=>showModal()}><PlusOutlined /> Add Form
          </Button>
          <Button color="default" variant="outlined" style={{ width: '100%' }}><FolderViewOutlined />
            Preview Form
          </Button>
        </div>

        <SuicidalFormTable showModal={showModal} />


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
                label="Time" 
                name="time"
                hasFeedback
                >
                <TimePicker placeholder="Time"
                    type='text'
                    style={{ width: '100%' }}
                />
            </Form.Item>

            <Form.Item 
                label="Handing Over" 
                name="handingOver"
                hasFeedback
                >
                <Input placeholder="Handing Over Nurse"
                    type="text"
                />
            </Form.Item>

            <Form.Item 
                label="Taking Over" 
                name="takingOver"
                hasFeedback
                >
                <Input placeholder="Taking Over Nurse"
                    type="text"
                    disabled
                />
            </Form.Item>
            <Form.Item 
                label="Remarks" 
                name="remarks"
                hasFeedback
                >
                <TextArea placeholder="Remarks"
                    type="text"
                    
                />
            </Form.Item>
            </Form>
        </Modal>

    </div>
  )
}

export default SuicidalForm