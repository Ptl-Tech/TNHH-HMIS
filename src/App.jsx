import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import Home from "./pages/Home";
import PrivateRoute from "./private/PrivateRoute";
import { Roles } from "./utils/role";
import AdminPage from "./pages/AdminPage";
import AdminLayout from "./Layouts/AdminLayout";
import DocLayout from "./Layouts/DocLayout";
import NurseLayout from "./Layouts/NurseLayout";
import PatientRegistration from "./pages/PatientRegistration";
import Patientlist from "./pages/Patientlist";
import NurseObservation from "./pages/NurseObservation";
import NewPatients from "./pages/NewPatients";
import OutpatientList from "./pages/OutpatientList";
import DoctorDetailsForm from "./pages/DocDetailsForm";
import NurseOutpatientList from "./pages/NurseOutpatientList";
import PatientAdmissions from "./pages/PatientAdmissions";
import DoctorAdmissionList from "./pages/DoctorAdmissionList";
import InpatientList from "./pages/InpatientList";
import DischargeList from "./pages/DischargeList";
import DischargeRequestList from "./pages/DischargeRequestList";
import PharmacyOutPatient from "./pages/PharmacyOutPatient";
import BedManager from "./pages/BedManager";
import DoctorDashboard from "./Dashboards/DoctorDashboard";
import ForgotPwd from "./Auth/ForgotPwd";
import ResetPwd from "./Auth/ResetPwd";
import ViewProfile from "./Auth/ViewProfile";
import ReceptionLayout from "./Layouts/ReceptionLayout";
import ReceptionDashboard from "./Dashboards/ReceptionDashboard";
import Appointment from "./pages/nurse-view/Appointment";
import PastDoctorVisit from "./pages/nurse-view/PastDoctorVisit";
import TriageList from "./pages/nurse-view/TriageList";
import Dashboard from "./pages/nurse-view/Dashboard";
import Impatient from "./pages/nurse-view/Impatient";
import ImpatientList from "./pages/nurse-view/InpatientList";
import ExaminePatientInTriage from "./pages/nurse-view/ExaminePatientInTriage";
import SecurityLayout from "./Layouts/SecurityLayout";
import VisitorList from "./pages/VisitorList";
import VisitorForm from "./pages/VisitorForm";
import CreateVisitForm from "./pages/CreateVisitForm";
import TriageLayout from "./Layouts/TriageLayout";
import WaitingList from "./pages/WaitingList";
import { roles } from "./constants/role";
import ActivePatientList from "./pages/ActivePatientList";
import SecurityDashBoard from "./Dashboards/SecurityDashboard";
import HistoryVisitorList from "./pages/HistoryVisitorList";
import TriageListPending from "./pages/nurse-view/TriageListPending";
import TriageListClosed from "./pages/nurse-view/TriageListClosed";
import AdmitPatients from "./pages/nurse-view/AdmitPatients";
import WardManagement from "./pages/nurse-view/WardManagement";
import Inpatient from "./pages/nurse-view/Inpatient";
import AdmitPatient from "./pages/nurse-view/AdmitPatient";
import PatientCharges from "./pages/nurse-view/PatientCharges";
import ReleaseBed from "./pages/nurse-view/ReleaseBed";
import TransferBed from "./pages/nurse-view/TransferBed ";
import InpatientCard from "./pages/nurse-view/InpatientCard";
import TreatmentCard from "./pages/nurse-view/TreatmentCard";

function App() {
  const userLogin = useSelector((state) => state.otpVerify);
  const userInfo = userLogin?.userInfo;

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
      <Route element={<PrivateRoute allowedRoles={['Reception']} />}>
        <Route path="/reception" element={<ReceptionLayout />}>
          <Route index element={<ReceptionDashboard />} />

          <Route
            path="/reception/Patient-Registration"
            element={<PatientRegistration />}
          />
          <Route path="/reception/Patient-list" element={<OutpatientList />} />
          <Route path="/reception/view-profile" element={<ViewProfile />} />
          <Route
            path="/reception/Active-Outpatient"
            element={<OutpatientList />}
          />
          <Route
            path="/reception/Active-Inpatient"
            element={<InpatientList />}
          />

          <Route path="/reception/visitors-list" element={<VisitorList />} />

          <Route
            path="/reception/create-visit/:patientNo"
            element={<CreateVisitForm />}
          />
        </Route>
      </Route>


      <Route element={<PrivateRoute />}>
        <Route path="/Doctor" element={<DocLayout />}>
          <Route index element={<DoctorDashboard />} />

          <Route
            path="/Doctor/PatientRegistration"
            element={<PatientRegistration />}
          />
          <Route path="/Doctor/Outpatient-list" element={<OutpatientList />} />
          <Route
            path="/Doctor/Doc-Observation-Room/:id"
            element={<DoctorDetailsForm />}
          />
          <Route
            path="/Doctor/Patient-admissions"
            element={<DoctorAdmissionList />}
          />
          <Route path="/Doctor/Inpatient-list" element={<InpatientList />} />
          <Route path="/Doctor/Discharge-list" element={<DischargeList />} />
          <Route
            path="/Doctor/Pharmacy-OutPatient"
            element={<PharmacyOutPatient />}
          />
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
      <Route element={<PrivateRoute allowedRoles={["Production"]} />}>
        <Route path="/Triage" element={<TriageLayout />}>
          <Route index element={<NurseObservation />} />
          <Route path="/Triage/Triage-list" element={<WaitingList />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
