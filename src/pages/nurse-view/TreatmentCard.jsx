import { Col, Row, Space, Typography } from "antd";
import { DiffOutlined } from "@ant-design/icons";
import TreatmentCardContent from "./TreatmentCardContent";
import TreatmentCardInfo from "./TreatmentCardInfo";

const PastDoctorVisitPatient = () => {
  return (
    <div style={{ margin: "20px 10px 10px 10px" }}>
      <Space className="inpatient-header">
        <DiffOutlined />
        <Typography.Text className="inpatient-header-text">
          Past Encounter List
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
          <TreatmentCardInfo />
        </Col>
      </Row>
      <Row gutter={8}>
        <Col
          xs={24}
          md={24}
          lg={24}
          xl={24}
          className="inpatient-card-right-col"
        >
          <TreatmentCardContent />
        </Col>
      </Row>
    </div>
  );
};

export default PastDoctorVisitPatient;
