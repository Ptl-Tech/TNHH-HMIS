import { Form, Modal, Space, Typography } from "antd"
import { ProfileOutlined } from "@ant-design/icons"
import TreatmentHistoryTable from "../tables/nurse-tables/TreatmentHistoryTable"
import { useState } from "react";

const TreatmentsHistory = () => {
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
                Treatment History
            </Typography.Text>
        </Space>

        <TreatmentHistoryTable showModal={showModal}/>

        <Modal title="Treatment Report" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <Form
            
            layout="vertical" 
                style={{ paddingTop: '10px'}} 
                form={form}
            >

              content
          </Form>
        </Modal>
    </div>
  )
}

export default TreatmentsHistory