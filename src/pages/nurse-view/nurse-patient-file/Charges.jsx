import { Button, Form, Input, Modal, Select, Space, Typography } from "antd"
import { ProfileOutlined, PlusOutlined, FolderViewOutlined } from "@ant-design/icons"
import { useState } from "react";
import TextArea from "antd/es/input/TextArea";
import ChargesTable from "../tables/nurse-tables/ChargesTable";

const Charges = () => {
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
              Patient Charges
          </Typography.Text>
        </Space>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
          <Button type="primary" style={{ width: '100%' }} onClick={()=>showModal()}><PlusOutlined /> Add Charges</Button>
          <Button color="default" variant="outlined" style={{ width: '100%' }}><FolderViewOutlined /> Preview Charges</Button>
        </div>

        <ChargesTable showModal={showModal}/>


        <Modal title="Charges" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <Form
            
            layout="vertical" 
                style={{ paddingTop: '10px'}} 
                form={form}
            >

            <Form.Item 
                label="Charges" 
                name="charges"
                rules={[{ required: true, message: 'Please enter the charges!' }]}
              >
              <Select
                style={{ width: '100%' }}
                placeholder="Select Charges"
                allowClear
                showSearch
              >
                <Select.Option value="option1">Nurse charges</Select.Option>
                <Select.Option value="option2">Nurse charges 2</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item 
                label="Quantity" 
                name="quantity"
                rules={[{ required: true, message: 'Please enter quantity!' }]}
              >
                  <Input type="number" placeholder="Enter Quantity"
             />
            </Form.Item>

            <Form.Item 
            label="Charges Remarks" 
            name="chargesRemarks"
            rules={[
              {
                  validator: (_, value) => {
                    if (value && value.length > 150) {
                      return Promise.reject(new Error('Charges Remarks cannot exceed 150 characters!'));
                    }
                    return Promise.resolve();
                  },
              }
            ]}
          >
          <TextArea placeholder="Enter charges remarks" name="chargesRemarks"
              rows={2}
          />
        </Form.Item>
            </Form>
        </Modal>

    </div>
  )
}

export default Charges