import { useLocation } from "react-router-dom";

import { Card, Tabs } from "antd";

import { useAbility } from "../../../hooks/casl";

import Medication from "./Medication";
import AdmissionTab from "./AdmissionTab";
import PatientRequests from "./PatientRequests";
import ConsultationroomDetails from "./ConsultationroomDetails";

const EvaluationCardContent = ({ patientNo, treatmentNo, observationNo }) => {
  const ability = useAbility();
  const location = useLocation();

  const patientDetail = location.state?.patientDetails;
  const canSeePatientAdmission = ability.can("read", "patientProcedures");
  const canSeePatientMedication = ability.can("read", "patientMedication");
  const canSeePatientProcedures = ability.can("read", "patientProcedures");

  return (
    <div>
      <Card
        variant="borderless"
        styles={{ body: { boxShadow: "none" } }}
        style={{ padding: "12px", boxShadow: "none" }}
      >
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Consultation Room " key="1">
            <ConsultationroomDetails
              patientNo={patientNo}
              observationNo={observationNo}
            />
          </Tabs.TabPane>
          {canSeePatientMedication && (
            <>
              <Tabs.TabPane tab="Medication" key="2">
                <Medication
                  treatmentNo={treatmentNo}
                  observationNo={observationNo}
                  patientNo={patientNo}
                />
              </Tabs.TabPane>
            </>
          )}
          {canSeePatientProcedures && (
            <>
              <Tabs.TabPane tab="Procedures" key="3">
                <PatientRequests />
              </Tabs.TabPane>{" "}
            </>
          )}
          {canSeePatientAdmission && patientDetail?.Status !== "Completed" && (
            <>
              <Tabs.TabPane tab="Admission & Referral" key="4">
                <AdmissionTab />
              </Tabs.TabPane>
            </>
          )}
        </Tabs>
      </Card>
    </div>
  );
};

export default EvaluationCardContent;
