import { Button, DatePicker, Form, Input, Modal } from 'antd'
import { PlusOutlined, UserAddOutlined, FolderViewOutlined } from "@ant-design/icons"
import { useState } from 'react';
import TextArea from 'antd/es/input/TextArea';
import SickOffTable from '../tables/nurse-tables/SickOffTable';
import NurseInnerHeader from '../../../partials/nurse-partials/NurseInnerHeader';
import useAuth from '../../../hooks/useAuth';

const SickOff = () => {

    const [selectedRowKey, setSelectedRowKey] = useState(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [selectedRow, setSelectedRow] = useState([]); 
    const role = useAuth().userData.departmentName 

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

    const handleOnClick = () => {
        const record = selectedRow[0]
        console.log(record)
    }


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
        <NurseInnerHeader icon={<UserAddOutlined/>} title="Sick Off" />

        {
          role === 'Doctor' ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
            <Button type="primary" style={{ width: '100%' }} onClick={()=>showModal()}><PlusOutlined /> Add Sick Off
            </Button>
            <Button color="default" variant="outlined" style={{ width: '100%' }} disabled={!selectedRowKey} onClick={()=>handleOnClick()}><FolderViewOutlined />
            Print Sick Off
            </Button>
            </div>
          ) : (
            null
          )
        }


        <SickOffTable rowSelection={rowSelection} />

        <Modal title="Sick Off" 
          open={isModalOpen} 
          onOk={handleOk} 
          onCancel={handleCancel}
          okText="Save Sick Off"
        >
            <Form
            
            layout="vertical" 
                style={{ paddingTop: '10px'}} 
                form={form}
            >
          
            <Form.Item 
                label="Off Duty Days" 
                name="offDays"
                hasFeedback
                >
                <Input placeholder="Off Duty Days"
                    type='number'
                />
            </Form.Item>

            <Form.Item 
                label="Light Duty Days" 
                name="lightOffDays"
                hasFeedback
                >
                <Input placeholder="Light Duty Days"
                    type='number'
                />
            </Form.Item>

            <Form.Item 
                label="Sick off Start Day" 
                name="sickOffStartDay"
                hasFeedback
                >
                <DatePicker placeholder="Sick off Start Day"
                    style={{ width: '100%' }}
                />
            </Form.Item>

            <Form.Item 
                label="Sick off End Day" 
                name="sickOffEndDay"
                hasFeedback
                >
                <DatePicker placeholder="Sick off End Day"
                    disabled
                    style={{ width: '100%' }}
                />
            </Form.Item>

            <Form.Item 
                label="Next Appointment Date" 
                name="nextAppointmentDate"
                hasFeedback
                >
                <DatePicker placeholder="Next Appointment Date"
                    disabled
                    style={{ width: '100%' }}
                />
            </Form.Item>


            <Form.Item 
                label="Remarks" 
                name="remarks"
                rules={[
                {
                    validator: (_, value) => {
                        if (value && value.length > 200) {
                        return Promise.reject(new Error('Remarks cannot exceed 200 characters!'));
                        }
                        return Promise.resolve();
                    },
                }
                ]}
                >
                <TextArea placeholder="Enter remarks"
                    rows={2}
                />
            </Form.Item>

            </Form>
        </Modal>

    </div>
  )
}

export default SickOff