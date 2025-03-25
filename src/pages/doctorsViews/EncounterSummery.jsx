import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import NurseInnerHeader from "../../partials/nurse-partials/NurseInnerHeader";
import { Col, Row } from "antd";
import EncounterSummeryCard from "./EncounterSummeryCard";
import EvaluationCardContent from "./Doctor-Forms/EvaluationCardContent";
import useAuth from "../../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { getAppmntDetails } from "../../actions/getAppmntDetails";
import useFetchPatientDetailsHook from "../../hooks/useFetchPatientDetailsHook";

const EncounterSummery = () => {
  const location = useLocation();
  const role = useAuth().userData.departmentName;
  const treatmentNo = new URLSearchParams(location.search).get("TreatmentNo");
  const patientNo = new URLSearchParams(location.search).get("PatientNo");
  const patientDetails = location.state?.patientDetails || {};
  const otherPatientDetails = location.state?.patientDetails || {};
  const dispatch = useDispatch();

  const { loading: loadingPatientDetail, data: patientDetail } = useSelector(
    (state) => state.getPatientVisit
  );

  const { patientDetails: data } = useFetchPatientDetailsHook(patientDetails?.PatientNo);

  console.log('patientDetails', patientDetails);
  console.log('Patient details data from the component', data);

  useEffect(() => {
    dispatch(getAppmntDetails(patientDetails?.LinkNo));
  }, [dispatch, patientDetails?.LinkNo]);

  return (
    <div style={{ margin: "20px 10px 10px 10px" }}>
      <NurseInnerHeader title="Encounter Summary" />

      <Row gutter={8}>
        <Col
          xs={24}
          md={24}
          lg={24}
          xl={24}
          className="inpatient-card-left-col"
        >
          <EncounterSummeryCard
            patientDetails={patientDetail}
            otherPatientDetails={otherPatientDetails}
            loadingPatientDetail={loadingPatientDetail}
            data={data}
          />
        </Col>
        <Col
          xs={24}
          md={24}
          lg={24}
          xl={24}
          className="inpatient-card-left-col"
        >
          <EvaluationCardContent
            treatmentNo={treatmentNo}
            patientNo={patientNo}
            patientDetails={patientDetails}
            role={role}
          />
        </Col>
      </Row>
    </div>
  );
};

export default EncounterSummery;
