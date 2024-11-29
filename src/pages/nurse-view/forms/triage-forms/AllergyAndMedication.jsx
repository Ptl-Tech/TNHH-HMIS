import { Col, Form, Input, Row, Select } from 'antd'
import PropTypes from 'prop-types'

const AllergyAndMedication = ({ setFormData, handleOnChange, handleSelectChange, formData, activeTab }) => {

    const selectReasonForVisit = [
        {
          value: 0,
          label: '',
        },
    
        {
          value: 1,
          label: 'Patient not improving',
        },
        {
          value: 2,
          label: 'Patient Deteriorating',
        },
    
        {
          value: 3,
          label: 'New Presentation',
        },
    
        {
          value: 4,
          label: 'Follow Up',
        },
    
      ]

  return (
    <Form layout="vertical">
        <Row gutter={16}>
        
        <Col span={12}>
            <Form.Item label="Observation No" 
            name={['allergy', 'observationNo']}
            rules={[{ required: true, message: 'Please input observation no!' }]}
            >
            <Input type='text' 
                name='observationNumber'
                onChange={handleOnChange}
                value={setFormData.observationNumber}
            />
            </Form.Item>
        </Col>
        <Col span={12}>
            <Form.Item label="Assessed by" 
            name={['allergy', 'assessedBy']}
            rules={[{ required: true, message: 'Please input your name!' }]}
            >
            <Input type='text' 
            name='assessedBy'
            onChange={handleOnChange}
            value={setFormData.assessedBy}
            />
            </Form.Item>
        </Col>
        </Row>

        <Row gutter={16}>
        
        <Col span={12}>
            <Form.Item label="Complains" 
            name={['allergy', 'complains']}
            >
            <Input type='text' 
                name='complains'
                onChange={handleOnChange}
                value={setFormData.complains}
            />
            </Form.Item>
        </Col>
        <Col span={12}>
        <Form.Item label="Reason for visit" 
            name={['allergy', 'reasonForVisit']}
            rules={[{ required: true, message: 'Please input your name!' }]}
            >
            <Select
                key={'location'}
                style={{ width: '100%' }}
                optionFilterProp="label"
                options={selectReasonForVisit} 
                onChange={(value) => handleSelectChange(value, 'reasonForVisit')} // Pass name manually
                value={formData[activeTab]?.reasonForVisit} // Bind value to state
            >
            </Select>
            </Form.Item>
        </Col>
        </Row>

        <Row gutter={16}>
            <Col span={12}>
            <Form.Item label="Food Allergy" name={['allergy', 'foodAllergy']}>
                <Input type='text' 
                onChange={handleOnChange}
                value={setFormData.foodAllergy}
                name='foodAllergy'
                />
            </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item label="Drug Allergy" name={['allergy', 'drugAllergy']}>
                <Input type='number' 
                onChange={handleOnChange}
                value={setFormData.drugAllergy}
                name='drugAllergy'
                />
            </Form.Item>
            </Col>
        </Row>
    </Form>
  )
}

export default AllergyAndMedication


//prop types validation
AllergyAndMedication.propTypes = {
    setFormData: PropTypes.array.isRequired,
    handleOnChange: PropTypes.func.isRequired,
    handleSelectChange: PropTypes.func.isRequired,
    formData: PropTypes.array.isRequired,
    activeTab: PropTypes.string.isRequired
}