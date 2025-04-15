import { Route } from 'react-router-dom';
import MainLayout from '../Layouts/MainLayout';

import {
  AppstoreOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  HistoryOutlined,
  LoginOutlined,
  LogoutOutlined,
  PlusCircleOutlined,
  QuestionCircleOutlined,
  SendOutlined,
  SnippetsOutlined,
  UndoOutlined,
  UserOutlined,
} from '@ant-design/icons';

import PrivateRoute from '../private/PrivateRoute';
import LabDashboard from '../Dashboards/LabDashboard';
import LabRequests from '../pages/doctorsViews/tables/lab/LabRequests';
import LaboratoryEvaluationCard from '../pages/doctorsViews/tables/lab/LaboratoryEvaluationCard';

const statuses = [
  { name: 'New', icon: <PlusCircleOutlined /> },
  { name: 'Forwarded', icon: <SendOutlined /> },
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
    name: 'Voided',
    icon: <CloseCircleOutlined style={{ color: '#fff' }} />,
  },
];

const allPatientStatusLinks = statuses.map(({ name, icon }) => ({
  key: `/Lab/All/${name}`,
  label: `All ${name} Requests`,
  icon,
}));

const outPatientStatusLinks = statuses.map(({ name, icon }) => ({
  key: `/Lab/Outpatient/${name}`,
  label: `${name} Laboratory Outpatient`,
  icon,
}));

const inPatientStatusLinks = statuses.map(({ name, icon }) => ({
  key: `/Lab/Inpatient/${name}`,
  label: `${name} Laboratory Inpatient`,
  icon,
}));

const walkInPatientStatusLinks = statuses.map(({ name, icon }) => ({
  key: `/Lab/Walk-In/${name}`,
  label: `${name} Laboratory Walk In`,
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
    key: '/Lab/All',
    label: 'All Laboratory Requests',
    icon: <SnippetsOutlined style={{ color: '#fff' }} />,
    children: allPatientStatusLinks,
  },
  {
    key: '/Lab/Outpatient',
    label: 'Laboratory Outpatient',
    icon: <LogoutOutlined style={{ color: '#fff' }} />,
    children: outPatientStatusLinks,
  },
  {
    key: '/Lab/Inpatient',
    label: 'Laboratory Inpatient',
    icon: <LoginOutlined style={{ color: '#fff' }} />,
    children: inPatientStatusLinks,
  },
  {
    key: '/Lab/Walk-In',
    label: 'Laboratory Walk In',
    icon: <UserOutlined style={{ color: '#fff' }} />,
    children: walkInPatientStatusLinks,
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
          {/* All */}
          <Route
            path="/Lab/All"
            element={<LabRequests requestType="All" />}
          />
          {statuses.map(({ name }) => (
            <Route
              key={name}
              element={
                <LabRequests
                  status={name}
                  requestType="All"
                />
              }
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
              element={
                <LabRequests
                  status={name}
                  requestType="Outpatient"
                />
              }
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
              element={
                <LabRequests
                  status={name}
                  requestType="Walk-In"
                />
              }
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
              element={
                <LabRequests
                  status={name}
                  requestType="Inpatient"
                />
              }
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
