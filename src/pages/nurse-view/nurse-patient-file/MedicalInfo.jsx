import { Col, List, Row, Typography } from "antd"
import { FileMarkdownOutlined } from "@ant-design/icons"
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader"

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
      <NurseInnerHeader icon={<FileMarkdownOutlined />} title="Medical Information" />

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