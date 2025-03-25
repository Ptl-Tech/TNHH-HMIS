
import { ExperimentOutlined } from "@ant-design/icons"
import TreatmentHistoryTable from "../tables/nurse-tables/TreatmentHistoryTable"
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader";

const TreatmentsHistory = () => {

  return (
    <div>
      
      <NurseInnerHeader icon={<ExperimentOutlined />} title="Past Encounter Notes" />

      <TreatmentHistoryTable />
    </div>
  )
}

export default TreatmentsHistory