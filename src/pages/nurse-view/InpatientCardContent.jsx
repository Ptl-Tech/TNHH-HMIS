import { Card, Tabs } from "antd";
import PatientFile from "./PatientFile";
import CarePlan from "./CarePlan";
import Requests from "./Requests";
import Discharges from "./Discharges";
import PropTypes from "prop-types";
// import useAuth from "../../hooks/useAuth";
import WardTransfer from "./WardTransfer";
import { useAbility } from "../../hooks/casl";
import NursingPatientCharges from "./billing/NursingPatientCharges";

const InpatientCardContent = () => {
  const ability = useAbility();
  const canCreateWardTransfer = ability.can("create", "wardTransfer");
  const canReadPatientCharges = ability.can("read", "patientCharges");

  return (
    <>
      <Card className="card">
        <Tabs defaultActiveKey="1" type="card">
          <Tabs.TabPane tab="Patient File" key="1">
            <PatientFile />
          </Tabs.TabPane>
          <Tabs.TabPane tab={"Quick Tools"} key="2">
            <CarePlan />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Requests" key="3">
            <Requests />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Discharge" key="4">
            <Discharges />
          </Tabs.TabPane>
          {canCreateWardTransfer && (
            <Tabs.TabPane tab="Ward Transfer" key="5">
              <WardTransfer />
            </Tabs.TabPane>
          )}
          {canReadPatientCharges && (
            <Tabs.TabPane tab="Patient Charges" key="6">
              <NursingPatientCharges />
            </Tabs.TabPane>
          )}
        </Tabs>
      </Card>
    </>
  );
};

export default InpatientCardContent;
//props validation
InpatientCardContent.propTypes = {
  filterAllergies: PropTypes.array,
  loadingAllergies: PropTypes.bool,
};
