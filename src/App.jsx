import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./Auth/Login";
import Register from "./Auth/Register";
import ResetPassword from "./Auth/ResetPassword";
import ForgotPassword from "./Auth/ForgotPassword";

import LabRoutes from "./Routes/LabRoutes";
import NurseRoutes from "./Routes/NurseRoutes";
import DoctorRoutes from "./Routes/DoctorRoutes";
import SecurityRoutes from "./Routes/SecurityRoutes";
import PharmacyRoutes from "./Routes/PharmacyRoutes";
import RadiologyRoutes from "./Routes/RadiologyRoutes";
import ReceptionRoutes from "./Routes/ReceptionRoutes";
import PsychologyRoutes from "./Routes/PsychologyRoutes";
import { getUserDetails } from "./actions/getUserDetails";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // getting the user on every refresh
    dispatch(getUserDetails());
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      {LabRoutes()}
      {NurseRoutes()}
      {DoctorRoutes()}
      {SecurityRoutes()}
      {PharmacyRoutes()}
      {RadiologyRoutes()}
      {ReceptionRoutes()}
      {PsychologyRoutes()}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
