import { Button, Form, Input, Modal, Select, Space, Typography } from "antd"
import { ProfileOutlined, PlusOutlined, FolderViewOutlined } from "@ant-design/icons"
import { useState } from "react";
import TextArea from "antd/es/input/TextArea";
import PhysiotherapyRequestTable from "../tables/nurse-tables/PhysiotherapyRequestTable";


const PhysiotherapyRequest = () => {
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
      <Space style={{ color: '#b96000', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '30px', position: 'relative'}}>
          <ProfileOutlined />
          <Typography.Text style={{ fontWeight: 'bold', color: '#b96000', fontSize: '14px'}}>
              Physiotherapy
          </Typography.Text>
        </Space>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
          <Button type="primary" style={{ width: '100%' }} onClick={()=>showModal()}><PlusOutlined /> Add Physiotherapy</Button>
          <Button color="default" variant="outlined" style={{ width: '100%' }}><FolderViewOutlined /> Preview Physiotherapy</Button>
        </div>

        <PhysiotherapyRequestTable />

        
        <Modal title="Physiotherapy" 
          open={isModalOpen} onOk={handleOk} 
          onCancel={handleCancel}
          okText="Send to Physiotherapy"
        >
            <Form
            
            layout="vertical" 
                style={{ paddingTop: '10px'}} 
                form={form}
            >
            <Form.Item 
            label="Diagnosis" 
            name="diagnosis"
            rules={[
              {
                  validator: (_, value) => {
                    if (value && value.length > 150) {
                      return Promise.reject(new Error('Diagnosis cannot exceed 150 characters!'));
                    }
                    return Promise.resolve();
                  },
              }
            ]}
          >
          <TextArea placeholder="Enter diagnosis" name="diagnosis"
              rows={2}
          />
        </Form.Item>

        <Form.Item 
            label="Treatment" 
            name="treatment"
            rules={[
              {
                  validator: (_, value) => {
                    if (value && value.length > 200) {
                      return Promise.reject(new Error('Treatment cannot exceed 200 characters!'));
                    }
                    return Promise.resolve();
                  },
              }
            ]}
          >
          <TextArea placeholder="Enter treatment" name="treatment"
              rows={2}
          />
        </Form.Item>

        <Form.Item 
                label="Process" 
                name="process"
                rules={[{ required: true, message: 'Please enter the process!' }]}
              >
              <Select
                style={{ width: '100%' }}
                placeholder="Select process"
                allowClear
                showSearch
              >
                <Select.Option value="option1">Process 1</Select.Option>
                <Select.Option value="option2">Process 2</Select.Option>
              </Select>
          </Form.Item>

          <Form.Item 
                label="Frequency per Week" 
                name="frequency"
                rules={[{ required: true, message: 'Please enter frequency per week!' }]}
              >
                  <Input type="number" placeholder="Enter frequency per week"
             />
          </Form.Item>

          <Form.Item 
                label="Duration" 
                name="duration"
                rules={[{ required: true, message: 'Please enter duration!' }]}
              >
                  <Input type="text" placeholder="Enter duration"
             />
          </Form.Item>


          <Form.Item 
            label="Special Remarks" 
            name="specialRemarks"
            rules={[
              {
                  validator: (_, value) => {
                    if (value && value.length > 200) {
                      return Promise.reject(new Error('Special Remarks cannot exceed 200 characters!'));
                    }
                    return Promise.resolve();
                  },
              }
            ]}
          >
          <TextArea placeholder="Enter special remarks" name="specialRemarks"
              rows={2}
          />
        </Form.Item>

        </Form>
        </Modal>

    </div>
  )
}

export default PhysiotherapyRequest