import { Button, Card, Col, DatePicker, Form, Input, Row, Space, TimePicker} from "antd"

const DischargeCardContent = () => {

  return (
    <>
      <Card className="card">
        <Form layout="vertical" className="admit-patient-card-container">
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                <Form.Item 
                  label="Admission Number"
                  name='admissionNumber' 
                  
                >
                  <Input type='text' 
                    disabled
                  />
                </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                
                <Form.Item label="Expected Date of Discharge" name='expectedDateOfDischarge'>
                  <DatePicker placeholder="Expected Date of Discharge" style={{ width: '100%' }} 
                    disabled
                  />
                </Form.Item>
                
            </Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <Form.Item label="Discharge Date" name="dischargeDate" >
                <DatePicker placeholder="Admission Date" style={{ width: '100%' }} 
                 
                />
            </Form.Item>
            </Col>  
        </Row>
        <Row gutter={16}>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <Form.Item label="Admission Time" name='admissionTime'>
                  <TimePicker placeholder="Admission Time" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <Form.Item label="Bed" name='bed' >
                <Input  disabled/>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <Form.Item label="Doctor" name='Doctor'>
                  <Input  disabled />
              </Form.Item>
            </Col>
        </Row>
        <Row gutter={16}>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <Form.Item label="Admission Area" name='admissionArea'>
                  <Input disabled/>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <Form.Item label="Diagnosis Code" name='diagnosisCode'>
                  <Input disabled />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <Form.Item label="Branch" name='branch'>
                  <Input disabled />
              </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <Form.Item label="Admission Reason" name='admissionReason'>
                  <Input disabled />
              </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <Form.Item label="Patient Number" name='patientNumber'>
                  <Input disabled />
              </Form.Item>
          </Col>
        </Row>
        <Space>
            <Form.Item >
                <Button type="primary" htmlType="submit">Discharge Patient</Button>
            </Form.Item>
            <Form.Item >
                <Button color="danger" variant="outlined">Cancel Discharge</Button>
            </Form.Item>
        </Space>
        </Form>
    </Card>
    </>
  )
}

export default DischargeCardContent