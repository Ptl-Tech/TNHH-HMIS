import { Button, DatePicker, Form, Input, Modal, Select, Space, TimePicker, Typography } from "antd";
import { useState } from "react";
import { PlusOutlined, ProfileOutlined, FolderViewOutlined } from "@ant-design/icons";
import GeneralObservationsTable from "../tables/nurse-tables/GeneralObservationsTable";

const GeneralObservations = () => {
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
              Observations
          </Typography.Text>
        </Space>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
          <Button type="primary" style={{ width: '100%' }} onClick={()=>showModal()}><PlusOutlined /> Add Observations</Button>
          <Button color="default" variant="outlined" style={{ width: '100%' }}><FolderViewOutlined /> Preview Observations</Button>
        </div>

        <GeneralObservationsTable showModal={showModal} />

        <Modal title="Add General Observations" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form
            layout="vertical" 
            style={{ paddingTop: '10px'}} 
            form={form}
            autoComplete="off"
            >

            <Form.Item label="Category" 
                name="category"
                rules={[{ required: true, message: 'Please select a category!' }]}
                hasFeedback
                >
                <Select placeholder="Select a category">
                    <Select.Option value="General">General</Select.Option>
                    <Select.Option value="Allergy">Allergy</Select.Option>
                    <Select.Option value="Medication">Medication</Select.Option>  
                </Select>
            </Form.Item>
            <Form.Item label="Date" 
                rules={[{ required: true, message: 'Please select a date!' }]}
                name="date"
                hasFeedback
                >
                <DatePicker type='text' placeholder="Enter date" style={{ width: '100%' }}/>
                  
            </Form.Item>  
            <Form.Item label="Time" name="time"
              rules={[{ required: true, message: 'Please select a time!' }]}
              hasFeedback
            >
            <TimePicker type='text' placeholder="Enter time" 
            style={{ width: '100%' }}
            />
        </Form.Item>
        <Form.Item label="Value" name="value"
          rules={[{ required: true, message: 'Please enter a value!' }]}
        >
            <Input type='text' placeholder="Enter value" />
        </Form.Item>
        </Form>
        </Modal>

    </div>
  )
}

export default GeneralObservations