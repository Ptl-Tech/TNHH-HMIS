import { Button, DatePicker, Form, Modal, Select, Space, Typography } from "antd";
import { useState } from "react";
import { PlusOutlined, ProfileOutlined, FolderViewOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import DiagnosisTable from "../tables/nurse-tables/DiagnosisTable";

const Diagnosis = () => {
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
              Diagnosis
          </Typography.Text>
        </Space>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
          <Button type="primary" style={{ width: '100%' }} onClick={()=>showModal()}><PlusOutlined /> Add Diagnosis</Button>
          <Button color="default" variant="outlined" style={{ width: '100%' }}><FolderViewOutlined /> Preview Diagnosis</Button>
        </div>

        <DiagnosisTable showModal={showModal} />

        <Modal title="Add Diagnosis" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form
            layout="vertical" 
            style={{ paddingTop: '10px'}} 
            form={form}
            autoComplete="off"
            >

            <Form.Item label="Diagnosis Type" 
                name="diagnosisType"
                rules={[{ required: true, message: 'Please select a diagnosis type!' }]}
                hasFeedback
                >
                <Select placeholder="Select a diagnosis type">
                    <Select.Option value="General">Post Diagnosis</Select.Option>
                    <Select.Option value="Allergy">Pre Diagnosis</Select.Option> 
                </Select>
            </Form.Item>
            <Form.Item label="Diagnosis" 
                name="diagnosis"
                rules={[{ required: true, message: 'Please select a diagnosis!' }]}
                hasFeedback
                >
                <Select placeholder="Select a diagnosis">
                    <Select.Option value="General">Bipolar</Select.Option>
                    <Select.Option value="Allergy">Depression</Select.Option> 
                </Select>
            </Form.Item>
            <Form.Item label="Date" 
                rules={[{ required: true, message: 'Please select a date!' }]}
                name="date"
                hasFeedback
                >
                <DatePicker type='text' placeholder="Enter date" style={{ width: '100%' }}/>
                  
            </Form.Item>  
            <Form.Item label="Description" name="description"
              rules={[{ required: true, message: 'Please enter a description!' }]}
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

export default Diagnosis