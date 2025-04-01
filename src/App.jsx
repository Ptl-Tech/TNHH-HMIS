import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Auth/Login';
import Register from './Auth/Register';
import PrivateRoute from './private/PrivateRoute';
import ForgotPwd from './Auth/ForgotPwd';
import ResetPwd from './Auth/ResetPwd';
import ViewProfile from './Auth/ViewProfile';
import MainLayout from './Layouts/MainLayout';
import ReceptionDashboard from './Dashboards/ReceptionDashboard';

import VisitorForm from './pages/security-views/VisitorForm';
import HistoryVisitorList from './pages/HistoryVisitorList';
import TransferBed from './pages/nurse-view/TransferBed ';
import InpatientCard from './pages/nurse-view/InpatientCard';
import TreatmentCard from './pages/nurse-view/TreatmentCard';
import PastDoctorVisit from "./pages/nurse-view/PastDoctorVisit";
import Inpatient from "./pages/nurse-view/Inpatient";
import NurseObservation from "./pages/NurseObservation";
import NurseOutpatientList from "./pages/NurseOutpatientList";
import BedManager from "./pages/BedManager";
import PatientAdmissions from "./pages/PatientAdmissions";
import SecVisitorList from './pages/security-views/SecVisitorList';

import DoctorVisits from "./pages/doctorsViews/DoctorVisits";
import ConsultationRoomEvalutionCard from "./pages/doctorsViews/ConsultationRoomEvalutionCard";
import DoctorDashboard from "./pages/doctorsViews/DoctorDashboard";
import DischargeRequests from "./pages/nurse-view/DischargeRequests";
import AdmissionRequests from "./pages/nurse-view/AdmissionRequests";
import AdmissionRequest from "./pages/nurse-view/AdmissionRequest";
import DischargeList from "./pages/nurse-view/DischargeList";
import RadiologyOutPatient from "./pages/doctorsViews/tables/Radiology/RadiologyOutPatient";
import RadiologyOutPatients from "./pages/doctorsViews/tables/Radiology/RadiologyOutPatients";

import ViewDoctorNotes from "./pages/nurse-view/nurse-patient-file/ViewDoctorNotes";
import PostedConsumables from "./pages/nurse-view/PostedConsumables";

import DoctorAdmissions from "./pages/doctorsViews/DocAdmission-views/DoctorAdmissions";
import VerifiedAdmission from "./pages/doctorsViews/DocAdmission-views/VerifiedAdmission";
import AdmittedPatients from "./pages/doctorsViews/DocAdmission-views/AdmittedPatients";
import PhamarcyDashboard from "./pages/pharmacy-views/PhamarcyDashboard";
import PharmacyCard from "./pages/pharmacy-views/PharmacyCard";
import PharmacyInpatient from "./pages/pharmacy-views/PharmacyInpatient";
import PharmacyListReturnLines from "./pages/pharmacy-views/PharmacyListReturnLines";
import PharmacyHistoryList from "./pages/pharmacy-views/PharmacyHistoryList";
import ReadNurseNotes from "./pages/nurse-view/ReadNurseNotes";
import BedOccupancy from "./pages/nurse-view/BedOccupancy";
import CloseList from "./pages/doctorsViews/tables/ClosedDocctorVisits";
import ReadDoctorNotes from "./pages/ReadDoctorNotes";
import ConsultationRoomPatients from "./pages/doctorsViews/tables/ConsultationRoomPatients";
import RadiologyDashboard from "./Dashboards/RadiologyDashboard";
import ActiveInpatient from "./pages/billing/ActiveInpatient";
import LabRoutes from "./Routes/LabRoutes";
import EncounterSummery from "./pages/doctorsViews/EncounterSummery";
import ReceptionRoutes from "./Routes/ReceptionRoutes";
import PharmacyRoutes from './Routes/PharmacyRoutes';
import PharmacyOutpatient from './pages/pharmacy-views/PharmacyOutpatient';
import EncounterSummeryDetails from "./pages/nurse-view/EncounterSummeryDetails";
import NurseRoutes from './Routes/NurseRoutes';
import PsychologyRoutes from './Routes/PsychologyRoutes';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPwd />} />
      <Route path="/reset-password" element={<ResetPwd />} />
      {ReceptionRoutes()}
      {
        NurseRoutes()
      }
      <Route element={<PrivateRoute allowedDepartments={["Reception"]} />}>
        <Route path="/reception" element={<MainLayout />}>
          <Route index element={<ReceptionDashboard />} />
          <Route path="Consultation-List" element={<DoctorVisits />} />
          <Route path="Admission-requests" element={<AdmissionRequests />} />
          <Route path="Admission-requests/:id" element={<AdmissionRequest />} />
          <Route path="Discharge-requests" element={<DischargeRequests />} />
          <Route path="Inpatient/Doctor-Notes" element={<ViewDoctorNotes />} />
          <Route path="Billing/Inpatients" element={<ActiveInpatient />} />
          <Route
            path="Ward-management/Transfer-bed"
            element={<TransferBed />}
          />
          <Route
            path="Ward-management/Bed-occupancy"
            element={<BedOccupancy />}
          />
          <Route path="Inpatient/Patient-card" element={<InpatientCard />} />
          <Route
            path="Inpatient/Read-nurse-notes"
            element={<ReadNurseNotes />}
          />
          <Route
            path="Consultation-List/Encounter"
            element={<EncounterSummery />}
          />

          <Route path="Observation-Room/:id" element={<NurseObservation />} />
          <Route path="Outpatient-list" element={<NurseOutpatientList />} />
          <Route path="Patient-admissions" element={<PatientAdmissions />} />
          <Route path="BedManagement" element={<BedManager />} />

          <Route path="Discharge-list" element={<DischargeList />} />
          <Route
            path="Discharge-list/Posted-Consumables"
            element={<PostedConsumables />}
          />

          <Route path="view-profile" element={<ViewProfile />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute allowedDepartments={["Doctor"]} />}>
        <Route path="/Doctor" element={<MainLayout />}>
          <Route index element={<DoctorDashboard />} />
          <Route path="/Doctor/Consultation-List" element={<DoctorVisits />} />
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
          <Route path="/Doctor/Inpatient" element={<Inpatient />} />
          <Route
            path="/Doctor/Inpatient/Patient-card"
            element={<InpatientCard />}
          />
          <Route path="/Doctor/Admissions" element={<DoctorAdmissions />} />
          <Route path="/Doctor/Discharge-list" element={<DischargeList />} />
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
          <Route path="/Doctor/Pharmacy-Card" element={<PharmacyCard />} />
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
          <Route path="view-profile" element={<ViewProfile />} />
        </Route>
      </Route>

      {
        PsychologyRoutes()
      }

      <Route element={<PrivateRoute allowedDepartments={["Radiology"]} />}>
        <Route path="/Radiology" element={<MainLayout />}>
          <Route index element={<RadiologyDashboard />} />
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
      {/* Lab routes */}
      {LabRoutes()}
      <Route element={<PrivateRoute allowedDepartments={["Security"]} />}>
  <Route path="/Security" element={<MainLayout />}>
    {/* Set VisitorForm as the default (index) page */}
    <Route index element={<VisitorForm />} />
    <Route path="visitor-form/:visitorNo?" element={<VisitorForm />} />
    <Route path="visitors-list" element={<SecVisitorList />} />
    <Route path="history-list" element={<HistoryVisitorList />} />
  </Route>
</Route>
      {PharmacyRoutes()}
      <Route
        path="*"
        element={<Navigate to="/login" />}
      />
    </Routes>
  );
}

export default App;
