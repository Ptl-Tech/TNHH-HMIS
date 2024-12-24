import { Button, Form, Input, Modal, Space, Typography } from "antd"
import { PlusOutlined, ProfileOutlined, FolderViewOutlined } from "@ant-design/icons"
import { useState } from "react";
import AddAllergiesTable from "../tables/nurse-tables/AddAllergiesTable";

const AddAllergies = () => {

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
              Add Allergies and Medications
          </Typography.Text>
        </Space>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
          <Button type="primary" style={{ width: '100%' }} onClick={()=>showModal()}><PlusOutlined /> Add Allergies and Medications</Button>
          <Button color="default" variant="outlined" style={{ width: '100%' }}><FolderViewOutlined /> Preview Allergies and Medications</Button>
        </div>

        <AddAllergiesTable showModal={showModal} />

        <Modal title="Add Allergies and Medications" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form
            layout="vertical" 
            style={{ paddingTop: '10px'}} 
            form={form}
            autoComplete="off"
            >

            <Form.Item label="Assessed by" 
                name={['allergy', 'assessedBy']}
                rules={[{ required: true, message: 'Please input your name!' }]}
                >
                <Input type='text' 
                name='assessedBy'
                disabled
                
                />
            </Form.Item>
            <Form.Item label="Complains" 
                name={['allergy', 'complains']}
                hasFeedback
                >
                <Input type='text' 
                    name='complains'
                    
                />
            </Form.Item>  
            <Form.Item label="Food Allergy" name={['allergy', 'foodAllergy']}
                        hasFeedback
            >
            <Input type='text' 
            
            name='foodAllergy'
            />
        </Form.Item>
        <Form.Item label="Drug Allergy" name={['allergy', 'drugAllergy']}
                        hasFeedback
            >
            <Input type='text' 
            name='drugAllergy'
            />
        </Form.Item>
        </Form>
        </Modal>

    </div>
  )
}

export default AddAllergies
