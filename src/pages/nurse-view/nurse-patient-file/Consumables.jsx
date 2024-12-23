import { Button, DatePicker, Form, Input, Modal, Select, Space, Typography } from "antd"
import { ProfileOutlined, PlusOutlined, FolderViewOutlined } from "@ant-design/icons"
import { useState } from "react";
import TextArea from "antd/es/input/TextArea";
import ConsumablesTables from "../tables/nurse-tables/ConsumablesTables";

const Consumables = () => {

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
              Patient Consumable
          </Typography.Text>
        </Space>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
          <Button type="primary" style={{ width: '100%' }} onClick={()=>showModal()}><PlusOutlined /> Add Consumables</Button>
          <Button color="default" variant="outlined" style={{ width: '100%' }}><FolderViewOutlined /> Preview Consumables</Button>
        </div>


        <ConsumablesTables showModal={showModal}/>


        <Modal title="Consumables" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <Form
            
            layout="vertical" 
                style={{ paddingTop: '10px'}} 
                form={form}
            >

            <Form.Item
            label="Date Administered"
            name="dateAdministered"
            >
              <DatePicker style={{ width: '100%'}} placeholder="Select Date Administered" />

            </Form.Item>

            <Form.Item 
                label="Item Name" 
                name="itemName"
                rules={[{ required: true, message: 'Please select an item!' }]}
              >
              <Select
                style={{ width: '100%' }}
                placeholder="Select Item"
                allowClear
                showSearch
              >
                <Select.Option value="option1">Item 1</Select.Option>
                <Select.Option value="option2">Item 2</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item 
                label="Transaction Code" 
                name="transactionCode"
                rules={[{ required: true, message: 'Please select an item!' }]}
              >
              <Select
                style={{ width: '100%' }}
                placeholder="Select Transaction Code"
                allowClear
                showSearch
              >
                <Select.Option value="option1">Code 1</Select.Option>
                <Select.Option value="option2">Code 2</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item 
                label="Store" 
                name="store"
                rules={[{ required: true, message: 'Please select store!' }]}
              >
              <Select
                style={{ width: '100%' }}
                placeholder="Select Store"
                allowClear
                showSearch
              >
                <Select.Option value="option1">Main Store</Select.Option>
                <Select.Option value="option2">Braeside Store</Select.Option>
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
            label="Consumables Remarks" 
            name="consumablesRemarks"
            rules={[
              {
                  validator: (_, value) => {
                    if (value && value.length > 150) {
                      return Promise.reject(new Error('Consumables Remarks cannot exceed 150 characters!'));
                    }
                    return Promise.resolve();
                  },
              }
            ]}
          >
          <TextArea placeholder="Enter consumables remarks" name="consumablesRemarks"
              rows={2}
          />
        </Form.Item>
            </Form>
        </Modal>

    </div>
  )
}

export default Consumables