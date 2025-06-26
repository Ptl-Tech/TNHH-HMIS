import { Route } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";

import {
  SendOutlined,
  UndoOutlined,
  UserOutlined,
  AppstoreOutlined,
  PlusCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { IoAlbums } from "react-icons/io5";
import {
  FaBedPulse,
  FaPersonWalking,
  FaPersonWalkingDashedLineArrowRight,
} from "react-icons/fa6";

import PrivateRoute from "../private/PrivateRoute";
import LabDashboard from "../Dashboards/LabDashboard";
import LabRequests from "../pages/doctorsViews/tables/lab/LabRequests";
import LaboratoryEvaluationCard from "../pages/doctorsViews/tables/lab/LaboratoryEvaluationCard";

const statuses = [
  { name: "New", icon: <PlusCircleOutlined /> },
  { name: "Forwarded", icon: <SendOutlined /> },
  {
    name: "Review",
    icon: <QuestionCircleOutlined style={{ color: "#fff" }} />,
  },
  {
    name: "Completed",
    icon: <CheckCircleOutlined style={{ color: "#fff" }} />,
  },
  { name: "Recalled", icon: <UndoOutlined style={{ color: "#fff" }} /> },
  {
    name: "Voided",
    icon: <CloseCircleOutlined style={{ color: "#fff" }} />,
  },
];

// Define the menu items
export const labRoutes = [
  {
    key: "/Lab",
    icon: <AppstoreOutlined style={{ color: "#fff" }} />,
    label: "Dashboard",
  },
  {
    key: "/Lab/All",
    label: "All Laboratory Requests",
    icon: <IoAlbums style={{ color: "#fff" }} />,
  },
  {
    key: "/Lab/Outpatient",
    label: "Laboratory Outpatient",
    icon: <FaPersonWalkingDashedLineArrowRight style={{ color: "#fff" }} />,
  },
  {
    key: "/Lab/Inpatient",
    label: "Laboratory Inpatient",
    icon: <FaBedPulse style={{ color: "#fff" }} />,
  },
  {
    key: "/Lab/Walk-In",
    label: "Laboratory Walk In",
    icon: <FaPersonWalking style={{ color: "#fff" }} />,
  },
];

export default function LabRoutes() {
  return (
    <>
      <Route element={<PrivateRoute allowedDepartments={["Laboratory"]} />}>
        <Route path="/Lab" element={<MainLayout />}>
          <Route index element={<LabDashboard />} />
          {/* All */}
          <Route path="/Lab/All" element={<LabRequests requestType="All" />} />
          {statuses.map(({ name }) => (
            <Route
              key={name}
              element={<LabRequests status={name} requestType="All" />}
              path={`/Lab/All/${name}`}
            />
          ))}
          {/* Outpatient */}
          <Route
            path="/Lab/Outpatient"
            element={<LabRequests requestType="Outpatient" />}
          />
          {statuses.map(({ name }) => (
            <Route
              key={name}
              element={<LabRequests status={name} requestType="Outpatient" />}
              path={`/Lab/Outpatient/${name}`}
            />
          ))}
          <Route
            path="/Lab/Outpatient/Lab-Request/:LaboratoryNo?"
            element={<LaboratoryEvaluationCard />}
          />
          {/* Walk In */}
          <Route
            path="/Lab/Walk-In"
            element={<LabRequests requestType="Walk-In" />}
          />
          {statuses.map(({ name }) => (
            <Route
              key={name}
              element={<LabRequests status={name} requestType="Walk-In" />}
              path={`/Lab/Walk-In/${name}`}
            />
          ))}
          <Route
            path="/Lab/Walk-In/Lab-Header/:LaboratoryNo?"
            element={<LaboratoryEvaluationCard />}
          />
          {/* Inpatient */}
          <Route
            path="/Lab/Inpatient"
            element={<LabRequests requestType="Inpatient" />}
          />
          {statuses.map(({ name }) => (
            <Route
              key={name}
              element={<LabRequests status={name} requestType="Inpatient" />}
              path={`/Lab/Inpatient/${name}`}
            />
          ))}
          <Route
            path="/Lab/Inpatient/Lab-Request/:LaboratoryNo?"
            element={<LaboratoryEvaluationCard />}
          />
        </Route>
      </Route>
    </>
  );
}
