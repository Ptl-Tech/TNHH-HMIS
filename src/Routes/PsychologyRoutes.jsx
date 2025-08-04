import { Route } from "react-router-dom";

import {
  AppstoreOutlined,
  CalendarOutlined,
  TeamOutlined,
  UserSwitchOutlined,
  HistoryOutlined,
  MedicineBoxOutlined,
  ExperimentOutlined,
  RadarChartOutlined,
} from "@ant-design/icons";
import { FaUserFriends } from "react-icons/fa";

import MainLayout from "../Layouts/MainLayout";
import PrivateRoute from "../private/PrivateRoute";
import Inpatient from "../pages/nurse-view/Inpatient";
import ReadDoctorNotes from "../pages/ReadDoctorNotes";
import DoctorVisits from "../pages/doctorsViews/DoctorVisits";
import TreatmentCard from "../pages/nurse-view/TreatmentCard";
import InpatientCard from "../pages/nurse-view/InpatientCard";
import DischargeList from "../pages/nurse-view/DischargeList";
import ReadNurseNotes from "../pages/nurse-view/ReadNurseNotes";
import PharmacyCard from "../pages/pharmacy-views/PharmacyCard";
import PastDoctorVisit from "../pages/nurse-view/PastDoctorVisit";
import DoctorDashboard from "../pages/doctorsViews/DoctorDashboard";
import EncounterSummery from "../pages/doctorsViews/EncounterSummery";
import DischargeRequests from "../pages/nurse-view/DischargeRequests";
import CloseList from "../pages/doctorsViews/tables/ClosedDocctorVisits";
import PharmacyInpatient from "../pages/pharmacy-views/PharmacyInpatient";
import PharmacyOutpatient from "../pages/pharmacy-views/PharmacyOutpatient";
import PharmacyHistoryList from "../pages/pharmacy-views/PharmacyHistoryList";
import EncounterSummeryDetails from "../pages/nurse-view/EncounterSummeryDetails";
import PharmacyListReturnLines from "../pages/pharmacy-views/PharmacyListReturnLines";
import AdmittedPatients from "../pages/doctorsViews/DocAdmission-views/AdmittedPatients";
import DoctorAdmissions from "../pages/doctorsViews/DocAdmission-views/DoctorAdmissions";
import VerifiedAdmission from "../pages/doctorsViews/DocAdmission-views/VerifiedAdmission";
import RadiologyOutPatient from "../pages/doctorsViews/tables/Radiology/RadiologyOutPatient";
import ConsultationRoomPatients from "../pages/doctorsViews/tables/ConsultationRoomPatients";
import ConsultationRoomEvalutionCard from "../pages/doctorsViews/ConsultationRoomEvalutionCard";

export const psychologyRoutes = [
  {
    key: "/Dashboard",
    icon: <AppstoreOutlined style={{ color: "#fff" }} />,
    label: "Dashboard",
  },
  {
    key: "/Dashboard/patient-list",
    icon: <FaUserFriends style={{ color: "#fff" }} />,
    label: "Patients",
    children: [
      {
        key: "/Dashboard/Consultation-List",
        label: "OutPatients",
        icon: <TeamOutlined style={{ color: "#fff" }} />,
      },
      {
        key: "/Dashboard/Inpatient",
        label: "In-Patient List",
        icon: <UserSwitchOutlined style={{ color: "#fff" }} />,
      },
      {
        key: "/Dashboard/Past-doctor-visit",
        label: "Past Doctor Visits",
        icon: <HistoryOutlined style={{ color: "#fff" }} />,
      },
    ],
  },
  {
    key: "/Dashboard/radiology",
    icon: <RadarChartOutlined style={{ color: "#fff" }} />,
    label: "Radiology",
    children: [
      {
        key: "/Dashboard/Radiology-Patients",
        label: "Radiology List OutPatient",
        icon: <CalendarOutlined style={{ color: "#fff" }} />,
      },
    ],
  },
  {
    key: "/Dashboard/lab",
    icon: <ExperimentOutlined style={{ color: "#fff" }} />,
    label: "Lab",
    children: [
      {
        key: "/Dashboard/Lab-Patients",
        label: "Labortory OutPatient",
        icon: <CalendarOutlined style={{ color: "#fff" }} />,
      },
    ],
  },
  {
    key: "/Dashboard/pharmacy",
    icon: <MedicineBoxOutlined style={{ color: "#fff" }} />,
    label: "Pharmacy",
    children: [
      {
        key: "/Dashboard/Pharmacy-OutPatient",
        label: "Pharmacy List OutPatient",
        icon: <CalendarOutlined style={{ color: "#fff" }} />,
      },
      {
        key: "/Dashboard/Pharmacy-Inpatient",
        label: "Pharmacy List InPatient",
        icon: <CalendarOutlined style={{ color: "#fff" }} />,
      },

      {
        key: "/Dashboard/Pharmacy-Returns",
        label: "Pharmacy List Returns",
        icon: <CalendarOutlined style={{ color: "#fff" }} />,
      },
      {
        key: "/Dashboard/Pharmacy-History",
        label: "Pharmacy History",
        icon: <HistoryOutlined style={{ color: "#fff" }} />,
      },
    ],
  },
];

export default function PsychologyRoutes() {
  return (
    <Route
      element={
        <PrivateRoute permission={"read"} resource={"psychologyNavigation"} />
      }
    >
      <Route path="/Dashboard" element={<MainLayout />}>
        <Route index element={<DoctorDashboard />} />
        <Route path="/Dashboard/Consultation-List" element={<DoctorVisits />} />
        <Route
          path="/Dashboard/ClosedConsultationList"
          element={<CloseList />}
        />
        <Route
          path="/Dashboard/PendingConsultationList"
          element={<ConsultationRoomPatients />}
        />

        <Route
          path="/Dashboard/Consultation-List/Patient"
          element={<ConsultationRoomEvalutionCard />}
        />
        <Route path="/Dashboard/Inpatient" element={<Inpatient />} />
        <Route
          path="/Dashboard/Inpatient/Patient-card"
          element={<InpatientCard />}
        />
        <Route path="/Dashboard/Admissions" element={<DoctorAdmissions />} />
        <Route path="/Dashboard/Discharge-list" element={<DischargeList />} />
        <Route
          path="/Dashboard/Discharge-requests"
          element={<DischargeRequests />}
        />
        <Route
          path="/Dashboard/Past-doctor-visit"
          element={<PastDoctorVisit />}
        />
        <Route
          path="/Dashboard/Consultation-List/Encounter"
          element={<EncounterSummery />}
        />
        <Route
          path="/Dashboard/Past-doctor-visit/Patient"
          element={<TreatmentCard />}
        />
        <Route
          path="/Dashboard/Inpatient/Read-nurse-notes"
          element={<ReadNurseNotes />}
        />
        <Route
          path="/Dashboard/Past-doctor-visit/Encounter"
          element={<EncounterSummeryDetails />}
        />
        <Route
          path="/Dashboard/Radiology-Patients"
          element={<RadiologyOutPatient />}
        />
        <Route
          path="/Dashboard/Approved-Admissions"
          element={<VerifiedAdmission />}
        />
        <Route
          path="/Dashboard/Admitted-Patients"
          element={<AdmittedPatients />}
        />
        <Route
          path="/Dashboard/Pharmacy-OutPatient"
          element={<PharmacyOutpatient />}
        />
        <Route
          path="/Dashboard/Pharmacy-Inpatient"
          element={<PharmacyInpatient />}
        />
        <Route path="/Dashboard/Pharmacy-Card" element={<PharmacyCard />} />
        <Route
          path="/Dashboard/Pharmacy-Returns"
          element={<PharmacyListReturnLines />}
        />
        <Route
          path="/Dashboard/Pharmacy-History"
          element={<PharmacyHistoryList />}
        />
        <Route
          path="/Dashboard/Consultation/Read-Doctor-Dotes"
          element={<ReadDoctorNotes />}
        />
      </Route>
    </Route>
  );
}
