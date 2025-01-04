<<<<<<< HEAD
import { Button, Form, Input, Modal, Space, Typography } from "antd"
import { ProfileOutlined, FolderViewOutlined } from "@ant-design/icons"
=======
import { Button, DatePicker, Form, Input, Modal, Select, Space, Typography } from "antd"
import { ProfileOutlined, FolderViewOutlined, PlusOutlined } from "@ant-design/icons"
>>>>>>> main
import DoctorNotesTable from "../tables/nurse-tables/DoctorNotesTable"
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
<<<<<<< HEAD
import { useDispatch, useSelector } from "react-redux";
import { getPgTreatmentDoctorNotesSlice } from "../../../actions/nurse-actions/getPgTreatmentDoctorsNotesSlice";
import { useLocation } from "react-router-dom";

const DoctorNotes = () => {

      const [selectedRowKey, setSelectedRowKey] = useState(null);
      const [isButtonDisabled, setIsButtonDisabled] = useState(true);
      const [selectedRow, setSelectedRow] = useState([]);
      const [ form ] = Form.useForm();
      const [isModalOpen, setIsModalOpen] = useState(false);
      const dispatch = useDispatch();
      const { patientDetails } = useLocation().state;

      const { loadingGetDoctorNotes, getDoctorNotes } = useSelector(
        (state) => state.getPgTreatmentDoctorNotes
      );

      const handleCancel = () => {
        setIsModalOpen(false);
      };

  const handleViewDoctorNotes = () => {
=======
import useAuth from "../../../hooks/useAuth";

const DoctorNotes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const docDetails=useAuth();
  const showModal = () => {
>>>>>>> main
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

<<<<<<< HEAD
  useEffect(() => {
    if(!getDoctorNotes?.length){
      dispatch(getPgTreatmentDoctorNotesSlice(patientDetails?.patientNo));
    }
  }, [dispatch, getDoctorNotes?.length, patientDetails?.patientNo]);
 
=======
const notesTypes=[
  {value: '1', label: 'Doctor Notes'},
  {value: '2', label: 'Medical Report'},
  {value: '3', label: 'History'},
  {value: '4', label: 'Treatment Plan'},
  {value: '5', label: 'Chief Complaints'},
  {value: '6', label: 'Past Medical History'},
  {value: '7', label: 'Past Surgical History'},
  {value: '8', label: 'Social History'},
  {value: '9', label: 'Investigations'},
  {value: '10', label: 'Assessment and plan'}

]


>>>>>>> main
  return (
    <div>
        <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '30px', position: 'relative'}}>
            <ProfileOutlined />
            <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '14px'}}>
                Doctor Notes
            </Typography.Text>
        </Space>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
          <Button type="primary" style={{ width: '100%' }} disabled={!selectedRowKey} onClick={handleViewDoctorNotes}><FolderViewOutlined /> View Doctor Notes</Button>
          <Button color="default" variant="outlined" style={{ width: '100%' }} disabled={!selectedRowKey} onClick={handleViewDoctorNotes}><FolderViewOutlined /> View Treatment Plan</Button>
        </div>

        <DoctorNotesTable 
          rowSelection={rowSelection} 
          loadingGetDoctorNotes={loadingGetDoctorNotes}
          getDoctorNotes={getDoctorNotes}
        />

        <Modal title="View Doctor Notes" 
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
                initialValues={{
                  
                }}
            >
            <Form.Item
              name={"notesDate"}
              label="Notes Date"
            >
              <Input placeholder="Date" />
              </Form.Item>
              <Form.Item
                label="Notes"
                name="notes"
              >
<<<<<<< HEAD
                <TextArea rows={4} placeholder="Notes" />
=======
                  <DatePicker style={{ width: '100%'}}
             />
            </Form.Item>
            <Form.Item 
                  label="Doctor" 
                  name="doctor"
                    >   
                    <Input placeholder="Doctor name" 
                     name="doctor"
                     value={docDetails.userData.SearchName|| `${docDetails.userData.firstName} ${docDetails.userData.lastName}`}
                     disabled
                    />
                </Form.Item>
                <Form.Item
                    label="Notes Type"
                    name="notesType"
                    rules={[{ required: true, message: 'Please select Notes Type!' }]}
                >
                    <Select
                        options={notesTypes}
                        placeholder="Select Notes Type"
                    />
                </Form.Item>
                <Form.Item 
                label="Doctor Notes" 
                name="doctorNotes"
                rules={[
                  {
                    required: true,
                    message: 'Please enter Doctor Notes!',
                  },
                  {
                      validator: (_, value) => {
                        if (value && value.length > 2000) {
                          return Promise.reject(new Error('Doctor Notes cannot exceed 150 characters!'));
                        }
                        return Promise.resolve();
                      },
                  }
                ]}
              >
              <TextArea placeholder="Enter Doctor Notes" name="Doctor Notes"
                  rows={3}
              />
>>>>>>> main
            </Form.Item>
            </Form>
        </Modal>
        
    </div>
  )
}

export default DoctorNotes