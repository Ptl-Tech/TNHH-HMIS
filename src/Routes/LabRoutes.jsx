import { Route } from 'react-router-dom';
import MainLayout from '../Layouts/MainLayout';

import { AppstoreOutlined, CalendarOutlined } from '@ant-design/icons';

import PrivateRoute from '../private/PrivateRoute';
import LabDashboard from '../Dashboards/LabDashboard';
import LabOutPatient from '../pages/doctorsViews/tables/lab/LabOutPatient';
import LaboratoryEvaluationCard from '../pages/doctorsViews/tables/lab/LaboratoryEvaluationCard';

// Define the menu items
export const labRoutes = [
  {
    key: '/Lab',
    icon: <AppstoreOutlined style={{ color: '#fff' }} />,
    label: 'Dashboard',
  },
  {
    key: '/Lab/Lab-Patients',
    label: 'Lab List OutPatient',
    icon: <CalendarOutlined style={{ color: '#fff' }} />,
  },
];

export default function LabRoutes() {
  return (
    <>
      <Route element={<PrivateRoute allowedDepartments={['LABORATORY']} />}>
        <Route
          path="/Lab"
          element={<MainLayout />}
        >
          <Route
            index
            element={<LabDashboard />}
          />
          <Route
            path="/Lab/Lab-Patients"
            element={<LabOutPatient />}
          />
          <Route
            path="/Lab/Patient/:LaboratoryNo?"
            element={<LaboratoryEvaluationCard />}
          />
        </Route>
      </Route>
    </>
  );
}
