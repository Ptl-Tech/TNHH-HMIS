import { Col, Row, Space, Typography } from "antd"
import { ProfileOutlined } from "@ant-design/icons"
import TransferBedForm from "./forms/nurse-forms/TransferBedForm"

const ReleaseBed = () => {
  return (
    <div>
    <Row style={{ margin: '20px 10px 10px 10px' }}>
            <Col span={24}>
                <Space style={{ color: '#b96000', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '10px'}}>
                    <ProfileOutlined />
                    <Typography.Text style={{ fontWeight: 'bold', color: '#b96000', fontSize: '16px'}}>
                        Transfer Bed
                    </Typography.Text>
                </Space>
            </Col>
        </Row>
        <TransferBedForm />
    </div>
  )
}

export default ReleaseBed