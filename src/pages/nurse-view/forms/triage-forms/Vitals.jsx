import { Col, Form, Input, Row } from 'antd'
import PropTypes from 'prop-types'

const FormVitals = ({handleOnChange, setFormData, triageListDetail}) => {
  const patientNumber = triageListDetail?.PatientNo
  const observationNumber = triageListDetail?.ObservationNo
  return (
    <Form layout="vertical" validateTrigger="onChange"
       initialValues={{
        vitals: { 
          patientNumber: patientNumber,
          observationNumber: observationNumber
        }

      }}
    >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item 
                  label="Observation Number"
                  name={['vitals', 'observationNumber']}
                  rules={[{ required: true, message: 'Please input observation number!' }]} 
                >
                  <Input type='text' 
                    name='observationNumber'
                    onChange={handleOnChange}
                    value={setFormData.observationNumber}
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  label="Patient Number" 
                  name={['vitals', 'patientNumber']}
                  rules={[{ required: true, message: 'Please input patient number!' }]}
                  >
                  <Input type='text' 
                    name='patientNumber'
                    onChange={handleOnChange}
                    value={setFormData.patientNumber}
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Pulse Rate"
                  name={['vitals', 'pulseRate']}
                  rules={[{ required: true, message: 'Please input pulse rate!' }]}
                >
                  <Input type='text'
                    name='pulseRate'
                    onChange={handleOnChange}
                    value={setFormData.pulseRate}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Blood Pressure" name={['vitals', 'bloodPreasure']}
                  rules={[{ required: true, message: 'Please input blood pressure!' }]}
                  >
                  <Input type='text' 
                      name='bloodPreasure'
                      onChange={handleOnChange}
                      value={setFormData.bloodPressure}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Temperature" name={['vitals', 'temperature']}
                  rules={[{ required: true, message: 'Please input temperature!' }]}
                >
                  <Input type='number' 
                    name='temperature'
                    onChange={handleOnChange}
                    value={setFormData.temperature}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="SPO2" name={['vitals', 'sP02']}
                  rules={[{ required: true, message: 'Please input SOP2!' }]}
                >
                  <Input type='text' 
                    name='sP02'
                    onChange={handleOnChange}
                    value={setFormData.SPO2}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Height" name={['vitals', 'height']}
                
                rules={[{ required: true, message: 'Please input height!' }]}
                >
                  <Input type='number' 
                    name='height'
                    onChange={handleOnChange}
                    value={setFormData.height}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Weight" name={['vitals', 'weight']}
                  rules={[{ required: true, message: 'Please input weight!' }]}
                >
                  <Input type='number' 
                    name='weight'
                    onChange={handleOnChange}
                    value={setFormData.weight}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Respiration Rate" name={['vitals', 'respirationRate']}
                  rules={[{ required: true, message: 'Please input respiration rate!' }]}
                >
                  <Input type='text' 
                  
                  name='respirationRate'
                  onChange={handleOnChange}
                  value={setFormData.respirationRate}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Pain" name={['vitals', 'pain']}>
                  <Input type='number' 
                    name='pain'
                    onChange={handleOnChange}
                    value={setFormData.pain}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
  )
}

export default FormVitals

//props validation
FormVitals.propTypes = {
  setFormData: PropTypes.func.isRequired,
  setOnModalOpen: PropTypes.func.isRequired,
  setModalContent: PropTypes.func.isRequired,
  handleOnChange: PropTypes.func.isRequired,
  activeTab: PropTypes.string.isRequired,
  triageListDetail: PropTypes.object.isRequired,
};