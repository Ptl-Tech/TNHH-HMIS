import { Route } from "react-router-dom";

import { AppstoreOutlined, UserOutlined } from "@ant-design/icons";

import MainLayout from "../Layouts/MainLayout";
import PrivateRoute from "../private/PrivateRoute";
import RadiologyDashboard from "../Dashboards/RadiologyDashboard";
import RadiologyOutPatient from "../pages/doctorsViews/tables/Radiology/RadiologyOutPatient";
import RadiologyOutPatients from "../pages/doctorsViews/tables/Radiology/RadiologyOutPatients";

export const radiologyRoutes = [
  {
    key: "/Dashboard",
    icon: <AppstoreOutlined style={{ color: "#fff" }} />,
    label: "Radiology",
  },
  {
    type: "divider",
  },
  {
    key: "RadiologyGroup",
    label: (
      <span style={{ color: "#ac8342", fontWeight: "medium" }}>Radiology</span>
    ),
    type: "group",
    children: [
      {
        key: "/Dashboard/Radiology-Patients",
        label: "Radiology Requests",
        icon: <UserOutlined style={{ color: "#fff" }} />,
      },
    ],
  },
];

export default function RadiologyRoutes() {
  return (
    <Route
      element={
        <PrivateRoute permission={"read"} resource={"radiologyNavigation"} />
      }
    >
      <Route path="/Dashboard" element={<MainLayout />}>
        <Route index element={<RadiologyDashboard />} />
        <Route
          path="/Dashboard/Radiology-Patients"
          element={<RadiologyOutPatients />}
        />
        <Route
          path="/Dashboard/Radiology-Patient/:radiologyNo?"
          element={<RadiologyOutPatient />}
        />
      </Route>
    </Route>
  );
}
