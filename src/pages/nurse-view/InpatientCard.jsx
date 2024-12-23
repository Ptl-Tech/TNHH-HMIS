import { Col, Row, Space, Typography } from "antd"
import { DiffOutlined } from "@ant-design/icons"
import InpatientCardInfo from "./InpatientCardInfo"
import InpatientCardContent from "./InpatientCardContent"

const InpatientCard = () => {
 
  return (
    <div style={{ margin: '20px 10px 10px 10px' }}>
          <Space className="inpatient-header">
          <DiffOutlined />
            <Typography.Text className="inpatient-header-text">
                Inpatient Card
            </Typography.Text>
          </Space>
          <Row gutter={8} className="inpatient-card-container">
              <Col xs={24} md={24} lg={24} xl={24} className="inpatient-card-left-col">
                <InpatientCardInfo/>
              </Col>
              <Col xs={24} md={24} lg={24} xl={24} className="inpatient-card-left-col">
                <InpatientCardContent/>
              </Col>
          </Row>
    </div>
  )
}

export default InpatientCard