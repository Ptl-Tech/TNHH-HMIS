import { Routes, Route } from "react-router-dom";

import { useAuth } from "./hooks/auth";
import { useAbility } from "./hooks/casl";
import { axiosConfig } from "./utils/axiosHelpers";

import Login from "./Auth/Login";
import LabRoutes from "./Routes/LabRoutes";
import NotFound from "./components/NotFound";
import NurseRoutes from "./Routes/NurseRoutes";
import ResetPassword from "./Auth/ResetPassword";
import DoctorRoutes from "./Routes/DoctorRoutes";
import ForgotPassword from "./Auth/ForgotPassword";
import SecurityRoutes from "./Routes/SecurityRoutes";
import PharmacyRoutes from "./Routes/PharmacyRoutes";
import RadiologyRoutes from "./Routes/RadiologyRoutes";
import ReceptionRoutes from "./Routes/ReceptionRoutes";
import PsychologyRoutes from "./Routes/PsychologyRoutes";

function App() {
  const { user } = useAuth();
  const ability = useAbility();

  axiosConfig(user);

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* All the individual user's routes */}
        {ability.can("read", "labNavigation") && LabRoutes()}
        {ability.can("read", "nurseNavigation") && NurseRoutes()}
        {ability.can("read", "doctorNavigation") && DoctorRoutes()}
        {ability.can("read", "securityNavigation") && SecurityRoutes()}
        {ability.can("read", "pharmacyNavigation") && PharmacyRoutes()}
        {ability.can("read", "radiologyNavigation") && RadiologyRoutes()}
        {ability.can("read", "receptionNavigation") && ReceptionRoutes()}
        {ability.can("read", "psychologyNavigation") && PsychologyRoutes()}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
