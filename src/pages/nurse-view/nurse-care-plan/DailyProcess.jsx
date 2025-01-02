import { Button, DatePicker, Form, Input, Modal, Select, Space, TimePicker, Typography } from "antd";
import { useState } from "react";
import { PlusOutlined, ProfileOutlined, FolderViewOutlined } from "@ant-design/icons";
import GeneralObservationsTable from "../tables/nurse-tables/GeneralObservationsTable";
import TextArea from "antd/es/input/TextArea";

const DailyProcess = () => {
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
              Daily Process / Procedures
          </Typography.Text>
        </Space>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
          <Button type="primary" style={{ width: '100%' }} onClick={()=>showModal()}><PlusOutlined /> Add Daily Process</Button>
          <Button color="default" variant="outlined" style={{ width: '100%' }}><FolderViewOutlined /> Preview Daily Process</Button>
        </div>

        <GeneralObservationsTable showModal={showModal} />

        <Modal title="Daily Process / Procedures" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form
            layout="vertical" 
            style={{ paddingTop: '10px'}} 
            form={form}
            autoComplete="off"
            >
            <Form.Item label="Process" 
                rules={[{ required: true, message: 'Please select process!' }]}
                name="process"
                hasFeedback
                >
                <Input type='text' placeholder="Enter value" />
                  
            </Form.Item>  
            <Form.Item label="Time" name="time"
              rules={[{ required: true, message: 'Please select a time!' }]}
              hasFeedback
            >
            <TimePicker type='text' placeholder="Enter time" 
            style={{ width: '100%' }}
            />
        </Form.Item>
        <Form.Item label="Remarks" name="remarks"
          rules={[{ required: true, message: 'Please enter a value!' }]}
        >
            <TextArea type='text' placeholder="Enter value" />
        </Form.Item>
        </Form>
        </Modal>

    </div>
  )
}

export default DailyProcess