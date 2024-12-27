import { Button, Form, Input, Modal, Space, Typography } from "antd"
import { PlusOutlined, ProfileOutlined, FolderViewOutlined } from "@ant-design/icons"
import { useState } from "react"
import VisitorFormTable from "../tables/nurse-tables/VisitorFormTable";

const VisitorsList = () => {

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
              Visitor List
          </Typography.Text>
        </Space>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
          <Button type="primary" style={{ width: '100%' }} onClick={()=>showModal()}><PlusOutlined /> Add Visitor
          </Button>
          <Button color="default" variant="outlined" style={{ width: '100%' }}><FolderViewOutlined />
            Preview Visitor List
          </Button>
        </div>

        <VisitorFormTable showModal={showModal} />

        <Modal title="Visitor Form" 
          open={isModalOpen} 
          onOk={handleOk} 
          onCancel={handleCancel}
          okText="Save Visitor"
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
                label="Visitor Name" 
                name="visitorName"
                hasFeedback
                >
                <Input placeholder="Visitor Name"
                    type='text'
                />
            </Form.Item>

            <Form.Item 
                label="ID Number" 
                name="idNumber"
                hasFeedback
                >
                <Input placeholder="ID Number"
                    type="number"
                />
            </Form.Item>

            <Form.Item 
                label="Phone Number" 
                name="phoneNumber"
                hasFeedback
                >
                <Input placeholder="Phone Number"
                    type="number"
                />
            </Form.Item>
            </Form>
        </Modal>


    </div>
  )
}

export default VisitorsList