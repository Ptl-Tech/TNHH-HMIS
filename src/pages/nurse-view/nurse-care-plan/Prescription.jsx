import { Button, Form } from "antd"
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader"
import { FolderViewOutlined } from "@ant-design/icons"
import { useState } from "react";
import useSetTableCheckBoxHook from "../../../hooks/useSetTableCheckBoxHook";
import { useSelector } from "react-redux";

const Prescription = () => {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const { selectedRowKey, rowSelection, selectedRow } = useSetTableCheckBoxHook();
   const {form} = Form.useForm();

  const handleViewVisitor = () => {
    if(selectedRow[0]) {
      form.resetFields();
      form.setFieldsValue({
        visitorName: selectedRow[0]?.VisitorName || '',
        idNumber: selectedRow[0]?.IdNumber || '',
        phoneNumber: selectedRow[0]?.PhoneNumber || '',
      })
      setIsModalOpen(true);
    };
  }
  return (
   <>
    <NurseInnerHeader title="View Doctor Prescription" />

    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px',  marginTop: '20px'}}> 
      <Button type="primary" style={{ width: '100%' }} disabled={!selectedRowKey} onClick={handleViewVisitor}><FolderViewOutlined />
      View Prescription Details
      </Button>
      <Button color="default" variant="outlined" style={{ width: '100%' }}><FolderViewOutlined />
      Preview Prescription 
      </Button>
    </div>
   </>
  )
}

export default Prescription