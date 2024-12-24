import { Button, DatePicker, Form, Modal, Select, Space, TimePicker, Typography } from "antd"
import { PlusOutlined, ProfileOutlined, FolderViewOutlined } from "@ant-design/icons";
import { useState } from "react";
import TextArea from "antd/es/input/TextArea";
import ETCTable from "../tables/nurse-tables/ETCTable";


const ECTScan = () => {
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
              ECT Scan
          </Typography.Text>
        </Space>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
          <Button type="primary" style={{ width: '100%' }} onClick={()=>showModal()}><PlusOutlined /> Add ECT</Button>
          <Button color="default" variant="outlined" style={{ width: '100%' }}><FolderViewOutlined /> Preview ECT</Button>
        </div>



        <ETCTable showModal={showModal} />


        <Modal title="ECT Scan" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form
            layout="vertical" 
            style={{ paddingTop: '10px'}} 
            form={form}
            autoComplete="off"
            >

            <Form.Item label="Operation" 
                name="operation"
                rules={[{ required: true, message: 'Please select a operation!' }]}
                hasFeedback
                >
                <Select placeholder="Select a operation">
                    <Select.Option value="General">ECT</Select.Option> 
                </Select>
            </Form.Item>
            <Form.Item label="Doctor Name" 
                name="doctorName"
                rules={[{ required: true, message: 'Please select a doctor name!' }]}
                hasFeedback
                >
                <Select placeholder="Select a doctor name">
                    <Select.Option value="General">Dr. John</Select.Option>
                    <Select.Option value="Allergy">Dr. Jane</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item label="Operation Date" 
                rules={[{ required: true, message: 'Please select a date!' }]}
                name="date"
                hasFeedback
                >
                <DatePicker type='text' placeholder="Enter date" style={{ width: '100%' }}/>
                  
            </Form.Item> 
            <Form.Item label="Operation Time" 
                rules={[{ required: true, message: 'Please select a time!' }]}
                name="time"
                hasFeedback
                >
                <TimePicker type='text' placeholder="Enter time" style={{ width: '100%' }}/>
                  
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

export default ECTScan