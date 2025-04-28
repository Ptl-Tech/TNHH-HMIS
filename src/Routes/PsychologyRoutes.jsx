import { Route } from 'react-router-dom';

import {
  AppstoreOutlined,
  CalendarOutlined,
  TeamOutlined,
  UserSwitchOutlined,
  HistoryOutlined,
  MedicineBoxOutlined,
  ExperimentOutlined,
  RadarChartOutlined,
} from '@ant-design/icons';
import { FaUserFriends } from 'react-icons/fa';

import ViewProfile from '../Auth/ViewProfile';
import MainLayout from '../Layouts/MainLayout';
import PrivateRoute from '../private/PrivateRoute';
import Inpatient from '../pages/nurse-view/Inpatient';
import ReadDoctorNotes from '../pages/ReadDoctorNotes';
import DoctorVisits from '../pages/doctorsViews/DoctorVisits';
import TreatmentCard from '../pages/nurse-view/TreatmentCard';
import InpatientCard from '../pages/nurse-view/InpatientCard';
import DischargeList from '../pages/nurse-view/DischargeList';
import ReadNurseNotes from '../pages/nurse-view/ReadNurseNotes';
import PharmacyCard from '../pages/pharmacy-views/PharmacyCard';
import PastDoctorVisit from '../pages/nurse-view/PastDoctorVisit';
import DoctorDashboard from '../pages/doctorsViews/DoctorDashboard';
import EncounterSummery from '../pages/doctorsViews/EncounterSummery';
import DischargeRequests from '../pages/nurse-view/DischargeRequests';
import CloseList from '../pages/doctorsViews/tables/ClosedDocctorVisits';
import PharmacyInpatient from '../pages/pharmacy-views/PharmacyInpatient';
import PharmacyOutpatient from '../pages/pharmacy-views/PharmacyOutpatient';
import PharmacyHistoryList from '../pages/pharmacy-views/PharmacyHistoryList';
import EncounterSummeryDetails from '../pages/nurse-view/EncounterSummeryDetails';
import PharmacyListReturnLines from '../pages/pharmacy-views/PharmacyListReturnLines';
import AdmittedPatients from '../pages/doctorsViews/DocAdmission-views/AdmittedPatients';
import DoctorAdmissions from '../pages/doctorsViews/DocAdmission-views/DoctorAdmissions';
import VerifiedAdmission from '../pages/doctorsViews/DocAdmission-views/VerifiedAdmission';
import RadiologyOutPatient from '../pages/doctorsViews/tables/Radiology/RadiologyOutPatient';
import ConsultationRoomPatients from '../pages/doctorsViews/tables/ConsultationRoomPatients';
import ConsultationRoomEvalutionCard from '../pages/doctorsViews/ConsultationRoomEvalutionCard';

export const psychologyRoutes = (role) => [
  {
    key: '/Psychology',
    icon: <AppstoreOutlined style={{ color: '#fff' }} />,
    label: 'Dashboard',
  },

  {
    key: 'patient-list',
    icon: <FaUserFriends style={{ color: '#fff' }} />,
    label: 'Patients',
    children: [
      {
        key: '/Psychology/Consultation-List',
        label: 'OutPatients',
        icon: <TeamOutlined style={{ color: '#fff' }} />,
      },
      ...(role === 'Psychology'
        ? [
            {
              key: '/Psychology/Inpatient',
              label: 'In-Patient List',
              icon: <UserSwitchOutlined style={{ color: '#fff' }} />,
            },
          ]
        : []),
      {
        key: '/Psychology/Past-doctor-visit',
        label: 'Past Doctor Visits',
        icon: <HistoryOutlined style={{ color: '#fff' }} />,
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
              key: '/Psychology/Radiology-Patients',
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
              key: '/Psychology/Lab-Patients',
              label: 'Labortory OutPatient',
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
              key: '/Psychology/Pharmacy-OutPatient',
              label: 'Pharmacy List OutPatient',
              icon: <CalendarOutlined style={{ color: '#fff' }} />,
            },
            {
              key: '/Psychology/Pharmacy-Inpatient',
              label: 'Pharmacy List InPatient',
              icon: <CalendarOutlined style={{ color: '#fff' }} />,
            },

            {
              key: '/Psychology/Pharmacy-Returns',
              label: 'Pharmacy List Returns',
              icon: <CalendarOutlined style={{ color: '#fff' }} />,
            },
            {
              key: '/Psychology/Pharmacy-History',
              label: 'Pharmacy History',
              icon: <HistoryOutlined style={{ color: '#fff' }} />,
            },
          ],
        },
      ]
    : []),
];

export default function PsychologyRoutes() {
  return (
    <Route element={<PrivateRoute allowedDepartments={['Psychology']} />}>
      <Route
        path="/Psychology"
        element={<MainLayout />}
      >
        <Route
          index
          element={<DoctorDashboard />}
        />
        <Route
          path="/Psychology/Consultation-List"
          element={<DoctorVisits />}
        />
        <Route
          path="/Psychology/ClosedConsultationList"
          element={<CloseList />}
        />
        <Route
          path="/Psychology/PendingConsultationList"
          element={<ConsultationRoomPatients />}
        />

        <Route
          path="/Psychology/Consultation-List/Patient"
          element={<ConsultationRoomEvalutionCard />}
        />
        <Route
          path="/Psychology/Inpatient"
          element={<Inpatient />}
        />
        <Route
          path="/Psychology/Inpatient/Patient-card"
          element={<InpatientCard />}
        />
        <Route
          path="/Psychology/Admissions"
          element={<DoctorAdmissions />}
        />
        <Route
          path="/Psychology/Discharge-list"
          element={<DischargeList />}
        />
        <Route
          path="/Psychology/Discharge-requests"
          element={<DischargeRequests />}
        />
        <Route
          path="/Psychology/Past-doctor-visit"
          element={<PastDoctorVisit />}
        />
        <Route
          path="/Psychology/Consultation-List/Encounter"
          element={<EncounterSummery />}
        />
        <Route
          path="/Psychology/Past-doctor-visit/Patient"
          element={<TreatmentCard />}
        />
        <Route
          path="/Psychology/Inpatient/Read-nurse-notes"
          element={<ReadNurseNotes />}
        />
        <Route
          path="/Psychology/Past-doctor-visit/Encounter"
          element={<EncounterSummeryDetails />}
        />
        <Route
          path="/Psychology/Radiology-Patients"
          element={<RadiologyOutPatient />}
        />
        <Route
          path="/Psychology/Approved-Admissions"
          element={<VerifiedAdmission />}
        />
        <Route
          path="/Psychology/Admitted-Patients"
          element={<AdmittedPatients />}
        />
        <Route
          path="/Psychology/Pharmacy-OutPatient"
          element={<PharmacyOutpatient />}
        />
        <Route
          path="/Psychology/Pharmacy-Inpatient"
          element={<PharmacyInpatient />}
        />
        <Route
          path="/Psychology/Pharmacy-Card"
          element={<PharmacyCard />}
        />
        <Route
          path="/Psychology/Pharmacy-Returns"
          element={<PharmacyListReturnLines />}
        />
        <Route
          path="/Psychology/Pharmacy-History"
          element={<PharmacyHistoryList />}
        />
        <Route
          path="/Psychology/Consultation/Read-Doctor-Dotes"
          element={<ReadDoctorNotes />}
        />
        <Route
          path="view-profile"
          element={<ViewProfile />}
        />
      </Route>
    </Route>
  );
}
