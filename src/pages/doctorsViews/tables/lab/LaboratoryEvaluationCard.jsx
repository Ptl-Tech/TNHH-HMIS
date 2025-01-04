import { Row, Space, Typography, Col } from 'antd'
import { UserOutlined, DiffOutlined } from "@ant-design/icons";

import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPatientDetails } from '../../../../actions/triage-actions/getPatientDetailsSlice';
import SkeletonLoading from '../../../../partials/nurse-partials/Skeleton';
import PatientCardInfo from './patientCardInfo';
import LabContentCard from './LabContentCard';

const LaboratoryEvaluationCard = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const { state } = useLocation(); // Access the state passed via navigate
    const { patientNo, labObservationNo,patientLabRecord  } = state || {}; // Destructure patient data if available

    const { loadingPatientDetails, patientDetails } = useSelector(
        (state) => state.getPatientDetails
      );

      useEffect(() => {
        dispatch(getPatientDetails(patientNo));
      }, [dispatch, patientNo]);

      
  const patientName =
  patientDetails?.SearchName ||
  [
    patientDetails?.Surname,
    patientDetails?.FirstName,
    patientDetails?.MiddleName,
  ]
    .filter(Boolean) // Remove null, undefined, or empty strings
    .join(" "); // Join with a space

    
  return (
    <div style={{ margin: "16px 10px" }}>
        <Space className='inpatient-header'>
            <DiffOutlined />
            <Typography.Text className='inpatient-header-text'>
                Laboratory Evaluation Form
            </Typography.Text>
        </Space>
        <Row gutter={8} className='inpatient-card-container'>
            <Col xs={24} md={24} lg={24} xl={24} className='inpatient-card-left-col'>
            {
                loadingPatientDetails ? (
                    <SkeletonLoading />
                ) : (
                    <PatientCardInfo patientNo={patientNo} labObservationNo={labObservationNo} patientLabRecord={patientLabRecord}/>
                )
            }
            </Col>
            <Col xs={24} md={24} lg={24} xl={24} className='inpatient-card-right-col'>
            {
                loadingPatientDetails ? (
                    <SkeletonLoading />
                ) : (
<LabContentCard patientNo={patientNo} labObservationNo={labObservationNo} patientLabRecord={patientLabRecord} />                )
            }
            </Col>
        </Row>                

    </div>
  )
}

export default LaboratoryEvaluationCard