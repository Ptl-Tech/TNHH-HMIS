import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import PrivateRoute from "./private/PrivateRoute";
import { Roles } from "./utils/role";
import PatientRegistration from "./pages/PatientRegistration";
import OutpatientList from "./pages/OutpatientList";
import InpatientList from "./pages/InpatientList";
import ForgotPwd from "./Auth/ForgotPwd";
import ResetPwd from "./Auth/ResetPwd";
import ViewProfile from "./Auth/ViewProfile";
import MainLayout from "./Layouts/MainLayout";
import ReceptionDashboard from "./Dashboards/ReceptionDashboard";
import SecurityLayout from "./Layouts/SecurityLayout";
import VisitorList from "./pages/VisitorList";
import VisitorForm from "./pages/VisitorForm";
import CreateVisitForm from "./pages/CreateVisitForm";
import { roles } from "./constants/role";

import HistoryVisitorList from "./pages/HistoryVisitorList";
import ActiveAppmnts from "./pages/ActiveAppmnts";
import CashPatients from "./pages/CashPatients";
import InsurancePatients from "./pages/InsurancePatients";
import PatientCard from "./pages/doctorsViews/PatientCard";
import AdmitPatient from "./pages/nurse-view/AdmitPatient";
import PatientCharges from "./pages/nurse-view/PatientCharges";
import ReleaseBed from "./pages/nurse-view/ReleaseBed";
import TransferBed from "./pages/nurse-view/TransferBed ";
import InpatientCard from "./pages/nurse-view/InpatientCard";
import TreatmentCard from "./pages/nurse-view/TreatmentCard";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPwd />} />
      <Route path="/reset-password" element={<ResetPwd />} />
      
      <Route element={<PrivateRoute allowedRoles={[Roles.Admin]} />}>
        <Route path="/admin" element={<AdminLayout />} />{" "}
        {/* Admin page route */}
      </Route>

      {/* removed - <Route element={<PrivateRoute allowedRoles={[Roles.Nurse]} />}  - from the nurse route otp*/}
      
      <Route element={<PrivateRoute allowedRoles={[Roles.Nurse]} />}>
      <Route path="/Nurse" element={<NurseLayout />}>
            {/* <Route index element={<NurseDashboard />} /> */}
            <Route path="Dashboard" element={<Dashboard />} />
            <Route
              path="Patient-Registration"
              element={<PatientRegistration />}
            />
            <Route path="Past-doctor-visit" element={<PastDoctorVisit />} />
            <Route path="Past-doctor-visit/Patient" element={<TreatmentCard />} />

            <Route path="Triage" element={<TriageList />} />
            <Route path="PendingTriageList" element={<TriageListPending />} />
            <Route path="ClosedTriageList" element={<TriageListClosed />} />
            <Route path="Triage/Patient" element={<ExaminePatientInTriage />} />
            <Route path="Triage-list" element={<WaitingList />} />
            <Route path="Patient-list" element={<Patientlist />} />
            <Route path="New-Patients" element={<NewPatients />} />

            <Route path="Inpatient" element={<Inpatient />} />
            <Route path="Admit-patient" element={<AdmitPatients />} />
            <Route path="Admit-patient/Patient" element={<AdmitPatient />} />
            <Route path="Admit-patient/Charges" element={<PatientCharges />} />
            <Route path="Ward-management" element={<WardManagement />} />
            <Route path="Ward-management/Release-bed" element={<ReleaseBed />} />
            <Route path="Ward-management/Transfer-bed" element={<TransferBed />} />
            <Route path="Inpatient/Patient-card" element={<InpatientCard />} />
            
            <Route
              path="Observation-Room/:id"
              element={<NurseObservation />}
            />
            <Route
              path="Outpatient-list"
              element={<NurseOutpatientList />}
            />
            <Route
              path="Patient-admissions"
              element={<PatientAdmissions />}
            />
            <Route path="BedManagement" element={<BedManager />} />

            <Route
              path="Discharge-list"
              element={<DischargeRequestList />}
            />
            <Route path="view-profile" element={<ViewProfile />} />
      </Route>
      </Route>
      
      <Route element={<PrivateRoute allowedDepartments={["Reception"]}  />}>
      <Route path="/Nurse" element={<NurseLayout />}>
            {/* <Route index element={<NurseDashboard />} /> */}
            <Route path="Dashboard" element={<Dashboard />} />
            <Route
              path="Patient-Registration"
              element={<PatientRegistration />}
            />
            <Route path="Past-Doctor-Visit" element={<PastDoctorVisit />} />
            <Route path="Triage" element={<TriageList />} />
            <Route path="PendingTriageList" element={<TriageListPending />} />
            <Route path="ClosedTriageList" element={<TriageListClosed />} />
            <Route path="Triage/Patient" element={<ExaminePatientInTriage />} />
            <Route path="Triage-list" element={<WaitingList />} />
            <Route path="Patient-list" element={<Patientlist />} />
            <Route path="New-Patients" element={<NewPatients />} />

            <Route path="Inpatient" element={<Inpatient />} />
            <Route path="Admit-patient" element={<AdmitPatients />} />
            <Route path="Ward-management" element={<WardManagement />} />
            
            <Route
              path="Observation-Room/:id"
              element={<NurseObservation />}
            />
            <Route
              path="Outpatient-list"
              element={<NurseOutpatientList />}
            />
            <Route
              path="Patient-admissions"
              element={<PatientAdmissions />}
            />
            <Route path="BedManagement" element={<BedManager />} />

            <Route
              path="Discharge-list"
              element={<DischargeRequestList />}
            />
            <Route path="view-profile" element={<ViewProfile />} />
      </Route>
      </Route>
      <Route element={<PrivateRoute allowedRoles={['Reception']} />}>
        <Route path="/reception" element={<MainLayout />}>
          <Route index element={<ReceptionDashboard />} />

          <Route
            path="/reception/Patient-Registration"
            element={<PatientRegistration />}
          />
          <Route
            path="/reception/Add-Appointment/:patientNo"
            element={<CreateVisitForm />}
          />

          <Route path="/reception/Patient-list" element={<OutpatientList />} />
          <Route path="/reception/view-profile" element={<ViewProfile />} />
          <Route
            path="/reception/appointments/list"
            element={<ActiveAppmnts />}
          />

          <Route path="/reception/cash-List" element={<CashPatients />} />
          <Route
            path="/reception/insurance-List"
            element={<InsurancePatients />}
          />

          <Route path="/reception/InPatient-list" element={<InpatientList />} />

          <Route path="/reception/visitors-list" element={<VisitorList />} />

          <Route
            path="/reception/create-visit/:patientNo"
            element={<CreateVisitForm />}
          />
        </Route>
      </Route>
      <Route element={<PrivateRoute allowedDepartments={["Doctor"]} />}>
        <Route path="/Doctor" element={<MainLayout />}>
          <Route index element={<PatientCard />} />

          <Route path="/Doctor/view-profile" element={<ViewProfile />} />
        </Route>
      </Route>
      
      <Route element={<PrivateRoute allowedRoles={["Security"]} />}>
        <Route path="/Security" element={<SecurityLayout />}>
          <Route index element={<VisitorForm />} />
          <Route path="/Security/visitors-list" element={<VisitorList />} />
          <Route
            path="/Security/History-list"
            element={<HistoryVisitorList />}
          />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
