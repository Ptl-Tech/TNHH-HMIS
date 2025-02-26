import { Button, DatePicker, Form, Modal, Select, TimePicker } from "antd"
import { PlusOutlined, HeartOutlined, FolderViewOutlined } from "@ant-design/icons";
import { useState } from "react";
import TextArea from "antd/es/input/TextArea";
import TCAAppointmentTable from "../tables/nurse-tables/TCAAppointmentTable";
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader";

const TCAAppointments = () => {
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
        
        <NurseInnerHeader icon={<HeartOutlined />} title="TCA / Appointments" />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px',  marginTop: '20px'}}>
          <Button type="primary" style={{ width: '100%' }} onClick={()=>showModal()}><PlusOutlined /> Add Appointment</Button>
          <Button color="default" variant="outlined" style={{ width: '100%' }}><FolderViewOutlined /> Preview Appointment</Button>
        </div>


        <TCAAppointmentTable showModal={showModal} />

        <Modal title="TCA / Appointment" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form
            layout="vertical" 
            style={{ paddingTop: '10px'}} 
            form={form}
            autoComplete="off"
            >

            <Form.Item label="Next Appointment Date" 
                rules={[{ required: true, message: 'Please select a date!' }]}
                name="date"
                hasFeedback
                >
                <DatePicker type='text' placeholder="Enter date" style={{ width: '100%' }}/>
                  
            </Form.Item>  

            <Form.Item label="Next Appointment time" 
                rules={[{ required: true, message: 'Please select a time!' }]}
                name="time"
                hasFeedback
                >
                <TimePicker type='text' placeholder="Enter time" style={{ width: '100%' }}/>
                  
            </Form.Item>

            <Form.Item label="Book for (Doctor's name)" 
                name="diagnosisType"
                rules={[{ required: true, message: 'Please select a doctor!' }]}
                hasFeedback
                >
                <Select placeholder="Select a diagnosis type">
                    <Select.Option value="General">Dr. Smith</Select.Option>
                    <Select.Option value="Allergy">Dr. Jones</Select.Option> 
                </Select>
            </Form.Item>
            <Form.Item label="Remarks" name="remarks"
              hasFeedback
            >
            <TextArea type='text' placeholder="Enter remarks" 
             
            />
        </Form.Item>
        </Form>
        </Modal>

    </div>
  )
}

export default TCAAppointments