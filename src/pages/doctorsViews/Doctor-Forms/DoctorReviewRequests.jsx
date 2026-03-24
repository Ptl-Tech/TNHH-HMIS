import { Button, DatePicker, Form, Modal, Select, Space, Typography } from 'antd';
import { ProfileOutlined } from '@ant-design/icons';
import { useState } from 'react';
import TextArea from 'antd/es/input/TextArea';
import MentalStatusExaminationTable from '../../nurse-view/tables/nurse-tables/MentalStatusExaminationTable';

const DoctorReviewRequest = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    
    const showModal = () => {
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleOnFinish = (values) => {
        console.log("Form values: ", values);
        // Add logic to handle form submission (e.g., API call)
        setIsModalOpen(false);
    };

    return (
        <div>
            <Space style={{ color: '#b96000', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '30px', position: 'relative' }}>
                <ProfileOutlined />
                <Typography.Text style={{ fontWeight: 'bold', color: '#b96000', fontSize: '14px' }}>
                    Doctor Review Request Form
                </Typography.Text>
            </Space>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px' }}>
                {/* Add Form button to open the modal */}
                <Button type="primary" style={{ width: '100%' }} onClick={showModal}>
                    Add Form
                </Button>
                <Button color="default" variant="outlined" style={{ width: '100%' }}>
                    {/* Placeholder Button (No Action) */}
                    Preview Form
                </Button>
            </div>

            {/* Placeholder table for Doctor Review Request */}
            <MentalStatusExaminationTable />

            <Modal 
                title="Doctor Review Request Form" 
                open={isModalOpen} 
                onCancel={handleCancel}
                footer={null} // Removed the action buttons (OK, Cancel)
            >
                <Form
                    layout="vertical"
                    style={{ paddingTop: '10px' }}
                    form={form}
                    onFinish={handleOnFinish}
                    initialValues={{ date: '', status: '', comments: '' }}
                >
                    <Form.Item 
                        label="Date" 
                        name="date"
                        hasFeedback
                        rules={[{ required: true, message: 'Please input date!' }]}
                    >
                        <DatePicker placeholder="Date" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Status"    
                        name="status"
                        hasFeedback
                        rules={[{ required: true, message: 'Please select status!' }]}
                    >
                        <Select>
                            <Select.Option value="good">Good</Select.Option>
                            <Select.Option value="average">Average</Select.Option>
                            <Select.Option value="bad">Bad</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item 
                        label="Comments" 
                        name="comments"
                        hasFeedback
                        rules={[{ required: true, message: 'Please input comments!' }]}
                    >
                        <TextArea placeholder="Comments" />
                    </Form.Item>

                    {/* Submit button inside modal to handle form submission */}
                    <Form.Item style={{ textAlign: 'center' }}>
                        <Button type="primary" htmlType="submit">
                            Submit Form
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DoctorReviewRequest;
