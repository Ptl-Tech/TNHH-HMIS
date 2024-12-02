import { Col, DatePicker, Form, Input, Row, Select, TimePicker } from 'antd'
import TextArea from 'antd/es/input/TextArea'
const format = 'HH:mm';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

const Injections = ({ handleOnChange, setFormData, handleDateChange, handleTimeChange, formData, activeTab, handleSelectChange, triageListDetail }) => {

    const observationNumber = triageListDetail?.ObservationNo;

    const selectInjectionNumber = [
        {
          value: 0,
          label: 'I_2023',
        },
    
        {
          value: 1,
          label: 'I_2024',
        },
        {
          value: 2,
          label: 'I_2025',
        },
    
      ]

  return (
    <Form layout="vertical"
        validateTrigger="onChange"
        initialValues={{
        injections: { 
          observationNumber: observationNumber
        }

      }}
    
    >
        <Row gutter={16}>
            <Col span={12}>
            <Form.Item label="Observation No" name={['injections', 'observationNumber']}
                rules={[{ required: true, message: 'Please input observation no!' }]}
            >
                <Input type='text' 
                onChange={handleOnChange}
                value={setFormData.observationNumber}
                name='observationNumber'
                disabled
                />
            </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item label="Injection No" name={['injections', 'injectionNo']}
                rules={[{ required: true, message: 'Please input injection no!' }]}
            >
            <Select 
                key={'location'}
                style={{ width: '100%' }}
                optionFilterProp="label"
                options={selectInjectionNumber} 
                placeholder="Select Injection No"
                onChange={(value) => handleSelectChange(value, 'injectionNo')} // Pass name manually
                value={formData[activeTab]?.injectionNo} // Bind value to state
            >
            </Select>
            </Form.Item>
            </Col>
        </Row>
        <Row gutter={16}>
            <Col span={12}>
            <Form.Item label="Injection Quantity" name={['injections', 'injectionQuantity']}>
                <Input type='number' 
                onChange={handleOnChange}
                value={setFormData.injectionQuantity}
                name='injectionQuantity'
                />
            </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item label="Injection Date" name={['injections', 'injectionDate']}>
            <DatePicker style={{ width: '100%' }}
            
            onChange={(date, dateString) => handleDateChange(date, dateString, 'injectionDate')}
            
            />
            </Form.Item>
            </Col>
            </Row>
            <Row gutter={16}>
            <Col span={24}>
            <Form.Item label="Injection time" name={['injections', 'injectionTime']}>
                <TimePicker defaultValue={dayjs('12:08', format)} format={format} style={{ width: '100%' }} 
                     onChange={(time, timeString) => handleTimeChange(time, timeString, 'injectionTime')} // Pass the field name
                     value={formData[activeTab]?.injectionTime} // Bind to state
                />
            </Form.Item>
            </Col>
            <Col span={24}>
            <Form.Item label="Injection Remarks" name={['injections', 'injectionRemarks']}>
                <TextArea 
                autoSize={{
                    minRows: 3,
                    maxRows: 5,
                }}
                onChange={handleOnChange}
                value={setFormData.injectionRemarks}
                name='injectionRemarks'
                />
            </Form.Item>
            </Col>
        </Row>
    </Form>
  )
}

export default Injections

//prop types validation
Injections.propTypes = {
    setFormData: PropTypes.array.isRequired,
    handleOnChange: PropTypes.func.isRequired,
    handleDateChange: PropTypes.func.isRequired,
    handleTimeChange: PropTypes.func.isRequired,
    formData: PropTypes.object.isRequired,
    activeTab: PropTypes.string.isRequired,
    handleSelectChange: PropTypes.func.isRequired,
    triageListDetail: PropTypes.object.isRequired,
}