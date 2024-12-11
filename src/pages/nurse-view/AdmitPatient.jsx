import { Button, Card, Col, Row, Space, Typography } from "antd"
import { ProfileOutlined, CopyOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom";
import AdmitPatientForm from "./forms/nurse-forms/AdmitPatient";

const AdmitPatient = () => {
    const navigate = useNavigate();
    const handleAdmissionList = () => {
        navigate('/Nurse/Admit-patient');
    }
  return (   
    <div>
    <Row style={{ margin: '20px 10px 10px 10px' }}>
            <Col span={24}>
                <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '10px'}}>
                    <ProfileOutlined />
                    <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '16px'}}>
                        Patient Admission
                    </Typography.Text>
                </Space>
                    
                <Card className="admit-patient-card-container">
                    <Space className="admit-patient-button-container">
                        <Button type="primary" onClick={handleAdmissionList}><CopyOutlined /> Admission List</Button>
                    </Space>
                </Card>
            </Col>
        </Row>
        <AdmitPatientForm /> 
    </div>
  )
}

export default AdmitPatient