import { Col, Row } from "antd";
import InpatientCardInfo from "./InpatientCardInfo";
import InpatientCardContent from "./InpatientCardContent";
import { useLocation } from "react-router-dom";
import NurseInnerHeader from "../../partials/nurse-partials/NurseInnerHeader";

const InpatientCard = () => {
  
  const { patientDetails } = useLocation().state;

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
