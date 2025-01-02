import { Button, Form, Input, Modal, Space, Typography } from "antd"
import { ProfileOutlined, FolderViewOutlined } from "@ant-design/icons"
import DoctorNotesTable from "../tables/nurse-tables/DoctorNotesTable"
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
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

  useEffect(() => {
    if(!getDoctorNotes?.length){
      dispatch(getPgTreatmentDoctorNotesSlice(patientDetails?.patientNo));
    }
  }, [dispatch, getDoctorNotes?.length, patientDetails?.patientNo]);
 
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
                <TextArea rows={4} placeholder="Notes" />
            </Form.Item>
            </Form>
        </Modal>
        
    </div>
  )
}

export default DoctorNotes