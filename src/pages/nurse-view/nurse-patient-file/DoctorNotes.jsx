import { Button, DatePicker, Form, Input, Modal, Space, Typography } from "antd"
import { ProfileOutlined, FolderViewOutlined, PlusOutlined } from "@ant-design/icons"
import DoctorNotesTable from "../tables/nurse-tables/DoctorNotesTable"
import { useState } from "react";
import TextArea from "antd/es/input/TextArea";

const DoctorNotes = () => {
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
                Doctor Notes
            </Typography.Text>
        </Space>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
          <Button type="primary" style={{ width: '100%' }} onClick={()=>showModal()}><PlusOutlined /> Add Doctor Notes</Button>
          <Button color="default" variant="outlined" style={{ width: '100%' }}><FolderViewOutlined /> View Treatment Plan</Button>
        </div>

        <DoctorNotesTable showModal={showModal}/>

        <Modal title="Doctor Notes" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <Form
            
            layout="vertical" 
                style={{ paddingTop: '10px'}} 
                form={form}
            >

            <Form.Item 
                label="Date" 
                name="doctorNotesDate"
                rules={[{ required: true, message: 'Please enter the date!' }]}
              >
                  <DatePicker style={{ width: '100%'}}
             />
            </Form.Item>
            <Form.Item 
                  label="Doctor" 
                  name="doctor"
                    >   
                    <Input placeholder="Doctor name" 
                     disabled
                    />
                </Form.Item>
                <Form.Item 
                label="Doctor Notes" 
                name="doctorNotes"
                rules={[
                  {
                    required: true,
                    message: 'Please enter Doctor Notes!',
                  },
                  {
                      validator: (_, value) => {
                        if (value && value.length > 2000) {
                          return Promise.reject(new Error('Doctor Notes cannot exceed 150 characters!'));
                        }
                        return Promise.resolve();
                      },
                  }
                ]}
              >
              <TextArea placeholder="Enter Doctor Notes" name="Doctor Notes"
                  rows={3}
              />
            </Form.Item>
            </Form>
        </Modal>
        
    </div>
  )
}

export default DoctorNotes