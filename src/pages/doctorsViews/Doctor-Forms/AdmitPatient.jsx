import { Button, Card, Col, Form, Input, Row, Select, Space } from "antd"
import { handOverNurse, hospitalBranchesTotalWards, selectBed } from "../../../constants/nurse-constants"
import TextArea from "antd/es/input/TextArea"

const AdmitPatientForm = () => {
  return (
    <Card style={{ margin: '20px 10px 10px 10px' }}>
        <Form layout="vertical" className="admit-patient-card-container">
        <Row gutter={16}>
            <Col span={12}>
                <Form.Item 
                  label="Admission Number"
                  name='admissionNumber' 
                  
                >
                  <Input type='text' 
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  label="Patient Number" 
                  name='patientNumber'
                  
                  >
                  <Input type='text' 
                    name='patientNumber'
                    disabled
                  />
                </Form.Item>
            </Col>
        </Row>

        <Row gutter={16}>
            <Col span={12}>
                <Form.Item 
                  label="Patient Name"
                  name='patientName' 
                  
                >
                  <Input type='text' 
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  label="Admission Date" 
                  name='admissionDate'
               
                  >
                  <Input type='text' 
                    name='patientNumber'
                    disabled
                  />
                </Form.Item>
            </Col>
        </Row>

        <Row gutter={16}>
            <Col span={12}>
                <Form.Item 
                  label="Admission Area"
                  name='admissionArea' 
                  
                >
                  <Input type='text' 
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  label="Admission Nurse" 
                  name='admissionNurse'
                 
                  >
                  <Input type='text' 
                    name='patientNumber'
                    
                  />
                </Form.Item>
            </Col>
        </Row>

        <Row gutter={16}>
            <Col span={12}>
                <Form.Item 
                  label="Select Ward"
                  name='selectWard' 
                 
                >
                <Select 
                key={'location'}
                style={{ width: '100%' }}
                optionFilterProp="label"
                options={hospitalBranchesTotalWards} 
                placeholder="Select ward"
                showSearch
                
                >
                </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  label="Handover Nurse" 
                  name='handoverNurse'
                  
                  >
                  <Select 
                key={'location'}
                style={{ width: '100%' }}
                optionFilterProp="label"
                options={handOverNurse} 
                placeholder="Select nurse"
                showSearch
                
                >
                </Select>
                </Form.Item>
            </Col>
        </Row>

        <Row gutter={16}>
            <Col span={12}>
                <Form.Item 
                  label="Admission Reason"
                  name='admissionReason' 
                  
                >
                <TextArea type='text' />

                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  label="Select Bed" 
                  name='selectBed'
                  
                  >
                  <Select 
                key={'location'}
                style={{ width: '100%' }}
                optionFilterProp="label"
                options={selectBed} 
                placeholder="Select bed"
                showSearch
                
                >
                </Select>
                </Form.Item>
            </Col>
        </Row>
        <Space>
            <Form.Item >
                <Button type="primary" htmlType="submit">Save Admission</Button>
            </Form.Item>
            <Form.Item >
                <Button color="danger" variant="outlined">Cancel Admission</Button>
            </Form.Item>
        </Space>
        </Form>
        </Card>
  )
}

export default AdmitPatientForm