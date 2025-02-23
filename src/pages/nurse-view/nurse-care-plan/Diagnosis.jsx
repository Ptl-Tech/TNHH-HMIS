import { MedicineBoxOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader";
import DiagnosisTable from "../../doctorsViews/tables/Diagnosis/DiagnosisTable";

const Diagnosis = () => {
  const { patientDetails } = useLocation().state;
  return (
    <div>
      <NurseInnerHeader icon={<MedicineBoxOutlined />} title="Diagnosis Lines" />

      <DiagnosisTable treatmentNo={patientDetails?.Admission_No}/>
    </div>
  );
};

export default Diagnosis;
