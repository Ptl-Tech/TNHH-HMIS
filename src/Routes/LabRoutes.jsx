import { Route } from 'react-router-dom';
import MainLayout from '../Layouts/MainLayout';

import {
  AppstoreOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoginOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
  SendOutlined,
  UndoOutlined,
  UserOutlined,
} from '@ant-design/icons';

import PrivateRoute from '../private/PrivateRoute';
import LabDashboard from '../Dashboards/LabDashboard';
import LabRequests from '../pages/doctorsViews/tables/lab/LabRequests';
import LabWalkInPatients from '../pages/doctorsViews/tables/lab/LabWalkInPatients';
import LaboratoryEvaluationCard from '../pages/doctorsViews/tables/lab/LaboratoryEvaluationCard';

const statuses = [
  { name: 'Forwaded', icon: <SendOutlined /> },
  {
    name: 'Review',
    icon: <QuestionCircleOutlined style={{ color: '#fff' }} />,
  },
  {
    name: 'Completed',
    icon: <CheckCircleOutlined style={{ color: '#fff' }} />,
  },
  { name: 'Recalled', icon: <UndoOutlined style={{ color: '#fff' }} /> },
  {
    name: 'Cancelled',
    icon: <CloseCircleOutlined style={{ color: '#fff' }} />,
  },
];

const outPatientStatusLinks = statuses.map(({ name, icon }) => ({
  key: `/Lab/Lab-Outpatient/${name}`,
  label: `${name} Laboratory Outpatient`,
  icon,
}));

const inPatientStatusLinks = statuses.map(({ name, icon }) => ({
  key: `/Lab/Lab-Inpatient/${name}`,
  label: `${name} Laboratory Inpatient`,
  icon,
}));

// Define the menu items
export const labRoutes = [
  {
    key: '/Lab',
    icon: <AppstoreOutlined style={{ color: '#fff' }} />,
    label: 'Dashboard',
  },
  {
    key: '/Lab/Lab-Outpatient',
    label: 'Laboratory Outpatient',
    icon: <LogoutOutlined style={{ color: '#fff' }} />,
    children: outPatientStatusLinks,
  },
  {
    key: '/Lab/Lab-Inpatient',
    label: 'Laboratory Inpatient',
    icon: <LoginOutlined style={{ color: '#fff' }} />,
    children: inPatientStatusLinks,
  },
  {
    key: '/Lab/Walk-In',
    label: 'Laboratory Walk In',
    icon: <UserOutlined style={{ color: '#fff' }} />,
  },
];

export default function LabRoutes() {
  return (
    <>
      <Route element={<PrivateRoute allowedDepartments={['Laboratory']} />}>
        <Route
          path="/Lab"
          element={<MainLayout />}
        >
          <Route
            index
            element={<LabDashboard />}
          />
          {/* Outpatient */}
          <Route
            path="/Lab/Lab-Outpatient"
            element={<LabRequests />}
          />
          {statuses.map(({ name }) => (
            <Route
              key={name}
              element={<LabRequests status={name} />}
              path={`/Lab/Lab-Outpatient/${name}`}
            />
          ))}
          <Route
            path="/Lab/Lab-Outpatient/Lab-Request/:LaboratoryNo?"
            element={<LaboratoryEvaluationCard />}
          />
          {/* Walk In */}
          <Route
            path="/Lab/Walk-In"
            element={<LabWalkInPatients />}
          />
          <Route
            path="/Lab/Walk-In/Lab-Header/:LaboratoryNo?"
            element={<LaboratoryEvaluationCard />}
          />
          {/* Inpatient */}
          <Route
            path="/Lab/Lab-Inpatient"
            element={<LabRequests inPatient />}
          />
          {statuses.map(({ name }) => (
            <Route
              key={name}
              element={
                <LabRequests
                  inPatient
                  status={name}
                />
              }
              path={`/Lab/Lab-Inpatient/${name}`}
            />
          ))}
          <Route
            path="/Lab/Lab-Inpatient/Lab-Request/:LaboratoryNo?"
            element={<LaboratoryEvaluationCard />}
          />
        </Route>
      </Route>
    </>
  );
}
