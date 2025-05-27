import { Route } from 'react-router-dom';

import ViewProfile from '../Auth/ViewProfile';
import MainLayout from '../Layouts/MainLayout';
import PrivateRoute from '../private/PrivateRoute';

import {
  FaBedPulse,
  FaBoxArchive,
  FaHouseMedical,
  FaPrescription,
  FaPersonWalking,
  FaClockRotateLeft,
  FaPersonWalkingArrowRight,
} from 'react-icons/fa6';
import { GiPayMoney } from 'react-icons/gi';

import PharmacyCard from '../pages/pharmacy-views/PharmacyCard';
import PharmacyWalkIn from '../pages/pharmacy-views/PharmacyWalkIn.jsx';
import PharmacyInpatient from '../pages/pharmacy-views/PharmacyInpatient';
import PharmacyDashboard from '../pages/pharmacy-views/PhamarcyDashboard';
import PharmacyHistory from '../pages/pharmacy-views/PharmacyHistory.jsx';
import PharmacyArchived from '../pages/pharmacy-views/PharmacyArchived.jsx';
import PharmacyOutpatient from '../pages/pharmacy-views/PharmacyOutpatient';
import PharmacyHistoryList from '../pages/pharmacy-views/PharmacyHistoryList';
import PharmacyQuotation from '../pages/pharmacy-views/PharmacyQuotation';
import PharmacyListReturnLines from '../pages/pharmacy-views/PharmacyListReturnLines';

export const pharmacyRoutes = [
  {
    key: '/Pharmacy',
    icon: <FaHouseMedical style={{ color: '#fff' }} />,
    label: 'Dashboard',
  },
  {
    key: '/Pharmacy/All-Records',
    label: 'Pharmacy',
    icon: <FaPrescription style={{ color: '#fff' }} />,
    children: [
      {
        key: '/Pharmacy/History-Records?status=Completed',
        label: 'Pharmacy History',
        icon: <FaClockRotateLeft style={{ color: '#fff' }} />,
      },
      {
        key: '/Pharmacy/Archived-Records?status=Cancelled',
        label: 'Cancelled Prescriptions',
        icon: <FaBoxArchive style={{ color: '#fff' }} />,
      },
    ],
  },
  {
    key: '/Pharmacy/Pharmacy-OutPatient',
    label: 'Pharmacy Outpatient',
    icon: <FaPersonWalkingArrowRight style={{ color: '#fff' }} />,
  },
  {
    key: '/Pharmacy/Pharmacy-InPatient',
    label: 'Pharmacy Inpatient',
    icon: <FaBedPulse style={{ color: '#fff' }} />,
  },
  {
    key: '/Pharmacy/Pharmacy-WalkIn',
    label: 'Pharmacy Walk In',
    icon: <FaPersonWalking style={{ color: '#fff' }} />,
  },
  {
    key: '/Pharmacy/Pharmacy-Quotation',
    label: 'Pharmacy Quotation',
    icon: <GiPayMoney style={{ color: '#fff' }} />,
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
          path="/Pharmacy/History-Records"
          element={<PharmacyHistory />}
        />
        <Route
          path="/Pharmacy/Archived-Records"
          element={<PharmacyArchived />}
        />
        <Route
          path="/Pharmacy/Pharmacy-OutPatient"
          element={<PharmacyOutpatient />}
        />
        <Route
          path="/Pharmacy/Pharmacy-InPatient"
          element={<PharmacyInpatient />}
        />
        <Route
          path="/Pharmacy/Pharmacy-WalkIn"
          element={<PharmacyWalkIn />}
        />
        <Route
          path="/Pharmacy/Pharmacy-Quotation"
          element={<PharmacyQuotation />}
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
