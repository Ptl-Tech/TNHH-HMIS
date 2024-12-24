import { Col, Row, Space, Typography } from "antd";
import { DiffOutlined } from "@ant-design/icons";
import InpatientCardInfo from "./InpatientCardInfo";
import InpatientCardContent from "./InpatientCardContent";
import { useLocation } from "react-router-dom";

const InpatientCard = () => {
  const { patientDetails } = useLocation().state;

  return (
    <div style={{ margin: "20px 10px 10px 10px" }}>
      <Space className="inpatient-header">
        <DiffOutlined />
        <Typography.Text className="inpatient-header-text">
          Inpatient Card
        </Typography.Text>
      </Space>
      <Row gutter={8} className="inpatient-card-container">
        <Col
          xs={24}
          md={24}
          lg={24}
          xl={24}
          className="inpatient-card-left-col"
        >
          <InpatientCardInfo patientDetails={patientDetails} />
        </Col>
        <Col
          xs={24}
          md={24}
          lg={24}
          xl={24}
          className="inpatient-card-left-col"
        >
          <InpatientCardContent  patientDetails={patientDetails}/>
        </Col>
      </Row>
    </div>
  );
};

export default InpatientCard;
