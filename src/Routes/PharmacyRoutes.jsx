import { Route } from 'react-router-dom';

import ViewProfile from '../Auth/ViewProfile';
import MainLayout from '../Layouts/MainLayout';
import PrivateRoute from '../private/PrivateRoute';
import {
  AppstoreOutlined,
  SignatureOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import PharmacyCard from '../pages/pharmacy-views/PharmacyCard';
import PharmacyWalkIn from '../pages/pharmacy-views/PharmacyWalkIn.jsx';
import PharmacyInpatient from '../pages/pharmacy-views/PharmacyInpatient';
import PharmacyDashboard from '../pages/pharmacy-views/PhamarcyDashboard';
import PharmacyOutpatient from '../pages/pharmacy-views/PharmacyOutpatient';
import PharmacyHistoryList from '../pages/pharmacy-views/PharmacyHistoryList';
import PharmacyListReturnLines from '../pages/pharmacy-views/PharmacyListReturnLines';

export const pharmacyRoutes = [
  {
    key: '/Pharmacy',
    icon: <AppstoreOutlined style={{ color: '#fff' }} />,
    label: 'Dashboard',
  },
  {
    key: '/Pharmacy/Pharmacy-OutPatient',
    label: 'Pharmacy Outpatient',
    icon: <SignatureOutlined style={{ color: '#fff' }} />,
  },
  {
    key: '/Pharmacy/Pharmacy-Inpatient',
    label: 'Pharmacy Inpatient',
    icon: <SignatureOutlined style={{ color: '#fff' }} />,
  },
  {
    key: '/Pharmacy/Pharmacy-WalkIn',
    label: 'Pharmacy Walk In',
    icon: <SolutionOutlined style={{ color: '#fff' }} />,
  },
];

export default function PharmacyRoutes() {
  return (
    <Route element={<PrivateRoute allowedDepartments={['Pharmacy']} />}>
      <Route
        path="/Pharmacy"
        element={<MainLayout />}
      >
        <Route
          index
          element={<PharmacyDashboard />}
        />
        <Route
          path="/Pharmacy/Pharmacy-OutPatient"
          element={<PharmacyOutpatient />}
        />
        <Route
          path="/Pharmacy/Pharmacy-Inpatient"
          element={<PharmacyInpatient />}
        />
        <Route
          path="/Pharmacy/Pharmacy-WalkIn"
          element={<PharmacyWalkIn />}
        />
        <Route
          path="/Pharmacy/Pharmacy-Card"
          element={<PharmacyCard />}
        />
        <Route
          path="/Pharmacy/Pharmacy-Returns"
          element={<PharmacyListReturnLines />}
        />
        <Route
          path="/Pharmacy/Pharmacy-History"
          element={<PharmacyHistoryList />}
        />
        <Route
          path="view-profile"
          element={<ViewProfile />}
        />
      </Route>
    </Route>
  );
}
