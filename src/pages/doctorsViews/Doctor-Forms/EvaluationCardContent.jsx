import { Card, Tabs } from "antd";
import React from "react";
import ObservationRoom from "./ObservationRoom";
import PatientCarePlan from "./PatientCarePlan";
import PatientRequests from "./PatientRequests";
import DocForms from "./DocForms";
import PatientFile from "../../nurse-view/PatientFile";

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
          <Tabs.TabPane tab="Patient File" key="1">
            <PatientFile patientDetails={patientDetails} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Care Plan" key="2">
            <ObservationRoom
              treatmentNo={treatmentNo}
              observationNo={observationNo}
              patientNo={patientNo}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Requests" key="3">
            <PatientRequests />
          </Tabs.TabPane>{" "}
          <Tabs.TabPane tab="Medication" key="4">
            <PatientCarePlan
              treatmentNo={treatmentNo}
              observationNo={observationNo}
              patientNo={patientNo}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Doctor Forms" key="5">
            <DocForms />
          </Tabs.TabPane>
          {/* 
                        <Tabs.TabPane tab="Procedures" key="6">
                            <Procedures />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Orders" key="7">
                            <Orders />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Notes" key="8">
                            <Notes />
                        </Tabs.TabPane> */}
        </Tabs>
      </Card>
    </div>
  );
};

export default EvaluationCardContent;
