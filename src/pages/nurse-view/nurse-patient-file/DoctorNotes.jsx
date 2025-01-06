import { Button, DatePicker, Form, Input, Modal, Select, Space, Typography } from "antd";
import { ProfileOutlined, FolderViewOutlined, PlusOutlined } from "@ant-design/icons";
import DoctorNotesTable from "../tables/nurse-tables/DoctorNotesTable";
import { useState, useEffect } from "react";
import TextArea from "antd/es/input/TextArea";
import useAuth from "../../../hooks/useAuth";
import moment from "moment";

const DoctorNotes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const docDetails = useAuth();
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [form] = Form.useForm();

  const notesTypes = [
    { value: '1', label: 'Doctor Notes' },
    { value: '2', label: 'Medical Report' },
    { value: '3', label: 'History' },
    { value: '4', label: 'Treatment Plan' },
    { value: '5', label: 'Chief Complaints' },
    { value: '6', label: 'Past Medical History' },
    { value: '7', label: 'Past Surgical History' },
    { value: '8', label: 'Social History' },
    { value: '9', label: 'Investigations' },
    { value: '10', label: 'Assessment and plan' }
  ];

  useEffect(() => {
    if (isModalOpen) {
      form.setFieldsValue({
        doctor: docDetails.userData.SearchName || `${docDetails.userData.firstName} ${docDetails.userData.lastName}` || docDetails.userData.no,
        doctorNotesDate: moment(),  // Default current date
        notesType: notesTypes[0].value,  // You can set a default note type if needed
      });
    }
  }, [isModalOpen, docDetails, form]);

  return (
    <div>
      <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '30px', position: 'relative' }}>
        <ProfileOutlined />
        <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '14px' }}>
          Doctor Notes
        </Typography.Text>
      </Space>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px' }}>
        <Button type="primary" style={{ width: '100%' }} onClick={() => showModal()}><PlusOutlined /> Add Doctor Notes</Button>
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
                     name="doctor"
                     value={docDetails.userData.SearchName|| `${docDetails.userData.firstName} ${docDetails.userData.lastName}`}
                     disabled
                    />
                </Form.Item>
                <Form.Item
                    label="Notes Type"
                    name="notesType"
                    rules={[{ required: true, message: 'Please select Notes Type!' }]}
                >
                    <Select
                        options={notesTypes}
                        placeholder="Select Notes Type"
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
  );
};

export default DoctorNotes;
