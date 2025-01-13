import { Card, Col, Row, Typography } from "antd"
import { useLocation } from "react-router-dom";
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader";

const PatientInfo = () => {

  const { patientDetails } = useLocation().state;


  const patientPrimaryInfo = [
    {
        title: 'Patient Name',
        description: patientDetails?.SearchName || 'N/A',
    },
    {
        title: 'Patient ID',
        description: patientDetails?.PatientNo || 'N/A',
    },
    {
        title: 'Admission Number',
        description: patientDetails?.CurrentAdmNo || 'N/A',
    },
    {
        title: 'Date of Admission',
        description: patientDetails?.AdmissionsDate || 'N/A',
    },
    {
        title: 'Identification Number',
        description: patientDetails?.IDNumber || 'N/A',
    },
    {
        title: 'Gender',
        description: patientDetails?.Gender || 'N/A',
    },
    {
        title: 'Marital Status',
        description: patientDetails?.MaritalStatus || 'N/A',
    },
    {
        title: 'Nationality',
        description: patientDetails?.Nationality || 'N/A',
    },
]

const patientSecondaryInfo = [
    {
        title: 'Date of Birth',
        description: patientDetails?.DateOfBirth || 'N/A',
    },
    {
        title: 'Address 1',
        description: patientDetails?.CorrespondenceAddress1 || 'N/A',
    },
    {
        title: 'Address 2',
        description: patientDetails?.CorrespondenceAddress2 || 'N/A',
    },
    {
        title: 'County Ward',
        description: patientDetails?.CountyWard || 'N/A',
    },
    {
        title: 'Sub County',
        description: patientDetails?.SubCountyName || 'N/A',
    },
    
    {
        title: 'Home Telephone',
        description: patientDetails?.TelephoneNo2 || 'N/A',
    },
    {
        title: 'Mobile Phone',
        description: patientDetails?.TelephoneNo1 || 'N/A',
    }
]
  return (
    <div>
        
        <NurseInnerHeader title="Patient Information" />

        <Row gutter={16} style={{ marginTop: '20px' }}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Card style={{ padding: '10px 16px', borderTop: '3px solid #0f5689' }}>
                    {patientPrimaryInfo.map((info, index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                            <Typography.Text strong style={{ paddingTop: '5px'}}>{info.title}</Typography.Text>
                            <Typography.Text>{info.description}</Typography.Text>
                        </div>
                    ))}
                </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Card style={{ padding: '10px 16px', borderTop: '3px solid #0f5689' }}>
                    {patientSecondaryInfo.map((info, index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                            <Typography.Text strong style={{ paddingTop: '5px'}}>{info.title}</Typography.Text>
                            <Typography.Text>{info.description}</Typography.Text>
                        </div>
                    ))}
                </Card>
            </Col>
        </Row>
    </div>
  )
}

export default PatientInfo
