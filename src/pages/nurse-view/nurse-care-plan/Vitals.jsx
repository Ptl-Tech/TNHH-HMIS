import { Button, Col, Form, Input, Modal, Row } from "antd";
import { useState } from "react";
import { FolderViewOutlined, FolderAddOutlined } from "@ant-design/icons";
import VitalsTable from "../tables/triage-tables/VitalsTable";
import { useLocation } from "react-router-dom";
import useFetchVitalsHook from "../../../hooks/useFetchVitalsHook";
import useSetTableCheckBoxHook from "../../../hooks/useSetTableCheckBoxHook";
import VitalsFormData from "../forms/nurse-forms/VitalsFormData"
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader";

const Vitals = () => {

        const [ form ] = Form.useForm();
        const [isModalOpen, setIsModalOpen] = useState(false);
        const { selectedRowKey, rowSelection, selectedRow } = useSetTableCheckBoxHook();
        const { patientDetails } = useLocation().state;
        const [isVitalFormVisible, setIsVitalFormVisible] = useState(false);

        const { combinedList, loadingInpatientVitals, loadingTriageList } = useFetchVitalsHook();

        const filterVitals = combinedList?.filter(vitals => vitals.PatientNo === patientDetails?.PatientNo);
   

        const handleCancel = () => {
          setIsModalOpen(false);
        };

        const handleViewVitals = () => {
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
              bmi: selectedRow[0]?.BMI ? selectedRow[0]?.BMI.toFixed(2) : ''
            })
            setIsModalOpen(true);
          }
        }

        const handleVitalsButtonVisibility = () => {
          setIsVitalFormVisible(!isVitalFormVisible);
        }

  return (
    <div>
      <NurseInnerHeader title="Vitals"/>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
        <Button type="primary" style={{ width: '100%' }}  onClick={handleVitalsButtonVisibility}><FolderAddOutlined />
           Add Vitals
          </Button>
          <Button type="primary" style={{ width: '100%' }} disabled={!selectedRowKey} onClick={handleViewVitals}><FolderViewOutlined />
           View Vitals
          </Button>
          <Button color="default" variant="outlined" style={{ width: '100%' }} disabled={!selectedRowKey} onClick={handleViewVitals}><FolderViewOutlined /> Preview Pain Assessment Tool</Button>
        </div>

        {
          isVitalFormVisible && (
            
              <VitalsFormData observationNumber={patientDetails?.CurrentAdmNo} patientNumber={patientDetails?.PatientNo } setIsVitalFormVisible={setIsVitalFormVisible}/>
           
          )
        }


        {
          !isVitalFormVisible && (
            <VitalsTable  rowSelection={rowSelection} filterVitals={filterVitals} loadingInpatientVitals={loadingInpatientVitals} loadingTriageList={loadingTriageList}/>
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
                    
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Blood Pressure (mmHg)" 
                  name='bloodPreasure'
                  >
                  <Input type='text' 
                     
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
                      
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="SPO2 (%)" 
                  name='sP02'
                >
                  <Input type='text' 
              
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Height (cm)" 
                name='height'
              
                >
                  <Input type='number' 
                    
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Weight (kg)" 
                name='weight'
                >
                  <Input type='number' 
                
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
                  
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
              <Form.Item label="BMI" 
                name='bmi'
              >
                <Input type='text' 

                />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>

    </div>
  )
}

export default Vitals

        
        