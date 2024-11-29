import { Col, Form, Input, Row } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import PropTypes from 'prop-types'


const Dressing = ({ handleOnChange, setFormData }) => {
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
            <Form.Item label="Process No" name="processNo"
                rules={[{ required: true, message: 'Please input process no!' }]}
            >
            <Input type='text' 
                onChange={handleOnChange}
                value={setFormData.processNo}
                name='processNo'
            />
            </Form.Item>
            </Col>
            </Row>

            <Row gutter={16}>
            <Col span={12}>
            <Form.Item label="Item No" name={['vitals', 'itemNo']}
                rules={[{ required: true, message: 'Please input item no!' }]}
            >
                <Input type='text' 
                onChange={handleOnChange}
                value={setFormData.itemNo}
                name='itemNo'
                />
            </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item label="Unit of measure" name={['vitals', 'unitOfMeasure']}>
                <Input type='text' 
                onChange={handleOnChange}
                value={setFormData.unitOfMeasure}
                name='unitOfMeasure'
                />
            </Form.Item>
            </Col>
            </Row>
        
        <Row>
            <Col span={24}>
            <Form.Item label="Quantity" name="quantity">
            <Input type='number' 
                onChange={handleOnChange}
                value={setFormData.quantity}
                name='quantity'
            />
            </Form.Item>
            </Col>
            </Row>

            <Row>
            <Col span={24}>
            <Form.Item label="Dressing Remarks" name={['vitals', 'injectionRemarks']}>
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

export default Dressing

//prop type validation
Dressing.propTypes = {
    handleOnChange: PropTypes.func.isRequired,
    setFormData: PropTypes.array.isRequired
}