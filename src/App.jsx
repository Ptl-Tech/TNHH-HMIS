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
import ReceptionLayout from "./Layouts/ReceptionLayout";
import ReceptionDashboard from "./Dashboards/ReceptionDashboard";
import SecurityLayout from "./Layouts/SecurityLayout";
import VisitorList from "./pages/VisitorList";
import VisitorForm from "./pages/VisitorForm";
import CreateVisitForm from "./pages/CreateVisitForm";
import { roles } from "./constants/role";

import HistoryVisitorList from "./pages/HistoryVisitorList";
import ActiveAppmnts from "./pages/ActiveAppmnts";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPwd />} />
      <Route path="/reset-password" element={<ResetPwd />} />
      <Route element={<PrivateRoute allowedRoles={["Reception"]} />}>
        <Route path="/reception" element={<ReceptionLayout />}>
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
          <Route path="/reception/appointments/list" element={<ActiveAppmnts />} />

         
          <Route
            path="/reception/InPatient-list"
            element={<InpatientList />}
          />

          <Route path="/reception/visitors-list" element={<VisitorList />} />

          <Route
            path="/reception/create-visit/:patientNo"
            element={<CreateVisitForm />}
          />
        </Route>
      </Route>
      {/* <Route element={<PrivateRoute />}>
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
      </Route> */}
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
