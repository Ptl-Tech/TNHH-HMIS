import { Card, Tabs, Row, Col, Avatar, Typography, Divider, Space, Button } from 'antd'
import { UserOutlined, AlignCenterOutlined, BlockOutlined, BorderlessTableOutlined, GoldOutlined, RightOutlined } from '@ant-design/icons';
import FormVitals from './forms/triage-forms/Vitals';
import AllergyAndMedication from './forms/triage-forms/AllergyAndMedication';
import Injections from './forms/triage-forms/Injections';
import Dressing from './forms/triage-forms/Dressing';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPatientDetails } from '../../actions/triage-actions/getPatientDetailsSlice';
import useAuth from '../../hooks/useAuth';


const EvaluatePatientInTriage = () => {


  const location = useLocation();
  const dispatch = useDispatch();
  
  // Parse the query parameters using URLSearchParams
  const queryParams = new URLSearchParams(location.search);
  const patientNo = queryParams.get('Patient_id');
  const observationNo = queryParams.get('Ob_number');
  const userDetails = useAuth();
  const staffNo = userDetails?.userData?.firstName

  useEffect(()=>{
      dispatch(getPatientDetails(patientNo))
  }, [dispatch, patientNo])

  const { patientDetails } = useSelector((state) => state.getPatientDetails);

  const patientName = patientDetails?.SearchName || `${patientDetails?.Surname} ${patientDetails?.FirstName} ${patientDetails?.MiddleName}`;

  const handleDispatchToDoctor = () => {
    console.log("Dispatching to Doctor");
  };


  return (
    <div style={{ margin: '16px 10px' }}>
           <Row gutter={8}>
  
              <Col span={16}>
              <Card style={{ padding: '10px 16px' }}>
                    <Tabs>
                      <Tabs.TabPane tab="Vitals" key="1">

                            <FormVitals observationNumber={observationNo} patientNumber={patientNo} />
                      </Tabs.TabPane>
                      <Tabs.TabPane tab="Allergies and Medication" key="2">
                          <AllergyAndMedication observationNumber={observationNo} patientNumber={patientNo} staffNo={staffNo} />
                      </Tabs.TabPane>
                      <Tabs.TabPane tab="Injections" key="3">
                          <Injections observationNumber={observationNo} staffNo={staffNo}/>
                      </Tabs.TabPane>
                      <Tabs.TabPane tab="Dressings" key="4">
                          <Dressing observationNumber={observationNo}  staffNo={staffNo}/>
                      </Tabs.TabPane>
                    </Tabs>
                </Card>
              </Col>
              <Col span={8}>
                  <Card style={{ padding: '10px 16px', marginRight: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Avatar icon={<UserOutlined />} size={64}/>
                    <div style={{ marginTop: '10px', textAlign: 'center' }}>
                          <Typography.Title level={5} style={{color: 'black'}}>{patientName}</Typography.Title>
                          <Typography.Text style={{ fontSize: '14px', color:'gray' }}>DOB: {patientDetails?.DateOfBirth}</Typography.Text>
                    </div>
                  </div>
                  <Divider />
                  <Space style={{ display: 'flex', alignItems: 'baseline' }}>
                      <AlignCenterOutlined />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography.Title level={5} style={{ fontSize: '14px', color:'black', fontWeight: 'bold' }}>PatientNumber</Typography.Title>
                        <Typography.Text style={{ fontSize: '12px', color:'gray', fontWeight: 'bold'}}>{patientDetails?.PatientNo}</Typography.Text>
                      </div>
                  </Space>
                  <Space style={{ display: 'flex', alignItems: 'baseline', marginTop: '10px' }}>
                      <BlockOutlined />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography.Title level={5} style={{ fontSize: '14px', color:'black', fontWeight: 'bold' }}>Observation No</Typography.Title>
                        <Typography.Text style={{ fontSize: '12px', color:'gray', fontWeight: 'bold'}}>{observationNo}</Typography.Text>
                      </div>
                  </Space>
                  <Space style={{ display: 'flex', alignItems: 'baseline', marginTop: '10px', marginBottom: '10px' }}>
                    <BorderlessTableOutlined />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography.Title level={5} style={{ fontSize: '14px', color:'black', fontWeight: 'bold' }}>Age</Typography.Title>
                        <Typography.Text style={{ fontSize: '12px', color:'gray', fontWeight: 'bold'}}>{`${patientDetails?.AgeinYears} Years`}
                        </Typography.Text>
                      </div>
                  </Space>
                  <Space style={{ display: 'flex', alignItems: 'baseline', marginTop: '10px', marginBottom: '10px' }}>
                    <GoldOutlined />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography.Title level={5} style={{ fontSize: '14px', color:'black', fontWeight: 'bold' }}>Gender</Typography.Title>
                        <Typography.Text style={{ fontSize: '12px', color:'gray', fontWeight: 'bold'}}>{patientDetails?.Gender}</Typography.Text>
                      </div>
                  </Space>
                  <Divider />
                  <Button type="primary" onClick={()=>handleDispatchToDoctor(observationNo)} style={{width: '100%', marginBottom: '10px'}}>
                    
                    Dispatch to Doctor
                    <RightOutlined />
                  </Button>
                  </Card>
              </Col>
           </Row>
    </div>
  )
}

export default EvaluatePatientInTriage


