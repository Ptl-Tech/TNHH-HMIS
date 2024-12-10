import { Card, Tabs, Row, Col, Avatar, Typography, Divider, Button, message, Space } from 'antd'
import { UserOutlined, DiffOutlined } from '@ant-design/icons';
import FormVitals from './forms/triage-forms/Vitals';
import AllergyAndMedication from './forms/triage-forms/AllergyAndMedication';
import Injections from './forms/triage-forms/Injections';
import Dressing from './forms/triage-forms/Dressing';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPatientDetails } from '../../actions/triage-actions/getPatientDetailsSlice';
import useAuth from '../../hooks/useAuth';
import { postDispatchToDoctorSlice } from '../../actions/triage-actions/postDispatchToDoctorSlice';
import SkeletonLoading from '../../partials/nurse-partials/Skeleton';
import LoadingParagraphs from '../../partials/nurse-partials/LoadingParagraphs';
import { getVitalsLinesSlice } from '../../actions/triage-actions/getVitalsLinesSlice';

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

  const { loadingPatientDetails, patientDetails } = useSelector((state) => state.getPatientDetails);

  const patientName = patientDetails?.SearchName 
  || [patientDetails?.Surname, patientDetails?.FirstName, patientDetails?.MiddleName]
      .filter(Boolean) // Remove null, undefined, or empty strings
      .join(' '); // Join with a space

  const handleDispatchToDoctor = (observationNumber) => {
    dispatch(getVitalsLinesSlice(observationNumber)).then((data)=>{
      console.log('vital lines data', data);
      if(Object.keys(data).length > 0){
          dispatch(postDispatchToDoctorSlice({observationNo: observationNumber, staffNo})).then((data)=>{
            if(Object.keys(data).length > 0){
              message.success('Patient dispatched to doctor successfully');
            }else{
              message.error('An error occurred, please try again');
            }
          })
      }else{
        message.error('Please add vitals before dispatching to doctor');
      }
    });
  };


  return (
    <div style={{ margin: '16px 10px' }}>
          <Space className="inpatient-header">
          <DiffOutlined />
            <Typography.Text className="inpatient-header-text">
                Triage Observation Form
            </Typography.Text>
          </Space>
           <Row gutter={8} className='inpatient-card-container'>
  
              <Col xs={24} md={24} lg={16} xl={16}>
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
              <Col xs={24} md={24} lg={8} xl={8}>


              {
                loadingPatientDetails ? (
                  <SkeletonLoading />
                ) :(
                      <Card style={{ padding: '10px 16px', marginRight: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', gap: '12px' }}>
                        <Avatar icon={<UserOutlined />} size={48}/>
                        <div style={{ marginTop: '10px'}}>
                              <Typography.Title level={5} style={{color: 'black', fontSize: '13px'}}>{patientName}</Typography.Title>
                              <Typography.Text style={{ fontSize: '13px', color:'gray' }}>DOB: {patientDetails?.DateOfBirth}</Typography.Text>
                        </div>
                      </div>
                      <Divider />
                      <Button type="primary" onClick={()=>handleDispatchToDoctor(observationNo)} style={{width: '100%', marginBottom: '10px'}}>
                          Dispatch patient to the Doctor
                      </Button>
                  </Card>
                ) 
              }
              
                 {
                  loadingPatientDetails ? (
                    <LoadingParagraphs />
                  ) : (
                    <Card style={{ padding: '10px 16px', marginRight: '10px', marginTop: '10px' }}>
                    <Typography.Title level={5} style={{color: '#0f5689', fontSize: '14px', margin: '10px 0 10px 0'}}>
                      Additional Information
                    </Typography.Title>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                        <Typography.Title level={5} style={{ fontSize: '14px', color:'black' }}>PatientNumber</Typography.Title>
    
                          <Typography.Text style={{ fontSize: '12px', color:'gray', fontWeight: 'bold'}}>{patientDetails?.PatientNo}</Typography.Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', }}>
                        
                          <Typography.Title level={5} style={{ fontSize: '14px', color:'black',}}>Observation No</Typography.Title>
                          <Typography.Text style={{ fontSize: '12px', color:'gray', fontWeight: 'bold'}}>{observationNo}</Typography.Text>
                    
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    
                      
                          <Typography.Title level={5} style={{ fontSize: '14px', color:'black' }}>Age</Typography.Title>
                          <Typography.Text style={{ fontSize: '12px', color:'gray', fontWeight: 'bold'}}>{`${patientDetails?.AgeinYears} Years`}
                          </Typography.Text>
                        
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between'}}>
                          <Typography.Title level={5} style={{ fontSize: '14px', color:'black' }}>Gender</Typography.Title>
                          <Typography.Text style={{ fontSize: '12px', color:'gray', fontWeight: 'bold'}}>{patientDetails?.Gender}</Typography.Text>
                      
                    </div>
                  </Card>
                  )
                 }
                    
              </Col>
           </Row>
    </div>
  )
}

export default EvaluatePatientInTriage


