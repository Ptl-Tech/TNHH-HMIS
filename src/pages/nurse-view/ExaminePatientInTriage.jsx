import { Card, Tabs, Row, Col, Avatar, Typography, Button, Space } from 'antd'
import { UserOutlined, DiffOutlined } from '@ant-design/icons';
import FormVitals from './forms/triage-forms/Vitals';
import AllergyAndMedication from './forms/triage-forms/AllergyAndMedication';
import Injections from './forms/triage-forms/Injections';
import Dressing from './forms/triage-forms/Dressing';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPatientDetails } from '../../actions/triage-actions/getPatientDetailsSlice';
import useAuth from '../../hooks/useAuth';
import SkeletonLoading from '../../partials/nurse-partials/Skeleton';
import TriageDispatchToDoctorFormData from './nurse-forms/TriageDispatchToDoctorFormData';
import Loading from '../../partials/nurse-partials/Loading';
import { calculateAge } from '../../utils/helpers';

const EvaluatePatientInTriage = () => {

  const location = useLocation();
  const dispatch = useDispatch();
  
  // Parse the query parameters using URLSearchParams
  const queryParams = new URLSearchParams(location.search);
  const patientNo = queryParams.get('Patient_id');
  const observationNo = queryParams.get('Ob_number');
  const userDetails = useAuth();
  const staffNo = userDetails?.userData?.firstName

  const [isDispatchFormVisible, setIsDispatchFormVisible] = useState(false);  

  useEffect(()=>{
      dispatch(getPatientDetails(patientNo))
  }, [dispatch, patientNo])

  const { loadingPatientDetails, patientDetails } = useSelector((state) => state.getPatientDetails);
  console.log('patient details', patientDetails)

  const patientName = patientDetails?.SearchName 
  || [patientDetails?.Surname, patientDetails?.FirstName, patientDetails?.MiddleName]
      .filter(Boolean) // Remove null, undefined, or empty strings
      .join(' '); // Join with a space

  const handleVitalsButtonVisibility = () => {
    setIsDispatchFormVisible(!isDispatchFormVisible);
  }

  const infoRows = [
    { label: 'Patient Number', value: patientDetails?.PatientNo },
    { label: 'Observation No', value: observationNo },
  ];


  return (
    <div style={{ margin: '16px 10px' }}>
          <Space className="inpatient-header">
          <DiffOutlined />
            <Typography.Text className="inpatient-header-text">
                Triage Observation Form
            </Typography.Text>
          </Space>
          <Row>
            {
              loadingPatientDetails ? (
                <SkeletonLoading />
              ):(
                <Col xs={24} md={24} lg={12} xl={12}>
              <Card style={{ padding: '10px 16px', marginRight: '10px', borderTop: '3px solid #0f5689' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', gap: '12px' }}>
                  <Avatar icon={<UserOutlined />} size={48}/>
                  <div style={{ marginTop: '10px'}}>
                        <Typography.Title level={5} style={{color: 'black', fontSize: '13px'}}>{patientName}</Typography.Title>
                        <Typography.Text style={{ fontSize: '13px', color:'gray' }}>DOB: {patientDetails?.DateOfBirth}</Typography.Text>
                  </div>
                  </div> 
                  <div>
                      <Typography.Title level={5} style={{color: '#0f5689', fontSize: '14px', margin: '10px 0 10px 0'}}>
                        Age and Gender: {patientDetails?.Gender}, {calculateAge(patientDetails?.DateOfBirth)}
                      </Typography.Title>

                  </div>
                                   
                  </Card>  
              </Col>
              )
            }
          {
            loadingPatientDetails ? (
                <Loading />
            ):(
              <Col xs={24} md={24} lg={12} xl={12}>
              <Card style={{ padding: '10px 16px', marginRight: '10px', borderTop: '3px solid #0f5689' }}>
                <Typography.Title level={5} style={{color: '#0f5689', fontSize: '14px', margin: '10px 0 10px 0'}}>
                Additional Information
                </Typography.Title>
                    {infoRows.map((row, index) => (
                    <div 
                    key={index} 
                    style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}
                    >
                    <Typography.Title 
                    level={5} 
                    style={{ fontSize: '14px', color: 'black' }}
                    >
                    {row.label}
                    </Typography.Title>
                    <Typography.Text 
                    style={{ fontSize: '12px', color: 'gray', fontWeight: 'bold' }}
                    >
                    {row.value}
                    </Typography.Text>
                    </div>
                    ))}
                </Card> 
              </Col>
            )
          }
          </Row>
          <Card style={{ padding: '10px 16px', marginTop: '10px', marginBottom: '10px' }}>
              
             
                <Button type="primary" onClick={handleVitalsButtonVisibility} style={{ width: '50%', marginBottom: '10px'}}>
                          Dispatch patient to the Doctor
                </Button>

              {
                isDispatchFormVisible && (
                  <TriageDispatchToDoctorFormData staffNo={staffNo} observationNo={observationNo} setIsDispatchFormVisible={setIsDispatchFormVisible}/>
                )
              }

          </Card>
            {
            !isDispatchFormVisible && (
              <Row gutter={8} className='inpatient-card-container'>
              <Col xs={24} md={24} lg={24} xl={24}>
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
              </Row>
            )
           }
    </div>
  )
}

export default EvaluatePatientInTriage


