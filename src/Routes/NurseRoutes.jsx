import { Route } from "react-router-dom";
import PrivateRoute from "../private/PrivateRoute";
import MainLayout from "../Layouts/MainLayout";
import Dashboard from "../pages/nurse-view/Dashboard";
import PatientRegistration from "../pages/PatientRegistration";
import PastDoctorVisit from "../pages/nurse-view/PastDoctorVisit";
import EncounterSummeryDetails from "../pages/nurse-view/EncounterSummeryDetails";
import TriageList from "../pages/nurse-view/TriageList";
import TriageListPending from "../pages/nurse-view/TriageListPending";
import TriageListClosed from "../pages/nurse-view/TriageListClosed";
import WaitingList from "../pages/WaitingList";
import DoctorVisits from "../pages/doctorsViews/DoctorVisits";
import AdmitPatients from "../pages/nurse-view/AdmitPatients";
import PatientCharges from "../pages/nurse-view/PatientCharges";
import WardManagement from "../pages/nurse-view/WardManagement";
import ReleaseBed from "../pages/nurse-view/ReleaseBed";
import DischargeList from "../pages/nurse-view/DischargeList";
import TransferBed from "../pages/nurse-view/TransferBed ";
import EncounterSummery from "../pages/doctorsViews/EncounterSummery";
import InpatientCard from "../pages/nurse-view/InpatientCard";
import ConsultationRoomPatients from "../pages/doctorsViews/tables/ConsultationRoomPatients";
import CloseList from "../pages/doctorsViews/tables/ClosedDocctorVisits";
import ConsultationRoomEvalutionCard from "../pages/doctorsViews/ConsultationRoomEvalutionCard";
import ReadDoctorNotes from "../pages/ReadDoctorNotes";
import OutpatientList from "../pages/OutpatientList";
import DirectAdmission from "../pages/nurse-view/DirectAdmission";
import ViewProfile from "../Auth/ViewProfile";
import TreatmentCard from "../pages/nurse-view/TreatmentCard";
import ExaminePatientInTriage from "../pages/nurse-view/ExaminePatientInTriage";
import Inpatient from "../pages/nurse-view/Inpatient";
import AdmitPatient from "../pages/nurse-view/forms/nurse-forms/AdmitPatient";
import {
  AppstoreOutlined,
  FileTextOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
  SolutionOutlined,
  ImportOutlined,
  LayoutOutlined,
  RetweetOutlined,
  HistoryOutlined,
  RadiusUprightOutlined,
} from "@ant-design/icons";
import Consumables from "../pages/nurse-view/nurse-patient-file/Consumables";

export const nurseRoutes = [
  {
    key: "/Nurse",
    icon: <AppstoreOutlined style={{ color: "#fff" }} />,
    label: "Dashboard",
  },
  {
    icon: <FileTextOutlined style={{ color: "#fff" }} />,
    label: "Triage",
    children: [
      {
        key: "Triage",
        label: "Triage List",
        icon: <FileTextOutlined style={{ color: "#fff" }} />,
      },
    ],
  },
  {
    icon: <UsergroupAddOutlined style={{ color: "#fff" }} />,
    label: "Patients",
    children: [
      {
        key: "patient-list",
        label: "Patient Registration",
        icon: <UserAddOutlined style={{ color: "#fff" }} />,
      },
      {
        key: "Consultation-List",
        label: "Outpatients List",
        icon: <UserAddOutlined style={{ color: "#fff" }} />,
      },
      {
        key: "Inpatient",
        label: "Inpatients List",
        icon: <UserAddOutlined style={{ color: "#fff" }} />,
      },
    ],
  },
  {
    icon: <SolutionOutlined style={{ color: "#fff" }} />,
    label: "Admissions",
    children: [
      {
        key: "Admit-patient",
        label: "Admit Patient",
        icon: <ImportOutlined style={{ color: "#fff" }} />,
      },
    ],
  },
  {
    icon: <LayoutOutlined style={{ color: "#fff" }} />,
    label: "Ward Management",
    children: [
      {
        key: "Ward-management",
        label: "Manage Wards",
        icon: <LayoutOutlined style={{ color: "#fff" }} />,
      },
    ],
  },
  {
    icon: <RetweetOutlined style={{ color: "#fff" }} />,
    label: "Discharges",
    children: [
      {
        key: "Discharge-list",
        label: "Discharge Patient",
        icon: <HistoryOutlined style={{ color: "#fff" }} />,
      },
    ],
  },
  {
    icon: <RadiusUprightOutlined style={{ color: "#fff" }} />,
    label: "Past Doctor Visits",
    children: [
      {
        key: "Past-doctor-visit",
        label: "Past Doctor Visit List",
        icon: <RadiusUprightOutlined style={{ color: "#fff" }} />,
      },
    ],
  },
];
export default function NurseRoutes() {
  return (
    <Route element={<PrivateRoute allowedDepartments={["Nurse"]} />}>
      <Route path="/Nurse" element={<MainLayout />}>
        <Route index element={<Dashboard />} />

        {/* Routes */}
        <Route path="Patient-Registration" element={<PatientRegistration />} />
        <Route path="Past-doctor-visit" element={<PastDoctorVisit />} />
        <Route path="Past-doctor-visit/Patient" element={<TreatmentCard />} />
        <Route
          path="Past-doctor-visit/Encounter"
          element={<EncounterSummeryDetails />}
        />

        <Route path="Triage" element={<TriageList />} />
        <Route path="PendingTriageList" element={<TriageListPending />} />
        <Route path="ClosedTriageList" element={<TriageListClosed />} />
        <Route path="Triage/Patient" element={<ExaminePatientInTriage />} />
        <Route path="Triage-list" element={<WaitingList />} />
        {/* <Route path="Patient-list" element={<Patientlist />} /> */}
        {/* <Route path="New-Patients" element={<NewPatients />} /> */}

        <Route path="Inpatient" element={<Inpatient />} />
        <Route path="Consultation-List" element={<DoctorVisits />} />
        <Route path="Admit-patient" element={<AdmitPatients />} />
        <Route path="Admit-patient/Patient" element={<AdmitPatient />} />
        <Route path="Admit-patient/Charges" element={<PatientCharges />} />
        <Route path="Ward-management" element={<WardManagement />} />
        <Route path="Ward-management/Release-bed" element={<ReleaseBed />} />
        <Route path="Discharge-list" element={<DischargeList />} />
        <Route path="Discharge-list/Posted-Consumables" element={<Consumables />} />
        <Route path="Ward-management/Transfer-bed" element={<TransferBed />} />
        <Route path="Inpatient/Encounter" element={<EncounterSummery />} />
        <Route path="Inpatient/Patient-card" element={<InpatientCard />} />

        <Route
          path="PendingConsultationList"
          element={<ConsultationRoomPatients />}
        />
        <Route path="ClosedConsultationList" element={<CloseList />} />

        <Route path="OutPatients" element={<DoctorVisits />} />
        <Route
          path="Consultation-List/Patient"
          element={<ConsultationRoomEvalutionCard />}
        />
        <Route
          path="Consultation-List/Read-Doctor-Dotes"
          element={<ReadDoctorNotes />}
        />
        <Route path="Patient-list" element={<OutpatientList />} />
        <Route
          path="Patient-Registration/:PatientNo?"
          element={<PatientRegistration />}
        />
        <Route
          path="patient-list/Direct-Admission/:PatientNo?"
          element={<DirectAdmission />}
        />
        <Route path="view-profile" element={<ViewProfile />} />
      </Route>
    </Route>
  );
}
