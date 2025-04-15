import { Route } from 'react-router-dom';

import {
  AppstoreOutlined,
  CalendarOutlined,
  ExperimentOutlined,
  FileAddOutlined,
  HistoryOutlined,
  MedicineBoxOutlined,
  RadarChartOutlined,
  TeamOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import { FaUserFriends } from 'react-icons/fa';

import ViewProfile from '../Auth/ViewProfile';
import MainLayout from '../Layouts/MainLayout';
import PrivateRoute from '../private/PrivateRoute';
import Inpatient from '../pages/nurse-view/Inpatient';
import ReadDoctorNotes from '../pages/ReadDoctorNotes';
import TreatmentCard from '../pages/nurse-view/TreatmentCard';
import DoctorVisits from '../pages/doctorsViews/DoctorVisits';
import InpatientCard from '../pages/nurse-view/InpatientCard';
import DischargeList from '../pages/nurse-view/DischargeList';
import ReadNurseNotes from '../pages/nurse-view/ReadNurseNotes';
import PharmacyCard from '../pages/pharmacy-views/PharmacyCard';
import PastDoctorVisit from '../pages/nurse-view/PastDoctorVisit';
import DoctorDashboard from '../pages/doctorsViews/DoctorDashboard';
import EncounterSummery from '../pages/doctorsViews/EncounterSummery';
import DischargeRequests from '../pages/nurse-view/DischargeRequests';
import PhamarcyDashboard from '../pages/pharmacy-views/PhamarcyDashboard';
import CloseList from '../pages/doctorsViews/tables/ClosedDocctorVisits';
import PharmacyInpatient from '../pages/pharmacy-views/PharmacyInpatient';
import PharmacyOutpatient from '../pages/pharmacy-views/PharmacyOutpatient';
import PharmacyHistoryList from '../pages/pharmacy-views/PharmacyHistoryList';
import EncounterSummeryDetails from '../pages/nurse-view/EncounterSummeryDetails';
import PharmacyListReturnLines from '../pages/pharmacy-views/PharmacyListReturnLines';
import AdmittedPatients from '../pages/doctorsViews/DocAdmission-views/AdmittedPatients';
import DoctorAdmissions from '../pages/doctorsViews/DocAdmission-views/DoctorAdmissions';
import VerifiedAdmission from '../pages/doctorsViews/DocAdmission-views/VerifiedAdmission';
import ConsultationRoomPatients from '../pages/doctorsViews/tables/ConsultationRoomPatients';
import RadiologyOutPatient from '../pages/doctorsViews/tables/Radiology/RadiologyOutPatient';
import ConsultationRoomEvalutionCard from '../pages/doctorsViews/ConsultationRoomEvalutionCard';

export const doctorRoutes = (role) => [
  {
    key: '/Doctor',
    icon: <AppstoreOutlined style={{ color: '#fff' }} />,
    label: 'Dashboard',
  },
  {
    key: 'patient-list',
    icon: <FaUserFriends style={{ color: '#fff' }} />,
    label: 'Patients',
    children: [
      {
        key: '/Doctor/Consultation-List',
        label: 'OutPatients',
        icon: <TeamOutlined style={{ color: '#fff' }} />,
      },
      ...(role === 'Doctor'
        ? [
            {
              key: '/Doctor/Inpatient',
              label: 'In-Patient List',
              icon: <UserSwitchOutlined style={{ color: '#fff' }} />,
            },
            {
              key: '/Doctor/Admissions',
              label: 'Admissions',
              icon: <FileAddOutlined style={{ color: '#fff' }} />,
            },
          ]
        : []),
      {
        key: '/Doctor/Past-doctor-visit',
        label: 'Past Doctor Visits',
        icon: <HistoryOutlined style={{ color: '#fff' }} />,
      },
    ],
  },
  {
    key: '/doctor/discharge',
    icon: <MedicineBoxOutlined style={{ color: '#fff' }} />,
    label: 'Discharge List',
    children: [
      {
        key: '/Doctor/Discharge-requests',
        label: 'Discharge Requests',
        icon: <CalendarOutlined style={{ color: '#fff' }} />,
      },
      {
        key: '/Doctor/Discharge-list',
        label: 'Discharges List',
        icon: <CalendarOutlined style={{ color: '#fff' }} />,
      },
    ],
  },
  ...(role === 'Doctor'
    ? [
        {
          key: '/doctor/radiology',
          icon: <RadarChartOutlined style={{ color: '#fff' }} />,
          label: 'Radiology',
          children: [
            {
              key: '/Doctor/Radiology-Patients',
              label: 'Radiology List OutPatient',
              icon: <CalendarOutlined style={{ color: '#fff' }} />,
            },
          ],
        },
        {
          key: '/doctor/lab',
          icon: <ExperimentOutlined style={{ color: '#fff' }} />,
          label: 'Lab',
          children: [
            {
              key: '/Doctor/Lab-Patients',
              label: 'Laoratory OutPatient',
              icon: <CalendarOutlined style={{ color: '#fff' }} />,
            },
          ],
        },
        {
          key: '/doctor/pharmacy',
          icon: <MedicineBoxOutlined style={{ color: '#fff' }} />,
          label: 'Pharmacy',
          children: [
            {
              key: '/Doctor/Pharmacy-Dashboard',
              label: 'Dashboard',
              icon: <AppstoreOutlined style={{ color: '#fff' }} />,
            },
            {
              key: '/Doctor/Pharmacy-OutPatient',
              label: 'Pharmacy List OutPatient',
              icon: <CalendarOutlined style={{ color: '#fff' }} />,
            },
            {
              key: '/Doctor/Pharmacy-Inpatient',
              label: 'Pharmacy List InPatient',
              icon: <CalendarOutlined style={{ color: '#fff' }} />,
            },

            {
              key: '/Doctor/Pharmacy-Returns',
              label: 'Pharmacy List Returns',
              icon: <CalendarOutlined style={{ color: '#fff' }} />,
            },
            {
              key: '/Doctor/Pharmacy-History',
              label: 'Pharmacy History',
              icon: <HistoryOutlined style={{ color: '#fff' }} />,
            },
          ],
        },
      ]
    : []),
];

export default function DoctorRoutes() {
  return (
    <Route element={<PrivateRoute allowedDepartments={['Doctor']} />}>
      <Route
        path="/Doctor"
        element={<MainLayout />}
      >
        <Route
          index
          element={<DoctorDashboard />}
        />
        <Route
          path="/Doctor/Consultation-List"
          element={<DoctorVisits />}
        />
        <Route
          path="/Doctor/ClosedConsultationList"
          element={<CloseList />}
        />
        <Route
          path="/Doctor/PendingConsultationList"
          element={<ConsultationRoomPatients />}
        />

        <Route
          path="/Doctor/Consultation-List/Patient"
          element={<ConsultationRoomEvalutionCard />}
        />
        <Route
          path="/Doctor/Inpatient"
          element={<Inpatient />}
        />
        <Route
          path="/Doctor/Inpatient/Patient-card"
          element={<InpatientCard />}
        />
        <Route
          path="/Doctor/Admissions"
          element={<DoctorAdmissions />}
        />
        <Route
          path="/Doctor/Discharge-list"
          element={<DischargeList />}
        />
        <Route
          path="/Doctor/Discharge-requests"
          element={<DischargeRequests />}
        />
        <Route
          path="/Doctor/Past-doctor-visit"
          element={<PastDoctorVisit />}
        />
        <Route
          path="/Doctor/Past-doctor-visit/Patient"
          element={<TreatmentCard />}
        />
        <Route
          path="/Doctor/Past-doctor-visit/Encounter"
          element={<EncounterSummeryDetails />}
        />
        <Route
          path="/Doctor/Inpatient/Read-nurse-notes"
          element={<ReadNurseNotes />}
        />
        <Route
          path="/Doctor/Past-doctor-visit/Patient"
          element={<TreatmentCard />}
        />
        <Route
          path="/Doctor/Radiology-Patients"
          element={<RadiologyOutPatient />}
        />

        <Route
          path="/Doctor/Approved-Admissions"
          element={<VerifiedAdmission />}
        />
        <Route
          path="/Doctor/Admitted-Patients"
          element={<AdmittedPatients />}
        />
        <Route
          path="/Doctor/Pharmacy-Dashboard"
          element={<PhamarcyDashboard />}
        />
        <Route
          path="/Doctor/Pharmacy-OutPatient"
          element={<PharmacyOutpatient />}
        />
        <Route
          path="/Doctor/Pharmacy-Inpatient"
          element={<PharmacyInpatient />}
        />
        <Route
          path="/Doctor/Pharmacy-Card"
          element={<PharmacyCard />}
        />
        <Route
          path="/Doctor/Pharmacy-Returns"
          element={<PharmacyListReturnLines />}
        />
        <Route
          path="/Doctor/Pharmacy-History"
          element={<PharmacyHistoryList />}
        />
        <Route
          path="/Doctor/Consultation/Read-Doctor-Dotes"
          element={<ReadDoctorNotes />}
        />
        <Route
          path="/Doctor/Consultation-List/Encounter"
          element={<EncounterSummery />}
        />
        <Route
          path="view-profile"
          element={<ViewProfile />}
        />
      </Route>
    </Route>
  );
}
