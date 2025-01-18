import { Form, Modal } from "antd"
import { SolutionOutlined } from "@ant-design/icons"
import TreatmentHistoryTable from "../tables/nurse-tables/TreatmentHistoryTable"
import { useState } from "react";
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader";

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
      
      <NurseInnerHeader icon={<SolutionOutlined />} title="Treatment History" />

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