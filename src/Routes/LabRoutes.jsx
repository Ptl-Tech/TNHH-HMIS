import { Route } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";

import {
  SendOutlined,
  UndoOutlined,
  AppstoreOutlined,
  PlusCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { IoAlbums, IoAddCircle } from "react-icons/io5";
import {
  FaBedPulse,
  FaPersonWalking,
  FaPersonWalkingDashedLineArrowRight,
} from "react-icons/fa6";

// import { useAbility } from "../hooks/casl";
import PrivateRoute from "../private/PrivateRoute";
import LabDashboard from "../Dashboards/LabDashboard";
import { DispatchToLab } from "../pages/labViews/DispatchToLab";
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
    key: "/Dashboard",
    icon: <AppstoreOutlined style={{ color: "#fff" }} />,
    label: "Dashboard",
  },
  {
    key: "/Dashboard/Create-Lab-Header",
    icon: <IoAddCircle style={{ color: "#fff" }} />,
    label: "Create Lab Header",
  },
  {
    key: "/Dashboard/All",
    label: "All Laboratory Requests",
    icon: <IoAlbums style={{ color: "#fff" }} />,
  },
  {
    key: "/Dashboard/Outpatient",
    label: "Laboratory Outpatient",
    icon: <FaPersonWalkingDashedLineArrowRight style={{ color: "#fff" }} />,
  },
  {
    key: "/Dashboard/Inpatient",
    label: "Laboratory Inpatient",
    icon: <FaBedPulse style={{ color: "#fff" }} />,
  },
  {
    key: "/Dashboard/Walk-In",
    label: "Laboratory Walk In",
    icon: <FaPersonWalking style={{ color: "#fff" }} />,
  },
];

export default function LabRoutes() {
  return (
    <Route
      element={<PrivateRoute permission={"read"} resource={"labNavigation"} />}
    >
      <Route path="/Dashboard" element={<MainLayout />}>
        <Route index element={<LabDashboard />} />
        <Route
          path="/Dashboard/Create-Lab-Header"
          element={<DispatchToLab />}
        />
        {/* All */}
        <Route
          path="/Dashboard/All"
          element={<LabRequests requestType="All" />}
        />
        {statuses.map(({ name }) => (
          <Route
            key={name}
            path={`/Dashboard/All/${name}`}
            element={<LabRequests status={name} requestType="All" />}
          />
        ))}
        {/* Outpatient */}
        <Route
          path="/Dashboard/Outpatient"
          element={<LabRequests requestType="Outpatient" />}
        />
        {statuses.map(({ name }) => (
          <Route
            key={name}
            element={<LabRequests status={name} requestType="Outpatient" />}
            path={`/Dashboard/Outpatient/${name}`}
          />
        ))}
        <Route
          path="/Dashboard/Outpatient/Lab-Request/:LaboratoryNo?"
          element={<LaboratoryEvaluationCard />}
        />
        {/* Walk In */}
        <Route
          path="/Dashboard/Walk-In"
          element={<LabRequests requestType="Walk-In" />}
        />
        {statuses.map(({ name }) => (
          <Route
            key={name}
            element={<LabRequests status={name} requestType="Walk-In" />}
            path={`/Dashboard/Walk-In/${name}`}
          />
        ))}
        <Route
          path="/Dashboard/Walk-In/Lab-Header/:LaboratoryNo?"
          element={<LaboratoryEvaluationCard />}
        />
        {/* Inpatient */}
        <Route
          path="/Dashboard/Inpatient"
          element={<LabRequests requestType="Inpatient" />}
        />
        {statuses.map(({ name }) => (
          <Route
            key={name}
            element={<LabRequests status={name} requestType="Inpatient" />}
            path={`/Dashboard/Inpatient/${name}`}
          />
        ))}
        <Route
          path="/Dashboard/Inpatient/Lab-Request/:LaboratoryNo?"
          element={<LaboratoryEvaluationCard />}
        />
      </Route>
    </Route>
  );
}
