import { useLocation } from "react-router-dom";
import useFetchAllPatientsHook from "../../hooks/useFetchAllPatientsHook";
import { useEffect, useState } from "react";
import NurseInnerHeader from "../../partials/nurse-partials/NurseInnerHeader";
import { Col, Row } from "antd";
import EncounterSummeryCard from "./EncounterSummeryCard";
import EvaluationCardContent from "./Doctor-Forms/EvaluationCardContent";
import useAuth from "../../hooks/useAuth";

const EncounterSummery = () => {
  const location = useLocation();
  const role = useAuth().userData.departmentName;
  const [patientDetail, setPatientDetail] = useState([]);
  const treatmentNo = new URLSearchParams(location.search).get("TreatmentNo");
  const patientNo = new URLSearchParams(location.search).get("PatientNo");
  const patientDetails = location.state?.patientDetails;

  const { triageWaitingList, loadingTriageWaitingList } =
    useFetchAllPatientsHook();

  useEffect(() => {
    if (patientNo) {
      const filterPatient = triageWaitingList?.filter(
        (patient) => patient?.PatientNo === patientNo
      );
      setPatientDetail(filterPatient[0]);
    }
  }, [patientNo, triageWaitingList]);

  console.log('patient details', patientDetails);
  return (
    <div style={{ margin: "20px 10px 10px 10px" }}>
      
      <NurseInnerHeader title="Encounter Summery" />

      <Row gutter={8} className="inpatient-card-container">
        <Col
          xs={24}
          md={24}
          lg={24}
          xl={24}
          className="inpatient-card-left-col"
        >
          <EncounterSummeryCard patientDetails={patientDetails} loadingTriageWaitingList={loadingTriageWaitingList}/>

        </Col>
        <Col
          xs={24}
          md={24}
          lg={24}
          xl={24}
          className="inpatient-card-left-col"
        >
            <EvaluationCardContent treatmentNo={treatmentNo} patientNo={patientNo} patientDetails={patientDetails} role={role}/>

        </Col>
      </Row>
    </div>
  );
};

export default EncounterSummery;
