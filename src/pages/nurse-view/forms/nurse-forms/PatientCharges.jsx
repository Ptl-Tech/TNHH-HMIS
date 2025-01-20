import { Button, Card, Col, Form, Input, Row, Select, Space } from "antd"
import { handOverNurse, hospitalBranchesTotalWards, selectBed } from "../../../../constants/nurse-constants"
import TextArea from "antd/es/input/TextArea"

const PatientChargesForm = () => {
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
              label="Select Transaction Type"
              name='transactionType'

            >
              <Select
                key={'location'}
                style={{ width: '100%' }}
                optionFilterProp="label"
                options={hospitalBranchesTotalWards}
                placeholder="Select transaction type"
                showSearch

              >
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Transaction Code"
              name='transactionCode'

            >
              <Select
                key={'location'}
                style={{ width: '100%' }}
                optionFilterProp="label"
                options={handOverNurse}
                placeholder="Select transaction code"
                showSearch

              >
              </Select>
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
              label="Select Doctor"
              name='selectDoctor'

            >
              <Select
                key={'location'}
                style={{ width: '100%' }}
                optionFilterProp="label"
                options={hospitalBranchesTotalWards}
                placeholder="Select doctor"
                showSearch
                // filterOption = {true}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }

              >
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Select Department"
              name='selectDepartment'

            >
              <Select
                key={'location'}
                style={{ width: '100%' }}
                optionFilterProp="label"
                options={handOverNurse}
                placeholder="Select department"
                showSearch

              >
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Amount"
              name='amount'

            >
              <Input type='text'

                disabled
              />

            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Quantity"
              name='Quantity'

            >
              <Input type='number' />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Remarks"
              name='remarks'

            >
              <TextArea type='text'

              />

            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Revenue Code"
              name='revenueCode'

            >
              <Select
                key={'location'}
                style={{ width: '100%' }}
                optionFilterProp="label"
                options={selectBed}
                placeholder="Select revenue code"
                showSearch

              >
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Space>
          <Form.Item >
            <Button type="primary" htmlType="submit">Save Transaction</Button>
          </Form.Item>
          <Form.Item >
            <Button color="danger" variant="outlined">Cancel Transaction</Button>
          </Form.Item>
        </Space>
      </Form>
    </Card>
  )
}

export default PatientChargesForm