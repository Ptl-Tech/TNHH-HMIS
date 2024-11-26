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
import ImpatientList from "./pages/nurse-view/ImpatientList";
import SecurityLayout from "./Layouts/SecurityLayout";
import VisitorList from "./pages/VisitorList";
import VisitorForm from "./pages/VisitorForm";
import CreateVisitForm from "./pages/CreateVisitForm";

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
            <Route path="Appointments-list" element={<Appointment />} />
            <Route path="Past-Doctor-Visit" element={<PastDoctorVisit />} />
            <Route path="Triage" element={<TriageList />} />
            <Route path="Impatient" element={<Impatient />} />
            <Route path="Impatient/Ward" element={<ImpatientList />} />
            <Route path="Patient-list" element={<Patientlist />} />
            <Route path="New-Patients" element={<NewPatients />} />
            
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


      
      <Route element={<PrivateRoute />}>
        <Route path="/reception" element={<ReceptionLayout />}>
          <Route index element={<ReceptionDashboard />} />

          <Route
            path="/reception/Patient-Registration"
            element={<PatientRegistration />}
          />
          <Route path="/reception/Patient-list" element={<OutpatientList />} />
          <Route path="/reception/view-profile" element={<ViewProfile />} />
          <Route path="/reception/create-visit/:patientNo" element={<CreateVisitForm />} />

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
      <Route element={<PrivateRoute />}>
        <Route path="/Security" element={<SecurityLayout />}>
          <Route index element={<VisitorForm />} />
          <Route path="/Security/visitors-list" element={<VisitorList />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
