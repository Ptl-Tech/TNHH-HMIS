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
import DocOutPatient from "./pages/doctorsViews/DocOutPatient";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPwd />} />
      <Route path="/reset-password" element={<ResetPwd />} />
      <Route element={<PrivateRoute allowedDepartments={["Reception"]} />}>
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
          <Route index element={<DocOutPatient />} />

          <Route path="/Doctor/view-profile" element={<ViewProfile />} />
        </Route>
      </Route>
      
      <Route element={<PrivateRoute allowedDepartments={["Security"]} />}>
        <Route path="/Security" element={<MainLayout />}>
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
