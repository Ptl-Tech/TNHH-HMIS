import { Button, DatePicker, Form, Input, Modal, Space, TimePicker, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import { ProfileOutlined, PlusOutlined, PrinterOutlined } from "@ant-design/icons";
import NursingNotesTable from "../tables/nurse-tables/NursingNotesTable";
import { useState } from "react";


const NursingNotes = () => {

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
                Nursing Notes
            </Typography.Text>
        </Space>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
          <Button type="primary" style={{ width: '100%' }} onClick={()=>showModal()}><PlusOutlined /> Add Nursing Notes</Button>
          <Button color="default" variant="outlined" style={{ width: '100%' }}><PrinterOutlined /> Print Cardex</Button>
        </div>

        <NursingNotesTable showModal={showModal}/>

        <Modal title="Nursing Notes" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <Form
            
            layout="vertical" 
                style={{ paddingTop: '10px'}} 
                form={form}
            >

            <Form.Item 
                label="Date" 
                name="nurseNotesDate"
                rules={[{ required: true, message: 'Please enter the date!' }]}
              >
                  <DatePicker style={{ width: '100%'}}
             />
            </Form.Item>
            <Form.Item 
                label="Time" 
                name="nurseNotesTime"
                rules={[{ required: true, message: 'Please enter the time!' }]}
              >
                  <TimePicker style={{ width: '100%'}}
             />
            </Form.Item>
            <Form.Item 
                  label="Nurse Name" 
                  name="nurse"
                    >   
                    <Input placeholder="Nurse name" 
                     disabled
                    />
                </Form.Item>
                <Form.Item 
                label="Nurse Notes" 
                name="nurseNotes"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the notes!',
                  },
                  {
                      validator: (_, value) => {
                        if (value && value.length > 2000) {
                          return Promise.reject(new Error('Nurse notes cannot exceed 150 characters!'));
                        }
                        return Promise.resolve();
                      },
                  }
                ]}
              >
              <TextArea placeholder="Enter Nurse Notes" name="Nurse Notes"
                  rows={3}
              />
            </Form.Item>
            </Form>
        </Modal>
        
    </div>
  )
}

export default NursingNotes