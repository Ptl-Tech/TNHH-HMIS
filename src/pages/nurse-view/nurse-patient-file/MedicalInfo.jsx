import { Col, List, Row, Space, Typography } from "antd"
import { ProfileOutlined } from "@ant-design/icons"

const MedicalInfo = () => {
  const data = [
  
    {
      title: 'Past medical conditions',
      description: 'Asthma, Diabetes, Hypertension',
    },
    {
      title: 'Drug reactions',
      description: 'some drug, some drug, some drug',
    },
    {
      title: 'Past surgeries',
      description: 'Head surgery, Leg surgery, Arm surgery',
    },
    {
      title: 'Immunizations',
      description: 'Polio, Tetanus, Covid-19',
    },
    {
      title: 'Family history',
      description: 'Cancer, Diabetes, Hypertension',
    },
    {
      title: 'Social history',
      description: 'Alcohol, Smoking, Drug abuse',
    }
    
]
  return (
    <div>
      <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '30px', position: 'relative'}}>
            <ProfileOutlined />
            <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '14px'}}>
                Medical Information
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

export default MedicalInfo