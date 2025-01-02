import { Button, Form, Input, Modal, Space, Typography } from "antd"
import { ProfileOutlined, FolderViewOutlined } from "@ant-design/icons"
import { useState } from "react";
import AddAllergiesTable from "../tables/nurse-tables/AddAllergiesTable";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

const AddAllergies = () => {

        const [selectedRowKey, setSelectedRowKey] = useState(null);
        const [isButtonDisabled, setIsButtonDisabled] = useState(true);
        const [selectedRow, setSelectedRow] = useState([]);
        const [ form ] = Form.useForm();
        const [isModalOpen, setIsModalOpen] = useState(false);
        const dispatch = useDispatch();
        const { patientDetails } = useLocation().state;

        const handleCancel = () => {
          setIsModalOpen(false);
        };

        const handleViewAllergies = () => {
          setIsModalOpen(true);
        }

        const rowSelection = {
          selectedRowKeys: selectedRowKey ? [selectedRowKey] : [], // Controlled selection
          onChange: (selectedRowKeys, selectedRows) => {
            if (selectedRowKeys.length > 1) {
              setSelectedRowKey(selectedRowKeys[selectedRowKeys.length - 1]); // Keep the most recently selected row
              setSelectedRow([selectedRows[selectedRows.length - 1]]); // Update the selected row
            } else {
              setSelectedRowKey(selectedRowKeys[0]); // Update the selected row key
              setSelectedRow(selectedRows); // Update the selected row
            }
            setIsButtonDisabled(selectedRowKeys.length === 0); // Enable or disable buttons
          },
          getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User', // Disable specific rows if needed
          }),
      };

    
  return (
    <div>

        <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '30px', position: 'relative'}}>
          <ProfileOutlined />
          <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '14px'}}>
              Allergies and Medications
          </Typography.Text>
        </Space>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
          <Button type="primary" style={{ width: '100%' }} disabled={!selectedRowKey} onClick={handleViewAllergies}><FolderViewOutlined /> View Allergies and Medications</Button>
          <Button color="default" variant="outlined" style={{ width: '100%' }} disabled={!selectedRowKey} onClick={handleViewAllergies}><FolderViewOutlined /> Preview Allergies and Medications</Button>
        </div>

        <AddAllergiesTable rowSelection={rowSelection} />

        <Modal title="Add Allergies and Medications" 
        open={isModalOpen}
        footer={[
          <Button key="cancel" color="danger" onClick={handleCancel}>
            Cancel
          </Button>,
        ]}
        >
        <Form
            layout="vertical" 
            style={{ paddingTop: '10px'}} 
            form={form}
            autoComplete="off"
            >

            <Form.Item label="Assessed by" 
                name={['allergy', 'assessedBy']}
                rules={[{ required: true, message: 'Please input your name!' }]}
                >
                <Input type='text' 
                name='assessedBy'
                disabled
                
                />
            </Form.Item>
            <Form.Item label="Complains" 
                name={['allergy', 'complains']}
                hasFeedback
                >
                <Input type='text' 
                    name='complains'
                    
                />
            </Form.Item>  
            <Form.Item label="Food Allergy" name={['allergy', 'foodAllergy']}
                        hasFeedback
            >
            <Input type='text' 
            
            name='foodAllergy'
            />
        </Form.Item>
        <Form.Item label="Drug Allergy" name={['allergy', 'drugAllergy']}
                        hasFeedback
            >
            <Input type='text' 
            name='drugAllergy'
            />
        </Form.Item>
        </Form>
        </Modal>

    </div>
  )
}

export default AddAllergies
