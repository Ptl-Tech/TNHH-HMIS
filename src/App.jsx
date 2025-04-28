import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './Auth/Login';
import Register from './Auth/Register';
import ResetPwd from './Auth/ResetPwd';
import ForgotPwd from './Auth/ForgotPwd';

import LabRoutes from './Routes/LabRoutes';
import NurseRoutes from './Routes/NurseRoutes';
import DoctorRoutes from './Routes/DoctorRoutes';
import SecurityRoutes from './Routes/SecurityRoutes';
import PharmacyRoutes from './Routes/PharmacyRoutes';
import RadiologyRoutes from './Routes/RadiologyRoutes';
import ReceptionRoutes from './Routes/ReceptionRoutes';
import PsychologyRoutes from './Routes/PsychologyRoutes';

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<Login />}
      />
      <Route
        path="/register"
        element={<Register />}
      />
      <Route
        path="/forgot-password"
        element={<ForgotPwd />}
      />
      <Route
        path="/reset-password"
        element={<ResetPwd />}
      />
      <Route
        path="*"
        element={<Navigate to="/login" />}
      />
      {LabRoutes()}
      {NurseRoutes()}
      {DoctorRoutes()}
      {SecurityRoutes()}
      {PharmacyRoutes()}
      {RadiologyRoutes()}
      {ReceptionRoutes()}
      {PsychologyRoutes()}
    </Routes>
  );
}

export default App;
