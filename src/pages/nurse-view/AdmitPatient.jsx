import { Col, Row, Space, Typography } from "antd"
import { ProfileOutlined } from "@ant-design/icons"
import AdmitPatientForm from "./forms/nurse-forms/AdmitPatient";

const AdmitPatient = () => {  
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

            </Col>
        </Row>
        <AdmitPatientForm /> 
    </div>
  )
}

export default AdmitPatient