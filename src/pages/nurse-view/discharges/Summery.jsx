import { Button, DatePicker, Form, Modal } from "antd"
import { PlusOutlined, FileOutlined, FolderViewOutlined } from "@ant-design/icons"
import { useState } from "react";
import TextArea from "antd/es/input/TextArea";
import DischargeSummeryTable from "../tables/nurse-tables/DischargeSummeryTable";
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader";

const Summery = () => {
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

        <NurseInnerHeader icon={<FileOutlined/>} title="Discharge Summary" />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
            <Button type="primary" style={{ width: '100%' }} onClick={()=>showModal()}><PlusOutlined /> Add Discharge Summary
          </Button>
          <Button color="default" variant="outlined" style={{ width: '100%' }}><FolderViewOutlined />
            Preview Discharge Summary
          </Button>
        </div>

        <DischargeSummeryTable showModal={showModal}/>


        <Modal title="Charge Summary" 
          open={isModalOpen} 
          onOk={handleOk} 
          onCancel={handleCancel}
          okText="Save Discharge Summary"
        >
            <Form
            
            layout="vertical" 
                style={{ paddingTop: '10px'}} 
                form={form}
            >
          
            <Form.Item 
                label="Investigations Done" 
                name="investigationsDone"
                rules={[
                {
                    validator: (_, value) => {
                        if (value && value.length > 150) {
                        return Promise.reject(new Error('Investigations done cannot exceed 150 characters!'));
                        }
                        return Promise.resolve();
                    },
                }
                ]}
                >
                <TextArea placeholder="Enter investigations done"
                    rows={2}
                />
            </Form.Item>

            <Form.Item 
                label="Management" 
                name="management"
                rules={[
                {
                    validator: (_, value) => {
                        if (value && value.length > 150) {
                        return Promise.reject(new Error('Management cannot exceed 150 characters!'));
                        }
                        return Promise.resolve();
                    },
                }
                ]}
                >
                <TextArea placeholder="Enter management"
                    rows={2}
                />
            </Form.Item>

            <Form.Item 
                label="Discharge instructions / Treatments" 
                name="dischargeInstructionsTreatments"
                rules={[
                {
                    validator: (_, value) => {
                        if (value && value.length > 150) {
                        return Promise.reject(new Error('Discharge instructions cannot exceed 150 characters!'));
                        }
                        return Promise.resolve();
                    },
                }
                ]}
                >
                <TextArea placeholder="Enter discharge instructions"
                    rows={2}
                />
            </Form.Item>


            <Form.Item 
                label="Review Date" 
                name="reviewDate"
                >
                <DatePicker placeholder="Review Date" style={{ width: '100%' }} />
            </Form.Item>

            </Form>
        </Modal>

    </div>
  )
}

export default Summery