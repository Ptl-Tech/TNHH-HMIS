import { Col, DatePicker, Form, Input, Row, TimePicker } from 'antd'
import TextArea from 'antd/es/input/TextArea'
const format = 'HH:mm';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

const Injections = ({ handleOnChange, setFormData, handleDateChange, handleTimeChange, formData, activeTab }) => {
  return (
    <Form layout="vertical">
        <Row gutter={16}>
            <Col span={12}>
            <Form.Item label="Observation No" name={['vitals', 'observationNo']}
                rules={[{ required: true, message: 'Please input observation no!' }]}
            >
                <Input type='text' 
                onChange={handleOnChange}
                value={setFormData.observationNo}
                name='observationNo'
                />
            </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item label="Injection No" name="injectionNo"
                rules={[{ required: true, message: 'Please input injection no!' }]}
            >
            <Input type='text' 
                onChange={handleOnChange}
                value={setFormData.injectionNo}
                name='injectionNo'
            />
            </Form.Item>
            </Col>
        </Row>
        <Row gutter={16}>
            <Col span={12}>
            <Form.Item label="Injection Quantity" name={['vitals', 'injectionQuantity']}>
                <Input type='number' 
                onChange={handleOnChange}
                value={setFormData.injectionQuantity}
                name='injectionQuantity'
                />
            </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item label="Injection Date" name="injectionDate">
            <DatePicker style={{ width: '100%' }}
            
            onChange={(date, dateString) => handleDateChange(date, dateString, 'injectionDate')}
            
            />
            </Form.Item>
            </Col>
            </Row>
            <Row gutter={16}>
            <Col span={24}>
            <Form.Item label="Injection time" name={['vitals', 'injectionTime']}>
                <TimePicker defaultValue={dayjs('12:08', format)} format={format} style={{ width: '100%' }} 
                     onChange={(time, timeString) => handleTimeChange(time, timeString, 'injectionTime')} // Pass the field name
                     value={formData[activeTab]?.injectionTime} // Bind to state
                />
            </Form.Item>
            </Col>
            <Col span={24}>
            <Form.Item label="Injection Remarks" name={['vitals', 'injectionRemarks']}>
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
}