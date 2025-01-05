
import { Button, Col, DatePicker, Form, Input, Modal, Row, Space, Typography } from "antd"
import { ProfileOutlined, FolderViewOutlined } from "@ant-design/icons"

import DoctorNotesTable from "../tables/nurse-tables/DoctorNotesTable"
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";

import { useDispatch, useSelector } from "react-redux";
import { getPgTreatmentDoctorNotesSlice } from "../../../actions/nurse-actions/getPgTreatmentDoctorsNotesSlice";
import { useLocation } from "react-router-dom";
import useSetTableCheckBoxHook from "../../../hooks/useSetTableCheckBoxHook";

const DoctorNotes = () => {

      const { selectedRowKey, rowSelection, selectedRow } = useSetTableCheckBoxHook();
      const [ form ] = Form.useForm();
      const [isModalOpen, setIsModalOpen] = useState(false);
      const dispatch = useDispatch();
      const { patientDetails } = useLocation().state;

      const { loadingGetDoctorNotes, getDoctorNotes } = useSelector(
        (state) => state.getPgTreatmentDoctorNotes
      );

      const filterGetDoctorsNotes = getDoctorNotes?.filter((item) => item.PatientNo === patientDetails?.PatientNo);

      const handleCancel = () => {
        setIsModalOpen(false);
      };

  const handleViewDoctorNotes = () => {
    if(selectedRow[0]){
      form.resetFields();
      form.setFieldsValue({
        number: selectedRow[0]?.PatientNo,
        type: selectedRow[0]?.Notes_Type,
        date: selectedRow[0]?.Treatment_Date,
        clinic: selectedRow[0]?.Clinic,
        notes: selectedRow[0]?.NotesTxt
      })
      setIsModalOpen(true);
    }
  }

  useEffect(() => {
    if(!getDoctorNotes?.length){
      dispatch(getPgTreatmentDoctorNotesSlice());
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
          getDoctorNotes={filterGetDoctorsNotes}
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
            initialValues={
              {
                number: '',
                type: '',
                date: '',
                clinic: '',
                notes: ''
              }
            }
            >

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item label="Patient No" 
                    name="number"
                    >
                    <Input type="text"/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                <Form.Item label="Notes Type"
                name="type"
                >
                  <Input  type="text" />
                </Form.Item>
              </Col>
            </Row>
          
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item label="Notes Date" 
                    name="date"
                    >
                    <Input type="text"/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                <Form.Item label="Clinic"
                name="clinic"
                >
                  <Input  type="text" />
                </Form.Item>
              </Col>
            </Row>
            

            <Row gutter={16}>
              <Col span={24}>
              <Form.Item label="Notes" name="notes"
             
              >
                <Input.TextArea type='text'
                />
              </Form.Item>
              </Col>
            </Row>

        </Form>
        </Modal>
        
    </div>
  )
}

export default DoctorNotes