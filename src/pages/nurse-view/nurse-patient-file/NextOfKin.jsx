import { Col, List, Row, Space, Typography } from "antd"
import { ProfileOutlined } from "@ant-design/icons"
import { useLocation } from "react-router-dom";

const NextOfKin = () => {

  const { patientDetails } = useLocation().state;

  const data = [
   
   
    {
        title: 'Next of Kin Full Name',
        description: patientDetails?.NextOfkinFullName || 'N/A',
    },
    {
        title: 'Next of Kin Relationship',
        description: patientDetails?.NextofkinRelationship || 'N/A',
    },
    {
        title: 'Next of ID Number',
        description: patientDetails?.NextOfKinIDCardNo || 'N/A',
    },
    {
        title: 'Next of Kin Address 1',
        description: patientDetails?.NextOfkinAddress1 || 'N/A',
    },
    {
        title: 'Next of Kin Address 2',
        description: patientDetails?.NextOfkinAddress2 || 'N/A',
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