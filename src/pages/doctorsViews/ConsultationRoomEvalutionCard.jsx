import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Row, Col, Skeleton } from "antd";

// import useAuth from '../../hooks/useAuth';
import PatientInfo from "./Doctor-Forms/PatientInfo";
import PatientVitalInfo from "./Doctor-Forms/PatientVitalInfo";
import EvaluationCardContent from "./Doctor-Forms/EvaluationCardContent";

import { getPatientDetails } from "../../actions/triage-actions/getPatientDetailsSlice";

const ConsultationRoomEvalutionCard = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  // Correct way to get treatmentNo and patientNo from the URL
  const patientNo = new URLSearchParams(location.search).get("PatientNo");
  const treatmentNo = new URLSearchParams(location.search).get("TreatmentNo");

  const { loading: loadingPatientDetails, data: patientDetails } = useSelector(
    (state) => state.getPatientDetails
  );

  useEffect(() => {
    dispatch(getPatientDetails(patientNo));
  }, [dispatch, patientNo]);

  if (loadingPatientDetails) return <Skeleton />;

  return (
    <Row gutter={16}>
      <Col xs={24} md={24} lg={18} xl={18}>
        {loadingPatientDetails ? (
          <Skeleton />
        ) : (
          <PatientInfo
            patientNo={patientNo}
            treatmentNo={treatmentNo}
            patientDetails={patientDetails}
          />
        )}
        <EvaluationCardContent
          patientNo={patientNo}
          treatmentNo={treatmentNo}
          patientDetails={patientDetails}
        />
      </Col>
      <Col
        xs={24}
        md={24}
        lg={6}
        xl={6}
        style={{
          top: "65px",
          position: "sticky",
          height: "fit-content",
          alignSelf: "flex-start",
        }}
      >
        <PatientVitalInfo />
      </Col>
    </Row>
  );
};

export default ConsultationRoomEvalutionCard;
