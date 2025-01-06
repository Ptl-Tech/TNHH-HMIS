import { Col, List, Row, Space, Typography } from "antd"
import { ProfileOutlined } from "@ant-design/icons"
import { useLocation } from "react-router-dom";

const PatientInfo = () => {

  const { patientDetails } = useLocation().state;


  const data = [
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
        <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '30px', position: 'relative'}}>
            <ProfileOutlined />
            <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '14px'}}>
                Patient Information
            </Typography.Text>
          </Space>
        <List 
            itemLayout="horizontal"
            dataSource={data}
            renderItem={item => (
                <Row 
                    key={item.id} 
                    gutter={8} 
                    align="middle" 
                    style={{
                        marginBottom: '10px',
                        borderBottom: '1px solid #e8e8e8', // Adds a subtle bottom border
                        paddingBottom: '10px' // Adds space between the content and border
                    }}
                >
                    <Col xs={24} sm={12}>
                        <Typography.Text style={{ fontSize: '14px', fontWeight: 'bold' }}>
                            {item.title}
                        </Typography.Text>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Typography.Text>{item.description}</Typography.Text>
                    </Col>
                </Row>
            )}
        />
    </div>
  )
}

export default PatientInfo
