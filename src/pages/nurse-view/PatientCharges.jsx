import { Button, Card, Col, Row, Space, Typography } from "antd"
import { ProfileOutlined, CopyOutlined } from "@ant-design/icons"
import PatientChargesForm from "./forms/nurse-forms/PatientCharges";

const PatientCharges = () => {
   
    
  return (   
    <div>
    <Row style={{ margin: '20px 10px 10px 10px' }}>
            <Col span={24}>
                <Space style={{ color: '#b96000', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '10px'}}>
                    <ProfileOutlined />
                    <Typography.Text style={{ fontWeight: 'bold', color: '#b96000', fontSize: '16px'}}>
                        Patient Admission
                    </Typography.Text>
                </Space>
                    
                <Card className="admit-patient-card-container">
                    <Space className="admit-patient-button-container">
                        <Button type="primary"><CopyOutlined /> View Patient Charges</Button>
                    </Space>
                </Card>
            </Col>
        </Row>
        <PatientChargesForm /> 
    </div>
  )
}

export default PatientCharges