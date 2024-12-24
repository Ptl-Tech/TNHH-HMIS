import { Col, List, Row, Space, Typography } from "antd"
import { ProfileOutlined } from "@ant-design/icons"

const PatientInfo = ({patientDetails}) => {
  const data = [
    {
        title: 'Patient Name',
        description: patientDetails?.SearchName || 'N/A',
    },
    {
        title: 'Patient ID',
        description: '123456789',
    },
    {
        title: 'Admission Number',
        description: 'ADM0001',
    },
    {
        title: 'Treatment Number',
        description: 'TREAT0001',
    },
    {
        title: 'Date of Admission',
        description: '2023-01-01',
    },
    {
        title: 'Identification Number',
        description: '123456789',
    },
    {
        title: 'Gender',
        description: 'Male',
    },
    {
        title: 'Marital Status',
        description: 'Single',
    },
    {
        title: 'Nationality',
        description: 'Kenyan',
    },
    {
        title: 'Date of Birth',
        description: '1990-01-01',
    },
    {
        title: 'Address 1',
        description: '123 Main St',
    },
    {
        title: 'Address 2',
        description: '123 Main St',
    },
    {
        title: 'City',
        description: 'Nairobi',
    },
    {
        title: 'Country',
        description: 'Kenya',
    },
    {
        title: 'County',
        description: 'Nairobi',
    },
    {
        title: 'Postal Code',
        description: 'Kenya',
    },
    {
        title: 'Home Telephone',
        description: '',
    },
    {
        title: 'Mobile Phone',
        description: '+254712345678',
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