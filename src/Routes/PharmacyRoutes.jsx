import { Route } from "react-router-dom";

import MainLayout from "../Layouts/MainLayout";
import PrivateRoute from "../private/PrivateRoute";

import {
  FaBedPulse,
  FaBoxArchive,
  FaHouseMedical,
  FaPrescription,
  FaPersonWalking,
  FaClockRotateLeft,
  FaPersonWalkingArrowRight,
} from "react-icons/fa6";
import { GiPayMoney } from "react-icons/gi";

import PharmacyCard from "../pages/pharmacy-views/PharmacyCard";
import PharmacyWalkIn from "../pages/pharmacy-views/PharmacyWalkIn.jsx";
import PharmacyInpatient from "../pages/pharmacy-views/PharmacyInpatient";
import PharmacyDashboard from "../pages/pharmacy-views/PhamarcyDashboard";
import PharmacyHistory from "../pages/pharmacy-views/PharmacyHistory.jsx";
import PharmacyArchived from "../pages/pharmacy-views/PharmacyArchived.jsx";
import PharmacyOutpatient from "../pages/pharmacy-views/PharmacyOutpatient";
import PharmacyHistoryList from "../pages/pharmacy-views/PharmacyHistoryList";
import PharmacyQuotation from "../pages/pharmacy-views/PharmacyQuotation";
import PharmacyListReturnLines from "../pages/pharmacy-views/PharmacyListReturnLines";

export const pharmacyRoutes = [
  {
    key: "/Dashboard",
    icon: <FaHouseMedical style={{ color: "#fff" }} />,
    label: "Dashboard",
  },
  {
    key: "/Dashboard/All-Records",
    label: "Pharmacy",
    icon: <FaPrescription style={{ color: "#fff" }} />,
    children: [
      {
        key: "/Dashboard/History-Records?status=Completed",
        label: "Pharmacy History",
        icon: <FaClockRotateLeft style={{ color: "#fff" }} />,
      },
      {
        key: "/Dashboard/Archived-Records?status=Cancelled",
        label: "Cancelled Prescriptions",
        icon: <FaBoxArchive style={{ color: "#fff" }} />,
      },
    ],
  },
  {
    key: "/Dashboard/Pharmacy-OutPatient",
    label: "Pharmacy Outpatient",
    icon: <FaPersonWalkingArrowRight style={{ color: "#fff" }} />,
  },
  {
    key: "/Dashboard/Pharmacy-InPatient",
    label: "Pharmacy Inpatient",
    icon: <FaBedPulse style={{ color: "#fff" }} />,
  },
  {
    key: "/Dashboard/Pharmacy-WalkIn",
    label: "Pharmacy Walk In",
    icon: <FaPersonWalking style={{ color: "#fff" }} />,
  },
  {
    key: "/Dashboard/Pharmacy-Quotation",
    label: "Pharmacy Quotation",
    icon: <GiPayMoney style={{ color: "#fff" }} />,
  },
];

export default function PharmacyRoutes() {
  return (
    <Route
      element={
        <PrivateRoute permission={"read"} resource={"pharmacyNavigation"} />
      }
    >
      <Route path="/Dashboard" element={<MainLayout />}>
        <Route index element={<PharmacyDashboard />} />
        <Route
          path="/Dashboard/History-Records"
          element={<PharmacyHistory />}
        />
        <Route
          path="/Dashboard/Archived-Records"
          element={<PharmacyArchived />}
        />
        <Route
          path="/Dashboard/Pharmacy-OutPatient"
          element={<PharmacyOutpatient />}
        />
        <Route
          path="/Dashboard/Pharmacy-InPatient"
          element={<PharmacyInpatient />}
        />
        <Route path="/Dashboard/Pharmacy-WalkIn" element={<PharmacyWalkIn />} />
        <Route
          path="/Dashboard/Pharmacy-Quotation"
          element={<PharmacyQuotation />}
        />
        <Route path="/Dashboard/Pharmacy-Card" element={<PharmacyCard />} />
        <Route
          path="/Dashboard/Pharmacy-Returns"
          element={<PharmacyListReturnLines />}
        />
        <Route
          path="/Dashboard/Pharmacy-History"
          element={<PharmacyHistoryList />}
        />
      </Route>
    </Route>
  );
}
