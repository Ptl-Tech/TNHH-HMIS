import { useLocation } from "react-router-dom";

import { Card, Tabs } from "antd";

import Medication from "./Medication";
import AdmissionTab from "./AdmissionTab";
import PatientRequests from "./PatientRequests";
import ConsultationroomDetails from "./ConsultationroomDetails";

const EvaluationCardContent = ({
  role,
  patientNo,
  treatmentNo,
  observationNo,
}) => {
  const location = useLocation();
  const patientDetail = location.state?.patientDetails;

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
          {(role === "Doctor" || role === "Nurse") && (
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
          {(role === "Doctor" || role === "Nurse") && (
            <>
              <Tabs.TabPane tab="Procedures" key="3">
                <PatientRequests />
              </Tabs.TabPane>{" "}
            </>
          )}
          {role === "Doctor" && patientDetail?.Status !== "Completed" && (
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
