import { Route } from 'react-router-dom';

import MainLayout from '../Layouts/MainLayout';
import PrivateRoute from '../private/PrivateRoute';
import RadiologyDashboard from '../Dashboards/RadiologyDashboard';
import RadiologyOutPatient from '../pages/doctorsViews/tables/Radiology/RadiologyOutPatient';
import RadiologyOutPatients from '../pages/doctorsViews/tables/Radiology/RadiologyOutPatients';


export default function RadiologyRoutes() {
  return (
    <Route element={<PrivateRoute allowedDepartments={['Radiology']} />}>
      <Route
        path="/Radiology"
        element={<MainLayout />}
      >
        <Route
          index
          element={<RadiologyDashboard />}
        />
        <Route
          path="/Radiology/Radiology-Patients"
          element={<RadiologyOutPatients />}
        />
        <Route
          path="/Radiology/Radiology-Patient/:radiologyNo?"
          element={<RadiologyOutPatient />}
        />
      </Route>
    </Route>
  );
}
