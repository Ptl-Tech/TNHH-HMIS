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
import NurseDashboard from "./Dashboards/NurseDashboard";
import DoctorDashboard from "./Dashboards/DoctorDashboard";
import ForgotPwd from "./Auth/ForgotPwd";
import ResetPwd from "./Auth/ResetPwd";
import ViewProfile from "./Auth/ViewProfile";
import ReceptionLayout from "./Layouts/ReceptionLayout";
import ReceptionDashboard from "./Dashboards/ReceptionDashboard";
import SecurityLayout from "./Layouts/SecurityLayout";
import VisitorList from "./pages/VisitorList";
import VisitorForm from "./pages/VisitorForm";
import CreateVisitForm from "./pages/CreateVisitForm";
import TriageLayout from "./Layouts/TriageLayout";
import WaitingList from "./pages/WaitingList";
import { roles } from "./constants/role";

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
      <Route element={<PrivateRoute allowedRoles={[Roles.Nurse]} />}>
        <Route path="/Nurse" element={<NurseLayout />}>
          <Route index element={<NurseDashboard />} />
          <Route
            path="/Nurse/Patient-Registration"
            element={<PatientRegistration />}
          />
          <Route path="/Nurse/Patient-list" element={<Patientlist />} />
          <Route path="/Nurse/New-Patients" element={<NewPatients />} />
          <Route
            path="/Nurse/Observation-Room/:id"
            element={<NurseObservation />}
          />
          <Route
            path="/Nurse/Outpatient-list"
            element={<NurseOutpatientList />}
          />
          <Route
            path="/Nurse/Patient-admissions"
            element={<PatientAdmissions />}
          />
          <Route path="/Nurse/BedManagement" element={<BedManager />} />

          <Route
            path="/Nurse/Discharge-list"
            element={<DischargeRequestList />}
          />
          <Route path="/Nurse/view-profile" element={<ViewProfile />} />
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
      <Route element={<PrivateRoute allowedRoles={['Security']} />}>
        <Route path="/Security" element={<SecurityLayout />}>
          <Route index element={<VisitorForm />} />
          <Route path="/Security/visitors-list" element={<VisitorList />} />
        </Route>
      </Route>
      <Route element={<PrivateRoute allowedRoles={['Production']}/>}>
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
