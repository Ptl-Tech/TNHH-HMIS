import { Card, Tabs } from "antd";
import React from "react";
import ObservationRoom from "./ObservationRoom";
import PatientCarePlan from "./PatientCarePlan";
import PatientRequests from "./PatientRequests";
import DocForms from "./DocForms";
import PatientFile from "../../nurse-view/PatientFile";
import ConsultationroomDetails from "./ConsultationroomDetails";
import AdmissionTab from "./AdmissionTab";

const EvaluationCardContent = ({
  treatmentNo,
  observationNo,
  patientNo,
  patientDetails,
  role,
}) => {
  return (
    <div>
      <Card className="card" style={{ padding: "10px 16px" }}>
        <Tabs defaultActiveKey="1">
          {(role === "Doctor" || role === "Psychology" || role === "Nurse") && (
            <Tabs.TabPane tab="Triage Room" key="2">
              <ObservationRoom
                treatmentNo={treatmentNo}
                observationNo={observationNo}
                patientNo={patientNo}
              />
            </Tabs.TabPane>
          )}

          <Tabs.TabPane tab="Consultation Room " key="3">
            <ConsultationroomDetails
              treatmentNo={treatmentNo}
              observationNo={observationNo}
              patientNo={patientNo}
            />
          </Tabs.TabPane>
          {(role === "Doctor" || role === "Nurse") && (
            <>
              <Tabs.TabPane tab="Medication" key="5">
                <PatientCarePlan
                  treatmentNo={treatmentNo}
                  observationNo={observationNo}
                  patientNo={patientNo}
                />
              </Tabs.TabPane>
            </>
          )}

          {(role === "Doctor" || role === "Nurse") && (
            <>
              <Tabs.TabPane tab="Procedures" key="4">
                <PatientRequests />
              </Tabs.TabPane>{" "}
            </>
          )}

          {/* <Tabs.TabPane tab="Doctor Forms" key="6">
            <DocForms />
          </Tabs.TabPane> */}

          {(role === "Doctor") && (
            <>
              <Tabs.TabPane tab="Admission & Referral" key="7">
                <AdmissionTab />
              </Tabs.TabPane>
            </>
          )}
          {
            (role === "Nurse" || role === "Doctor" || role === "Psychology") && (
              <>
                <Tabs.TabPane tab="Patient File" key="8">
                <PatientFile patientDetails={patientDetails} />
              </Tabs.TabPane>
              </>
            )
          }
        </Tabs>
      </Card>
    </div>
  );
};

export default EvaluationCardContent;
