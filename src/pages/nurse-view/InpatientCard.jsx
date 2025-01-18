import { Col, Row } from "antd";
import InpatientCardInfo from "./InpatientCardInfo";
import InpatientCardContent from "./InpatientCardContent";
import { useLocation } from "react-router-dom";
import NurseInnerHeader from "../../partials/nurse-partials/NurseInnerHeader";
import useFetchAllergiesAndMedicationsHook from "../../hooks/useFetchAllergiesAndMedicationsHook";

const InpatientCard = () => {
  
  const { patientDetails } = useLocation().state;
  
  // get combined list and loading states from the hook

  const { combinedList, loadingAllergies, loadingTriageList } = useFetchAllergiesAndMedicationsHook();

  const filterAllergies = combinedList?.filter(allergy => allergy.PatientNo === patientDetails?.Patient_No);

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
          <InpatientCardInfo patientDetails={patientDetails} filterAllergies={filterAllergies} loadingAllergies={loadingAllergies} loadingTriageList={loadingTriageList}/>
        </Col>
        <Col
          xs={24}
          md={24}
          lg={24}
          xl={24}
          className="inpatient-card-left-col"
        >
          <InpatientCardContent  patientDetails={patientDetails} />
        </Col>
      </Row>
    </div>
  );
};

export default InpatientCard;
