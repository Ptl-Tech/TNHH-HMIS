import { Button, DatePicker, Form, Modal, Select, Space, Typography } from "antd";
import { useState } from "react";
import { PlusOutlined, ProfileOutlined, FolderViewOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import DiagnosisTable from "../tables/nurse-tables/DiagnosisTable";

const Injections = () => {
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
              Injections
          </Typography.Text>
        </Space>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
          <Button type="primary" style={{ width: '100%' }} onClick={()=>showModal()}><PlusOutlined /> Add Injection</Button>
          <Button color="default" variant="outlined" style={{ width: '100%' }}><FolderViewOutlined /> Preview Injection</Button>
        </div>

        <DiagnosisTable showModal={showModal} />

        <Modal title="Add Diagnosis" 
              open={isModalOpen}
              onOk={handleOk} 
              onCancel={handleCancel}
              okText={'Save Injection'}
              >
        <Form
            layout="vertical" 
            style={{ paddingTop: '10px'}} 
            form={form}
            autoComplete="off"
            >

              <Form.Item label="Injection Date" 
                rules={[{ required: true, message: 'Please select a date!' }]}
                name="date"
                hasFeedback
                >
                <DatePicker type='text' placeholder="Enter date" style={{ width: '100%' }}/>
                  
            </Form.Item>
            <Form.Item label="Injection" 
                name="injection"
                rules={[{ required: true, message: 'Please select injection!' }]}
                hasFeedback
                >
                <Select placeholder="Injection">
                    <Select.Option value="General">Post Diagnosis</Select.Option>
                    <Select.Option value="Allergy">Pre Diagnosis</Select.Option> 
                </Select>
            </Form.Item>
      
            <Form.Item label="Remarks" name="remarks"
              rules={[{ required: true, message: 'Please enter a remarks!' }]}
              hasFeedback
            >
            <TextArea type='text' placeholder="Enter description" 
             
            />
        </Form.Item>
        </Form>
        </Modal>

    </div>
  )
}

export default Injections