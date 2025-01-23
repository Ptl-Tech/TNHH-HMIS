import { Button, Col, DatePicker, Form, Input, Modal, Row } from "antd";
import { useState } from "react";
import { FolderViewOutlined, FolderAddOutlined, FileMarkdownOutlined } from "@ant-design/icons";
import VitalsTable from "../tables/triage-tables/VitalsTable";
import { useLocation } from "react-router-dom";
import useFetchVitalsHook from "../../../hooks/useFetchVitalsHook";
import useSetTableCheckBoxHook from "../../../hooks/useSetTableCheckBoxHook";
import VitalsFormData from "../forms/nurse-forms/VitalsFormData"
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader";
import dayjs from "dayjs";

const Vitals = () => {

        const [ form ] = Form.useForm();
        const [isModalOpen, setIsModalOpen] = useState(false);
        const { selectedRowKey, rowSelection, selectedRow } = useSetTableCheckBoxHook();
        const { patientDetails } = useLocation().state;
        const [isVitalFormVisible, setIsVitalFormVisible] = useState(false)
        const queryParams = new URLSearchParams(location.search);
        const AdmNo = queryParams.get("AdmNo");
        const PatientNo = queryParams.get("PatientNo")

        
        const { loadingInpatientVitals, inpatientVitals } = useFetchVitalsHook();
        const filterInpatientVitals = inpatientVitals?.filter((vitals) => 
         
          vitals.PatientNo === patientDetails?.Patient_No
        
      );

        const handleCancel = () => {
          setIsModalOpen(false);
        };

        const handleViewVitals = () => {
          const date = selectedRow[0]?.DateTaken;
          const convertedDate = dayjs(date)
          if(selectedRow[0]){
            form.resetFields();
            form.setFieldsValue({
              pulseRate: selectedRow[0]?.PulseRate,
              bloodPreasure: selectedRow[0]?.BloodPressure,
              temperature: selectedRow[0]?.Temperature,
              sP02: selectedRow[0]?.SP02,
              respirationRate: selectedRow[0]?.RespirationRate,
              height: selectedRow[0]?.Height,
              weight: selectedRow[0]?.Weight,
              bmi: selectedRow[0]?.BMI ? selectedRow[0]?.BMI.toFixed(2) : '',
              date: convertedDate
            })
            setIsModalOpen(true);
          }
        }

        const handleVitalsButtonVisibility = () => {
          setIsVitalFormVisible(!isVitalFormVisible);
        }

  return (
    <div>
      <NurseInnerHeader icon={<FileMarkdownOutlined />} title="Inpatient Vitals"/>

        {
          !isVitalFormVisible && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingBottom: '20px',  marginTop: '20px'}}>
            <Button type="primary" onClick={handleVitalsButtonVisibility}><FolderAddOutlined />
              Add Vitals
              </Button>
              <Button type="primary" disabled={!selectedRowKey} onClick={handleViewVitals}><FolderViewOutlined />
              View Vitals
              </Button>
            </div>
          )
        }

        {
          isVitalFormVisible && (
            
              <VitalsFormData observationNumber={patientDetails?.Admission_No} patientNumber={patientDetails?.Patient_No } setIsVitalFormVisible={setIsVitalFormVisible} admissionNumber={AdmNo} number={PatientNo}/>
           
          )
        }


        {
          !isVitalFormVisible && (
            <VitalsTable  rowSelection={rowSelection} filterVitals={filterInpatientVitals} loadingInpatientVitals={loadingInpatientVitals} />
          )
        }


        <Modal title="View Vitals" open={isModalOpen}
         footer={[
          <Button key="cancel" color="danger" onClick={handleCancel}>
            Cancel
          </Button>,
        ]}
        >

          <Form
          layout="vertical"
          form={form}
          autoComplete="off"
          initialValues={
            {
              pulseRate: '',
              bloodPreasure: '',
              temperature: '',
              sP02: '',
              respirationRate: '',
              height: '',
              weight: '',
              bmi: ''
            }
          }
          >

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Pulse Rate (bpm)"
                  name='pulseRate'
                >
                  <Input type='text'
                  disabled
                    
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Blood Pressure (mmHg)" 
                  name='bloodPreasure'
                  >
                  <Input type='text'
                  disabled 
                     
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Temperature (&deg;C)" 
                name='temperature'

                >
                  <Input type='number' 
                  disabled
                      
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="SPO2 (%)" 
                  name='sP02'
                >
                  <Input type='text' 
                  disabled
              
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Respiration Rate (bpm)" 
                  name='respirationRate'
                  
                >
                  <Input type='text' 
                   disabled
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
              <Form.Item label="Date" name='date'>
                <DatePicker format="DD-MM-YYYY" style={{ width: '100%' }} disabled />
              </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>

    </div>
  )
}

export default Vitals

        
        