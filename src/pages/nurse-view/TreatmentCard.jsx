import { Col, Row } from "antd";
import TreatmentCardContent from "./TreatmentCardContent";
import PatientInfo from "./nurse-patient-file/PatientInfo";

const PastDoctorVisitPatient = () => {
  return (
    <div style={{ margin: "20px 10px 10px 10px" }}>
      <Row gutter={8} className="inpatient-card-container">
        <Col
          xs={24}
          md={24}
          lg={24}
          xl={24}
          className="inpatient-card-left-col"
        >
          <PatientInfo />
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
