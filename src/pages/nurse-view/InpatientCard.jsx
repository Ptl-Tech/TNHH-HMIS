import { Col, Row } from "antd";
import InpatientCardInfo from "./InpatientCardInfo";
import InpatientCardContent from "./InpatientCardContent";
import { redirect, useLocation } from "react-router-dom";
import NurseInnerHeader from "../../partials/nurse-partials/NurseInnerHeader";

const InpatientCard = () => {
  
  const location = useLocation();
  const patientDetail = location.state?.patientDetails;

  if (!patientDetail) {
    return redirect("/login");
  }

  return (
    <div style={{ margin: "20px 10px 10px 10px" }}>
      
      <NurseInnerHeader title="Patient Card" />

      <Row gutter={8} className="inpatient-card-container">
        <Col
          xs={24}
          md={24}
          lg={24}
          xl={24}
          className="inpatient-card-left-col"
        >
          <InpatientCardInfo patientDetail={patientDetail} />
        </Col>
        <Col
          xs={24}
          md={24}
          lg={24}
          xl={24}
          className="inpatient-card-left-col"
        >
          <InpatientCardContent />
        </Col>
      </Row>
    </div>
  );
};

export default InpatientCard;
