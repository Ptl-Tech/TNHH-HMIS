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
}) => {
  return (
    <div>
      <Card className="card" style={{ padding: "10px 16px" }}>
        <Tabs defaultActiveKey="1">
       
          <Tabs.TabPane tab="Triage Room Details" key="2">
            <ObservationRoom
              treatmentNo={treatmentNo}
              observationNo={observationNo}
              patientNo={patientNo}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Consultation Room Details" key="3">
            <ConsultationroomDetails
              treatmentNo={treatmentNo}
              observationNo={observationNo}
              patientNo={patientNo}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Procedures" key="4">
            <PatientRequests />
          </Tabs.TabPane>{" "}
          <Tabs.TabPane tab="Medication" key="5">
            <PatientCarePlan
              treatmentNo={treatmentNo}
              observationNo={observationNo}
              patientNo={patientNo}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Doctor Forms" key="6">
            <DocForms />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Patient Admission & Referral" key="7">
            <AdmissionTab />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Patient File" key="8">
            <PatientFile patientDetails={patientDetails} />
          </Tabs.TabPane>
         
        </Tabs>
      </Card>
    </div>
  );
};

export default EvaluationCardContent;
