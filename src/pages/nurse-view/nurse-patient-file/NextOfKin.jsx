import { Col, List, Row, Space, Typography } from "antd"
import { ProfileOutlined } from "@ant-design/icons"

const NextOfKin = () => {
  const data = [
   
    {
        title: 'Mobile Phone',
        description: '+254712345678',
    },
    {
        title: 'Next of Kin Full Name',
        description: 'John Doe',
    },
    {
        title: 'Next of Kin Relationship',
        description: 'Father',
    },
    {
        title: 'Next of Kin Address',
        description: '123 Main St',
    },
    {
        title: 'Next of Kin Email',
        description: 'Zo9yM@example.com',
    },
    {
        title: 'Next of Kin Phone',
        description: '+254712345678',
    },
    {
        title: 'Next of Kin Address',
        description: '123 Main St',
    }
]
  return (
   <div>
      <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '30px', position: 'relative'}}>
            <ProfileOutlined />
            <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '14px'}}>
                Patient Next of Kin Information
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

export default NextOfKin