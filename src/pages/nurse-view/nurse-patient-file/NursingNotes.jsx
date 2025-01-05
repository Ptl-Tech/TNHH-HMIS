import { Button, DatePicker, Form, Input, Modal, Space, TimePicker, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import { ProfileOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons";
import NursingNotesTable from "../tables/nurse-tables/NursingNotesTable";
import { useState } from "react";
import useAuth from "../../../hooks/useAuth";

const NursingNotes = () => {
  const role = useAuth().userData.departmentName; // Get user role from useAuth hook
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewNotes, setViewNotes] = useState(false); // State to control viewing notes
  const [form] = Form.useForm();

  // Modal open and close handlers
  const showModal = () => {
    setIsModalOpen(true);
    if (role === "Doctor") {
      setViewNotes(true); // Set viewNotes to true when doctor clicks to view notes
    } else {
      setViewNotes(false); // Default to adding notes for non-doctors
    }
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '30px', position: 'relative' }}>
        <ProfileOutlined />
        <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '14px' }}>
          Nursing Notes
        </Typography.Text>
      </Space>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px' }}>
        {/* Conditionally render buttons based on role */}
        {role !== 'Doctor' && (
          <Button type="primary" style={{ width: '100%' }} onClick={showModal}>
            <PlusOutlined /> Add Nursing Notes
          </Button>
        )}

        {role === 'Doctor' && (
          <>
            {/* Button to view Nursing Notes for Doctor */}
            <Button
              type="primary"
              style={{ width: '50%' }}
              icon={<EyeOutlined />}
              onClick={showModal}
            >
              View Nursing Notes
            </Button>
          </>
        )}
      </div>

      <NursingNotesTable showModal={showModal} />

      <Modal 
        title={viewNotes ? "View Nursing Notes" : "Nursing Notes"} 
        open={isModalOpen} 
        onOk={handleOk} 
        onCancel={handleCancel}
        footer={null} // Remove footer buttons (if required)
      >
        {/* Render different content based on the role */}
        {viewNotes ? (
          <div>
            <Typography.Text>View Nursing Notes content goes here...</Typography.Text>
            {/* Add content related to viewing the notes */}
          </div>
        ) : (
          <Form
            layout="vertical"
            style={{ paddingTop: '10px' }}
            form={form}
          >
            <Form.Item
              label="Date"
              name="nurseNotesDate"
              rules={[{ required: true, message: 'Please enter the date!' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              label="Time"
              name="nurseNotesTime"
              rules={[{ required: true, message: 'Please enter the time!' }]}
            >
              <TimePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              label="Nurse Name"
              name="nurse"
            >
              <Input placeholder="Nurse name" disabled />
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
                      return Promise.reject(new Error('Nurse notes cannot exceed 2000 characters!'));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <TextArea placeholder="Enter Nurse Notes" name="Nurse Notes" rows={3} />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default NursingNotes;
