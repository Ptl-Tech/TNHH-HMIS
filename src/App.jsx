import { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Can } from "./hooks/casl";
import { AbilityProvider } from "./hooks/casl";

import Login from "./Auth/Login";
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
import PrivateRoute from "./private/PrivateRoute";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { user, loading } = useSelector((state) => state.auth);

  console.log({ user, loading });

  useEffect(() => {
    dispatch(getUserDetails());
  }, []);

  const isInAuthPages = () => {
    return location.pathname === "/login";
  };

  useEffect(() => {
    if (!loading) {
      if (user === null) navigate("/login");
      if (user && isInAuthPages()) return navigate("/Dashboard");
    }
  }, [user, loading, navigate]);

  return (
    <AbilityProvider user={user}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* {() => LabRoutes()} */}
        {/* {NurseRoutes()} */}
        {/* {DoctorRoutes()} */}
        {/* {SecurityRoutes()} */}
        {/* {PharmacyRoutes()} */}
        {/* {RadiologyRoutes()} */}
        {ReceptionRoutes()}
        {/* <Route
          element={
            <>
              <Can I={"Read"} this={"receptionNavigation"}>
              </Can>
            </>
          }
        /> */}
        {/* </Can> */}
        {/* {PsychologyRoutes()} */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </AbilityProvider>
  );
}

export default App;
