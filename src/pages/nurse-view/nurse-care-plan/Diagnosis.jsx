import { Button, Col, Form, Input, Modal, Row, Select, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import { FolderViewOutlined, ProfileOutlined } from "@ant-design/icons";
import DoctorPrescriptionsTable from "../tables/nurse-tables/DoctordiagnosisTable";
import useSetTableCheckBoxHook from "../../../hooks/useSetTableCheckBoxHook";
import { useDispatch, useSelector } from "react-redux";
import { getQyTreatmentDiagnosisLinesSlice } from "../../../actions/nurse-actions/getQyTreatmentDiagnosisLinesSlice";
import { useLocation } from "react-router-dom";
import { listDoctors } from "../../../actions/DropdownListActions";

const Diagnosis = () => {
        const [isModalOpen, setIsModalOpen] = useState(false);
        const { selectedRowKey, rowSelection, selectedRow } = useSetTableCheckBoxHook();
        const [ form ] = Form.useForm();
        const dispatch = useDispatch();
        const { patientDetails } = useLocation().state;

        const {loadingGetDoctorDiagnosis, getDiagnosis} = useSelector((state) => state.getQyTreatmentDiagnosisLines);
        const { loading, data } = useSelector(state => state.getDoctorsList);

        const formattedDoctorDetails = data.map(doctor => {
          return {
              DoctorID: doctor.DoctorID,
              DoctorsName: doctor.DoctorsName,
          }
        });

        const formattedList = getDiagnosis.map(diagnosis => {
          const matchDoctorName = formattedDoctorDetails.find(doctor => doctor.DoctorID === diagnosis.Doctor);
          return {
              ...diagnosis,
              DoctorName: matchDoctorName?.DoctorsName
          }
          
      });

      const filterFormattedList = formattedList.filter(item => item?.PatientNoF === patientDetails?.PatientNo);

          const showModal = () => {
            setIsModalOpen(true);
          };

          const handleCancel = () => {
            setIsModalOpen(false);
          };
  
          const handleViewPrescriptions = () => {
            console.log(selectedRow[0]);
            if(selectedRow[0]){
              form.resetFields();
              form.setFieldsValue({
                code: selectedRow[0]?.DiagnosisCode,
                date: selectedRow[0]?.DiagnosisDate,
                name: selectedRow[0]?.DiagnosisName,
                remarks: selectedRow[0]?.Remarks
              })
              setIsModalOpen(true);
            }
          }

          useEffect(() => {
            if(!getDiagnosis?.length){
              dispatch(getQyTreatmentDiagnosisLinesSlice());
            }
          }, [dispatch, getDiagnosis?.length]);

           useEffect(() => {
                  if(!data.length) {
                      dispatch(listDoctors());
                  }
              }, [dispatch, data.length]);
  return (
    <div>
      <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '30px', position: 'relative'}}>
          <ProfileOutlined />
          <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '14px'}}>
              Patient Diagnosis
          </Typography.Text>
        </Space>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
          <Button type="primary" style={{ width: '100%' }}  onClick={handleViewPrescriptions}><FolderViewOutlined /> View Admission Diagnosis</Button>
          <Button color="default" variant="outlined" style={{ width: '100%' }} disabled={!selectedRowKey} onClick={handleViewPrescriptions}><FolderViewOutlined /> Submit Final Diagnosis</Button>
        </div>
        
        <DoctorPrescriptionsTable showModal={showModal} rowSelection={rowSelection} filterFormattedList={filterFormattedList} loading={loading} loadingGetDoctorDiagnosis={loadingGetDoctorDiagnosis}/>



        <Modal title="Prescriptions" 
         open={isModalOpen}
         footer={[
          <Button key="cancel" color="danger" onClick={handleCancel}>
            Cancel
          </Button>
        ]}
         >
        <Form
            layout="vertical" 
            style={{ paddingTop: '10px'}} 
            form={form}
            initialValues={
              {
                code: '',
                date: '',
                name: '',
                remarks: ''
              }
            }
            >

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item label="Diagnosis Code" 
                    name="code"
                    >
                    <Input type="text"/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                <Form.Item label="Diagnosis Date"
                name="date"
                >
                  <Input  type="text" />
                </Form.Item>
              </Col>
            </Row>
          
            <Row gutter={16}>
              <Col span={24}>
              <Form.Item label="Diagnosis Name" name="name"
              
              >
                <Input.TextArea type='text' 
                />
              </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
              <Form.Item label="Remarks" name="remarks"
             
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

export default Diagnosis