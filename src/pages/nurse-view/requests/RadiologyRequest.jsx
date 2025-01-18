import { Button, Form, Modal, Select } from "antd"
import { MedicineBoxOutlined, PlusOutlined, FolderViewOutlined } from "@ant-design/icons"
import { useState } from "react";
import TextArea from "antd/es/input/TextArea";
import RadiologyRequestTable from "../tables/nurse-tables/RadiologyRequestTable";
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader";
import RadiologyRequestFormData from "../forms/nurse-forms/RadiologyRequestFormData";

const RadiologyRequest = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const showModal = () => {
      setIsModalOpen(true);
    };
    const handleOk = () => {
      setIsModalOpen(false);
    };
    const handleCancel = () => {
      setIsModalOpen(false);
    };

    const handleVitalsButtonVisibility = () => {
      setIsFormVisible(!isFormVisible);
    }
  
    const [ form ] = Form.useForm();

  return (
    <div>
        
        <NurseInnerHeader icon={<MedicineBoxOutlined />} title="Radiology Request" />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
            <Button type="primary" style={{ width: '100%' }} onClick={handleVitalsButtonVisibility}><PlusOutlined /> Add Radiology Request
          </Button>
          <Button color="default" variant="outlined" style={{ width: '100%' }}><FolderViewOutlined />
            Preview Radiology Request
          </Button>
        </div>

        {
          isFormVisible && (
            <RadiologyRequestFormData setIsFormVisible={setIsFormVisible} />
          )
        }

        {
          !isFormVisible && (
            <RadiologyRequestTable />
          )
        }

        <Modal title="Radiology Request" 
          open={isModalOpen} 
          onOk={handleOk} 
          onCancel={handleCancel}
          okText="Send to Radiology"
        >
            <Form
            
            layout="vertical" 
                style={{ paddingTop: '10px'}} 
                form={form}
            >

            <Form.Item
            label="Radiology Type"
            name="radiologyType"
            rules={[{ required: true, message: 'Please enter the radiology type!' }]}
            hasFeedback
            >

            <Select
                style={{ width: '100%' }}
                placeholder="Select a laboratory test request name"
                allowClear
                showSearch
              >
                <Select.Option value="option1">Albunine test</Select.Option>
                <Select.Option value="option2">Urine toxicology</Select.Option>
              </Select>

              </Form.Item>
          
            <Form.Item 
            label="Required Investigation" 
            name="requiredInvestigation"
            rules={[
              {
                  validator: (_, value) => {
                    if (value && value.length > 200) {
                      return Promise.reject(new Error('Required Investigation cannot exceed 200 characters!'));
                    }
                    return Promise.resolve();
                  },
              }
            ]}
          >
          <TextArea placeholder="Enter required investigation"
              rows={2}
          />
        </Form.Item>
        <Form.Item 
            label="Brief History" 
            name="briefHistory"
            rules={[
              {
                  validator: (_, value) => {
                    if (value && value.length > 150) {
                      return Promise.reject(new Error('Brief History cannot exceed 150 characters!'));
                    }
                    return Promise.resolve();
                  },
              }
            ]}
          >
          <TextArea placeholder="Enter brief history" name="briefHistory"
              rows={2}
          />
        </Form.Item>
            </Form>
        </Modal>

    </div>
  )
}

export default RadiologyRequest