import { Button, Card, Col, Form, Row, Select, Space } from "antd"
import { handOverNurse, hospitalBranchesTotalWards } from "../../../../constants/nurse-constants"


const ReleaseBedForm = () => {
  return (
    <Card style={{ margin: '20px 10px 10px 10px' }}>
        <Form layout="vertical" className="admit-patient-card-container">
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
                  label="Select Room Number" 
                  name='selectRoomNumber'
                
                  >
                  <Select 
                key={'location'}
                style={{ width: '100%' }}
                optionFilterProp="label"
                options={handOverNurse} 
                placeholder="Select room number"
                showSearch
                
                >
                </Select>
                </Form.Item>
            </Col>
        </Row>

        <Row gutter={16}>
            <Col span={12}>
                <Form.Item 
                  label="Select Bed Number"
                  name='selectBedNumber' 
        
                >
                <Select 
                key={'location'}
                style={{ width: '100%' }}
                optionFilterProp="label"
                options={hospitalBranchesTotalWards} 
                placeholder="Select bed number"
                showSearch
                
                >
                </Select>
                </Form.Item>
              </Col>
        </Row>
        <Space>
            <Form.Item >
                <Button type="primary" htmlType="submit">Release Bed</Button>
            </Form.Item>
            <Form.Item >
                <Button color="danger" variant="outlined">Cancel Release Transfer</Button>
            </Form.Item>
        </Space>
        </Form>
    </Card>
  )
}

export default ReleaseBedForm