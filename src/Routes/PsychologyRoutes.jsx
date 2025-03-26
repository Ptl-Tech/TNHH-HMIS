import { Route } from "react-router-dom";
import PrivateRoute from "../private/PrivateRoute";
import MainLayout from "../Layouts/MainLayout";
import DoctorDashboard from "../pages/doctorsViews/DoctorDashboard";
import DoctorVisits from "../pages/doctorsViews/DoctorVisits";
import CloseList from "../pages/doctorsViews/tables/ClosedDocctorVisits";
import ConsultationRoomPatients from "../pages/doctorsViews/tables/ConsultationRoomPatients";
import ConsultationRoomEvalutionCard from "../pages/doctorsViews/ConsultationRoomEvalutionCard";
import InpatientCard from "../pages/nurse-view/InpatientCard";
import DoctorAdmissions from "../pages/doctorsViews/DocAdmission-views/DoctorAdmissions";
import DischargeList from "../pages/nurse-view/DischargeList";
import DischargeRequests from "../pages/nurse-view/DischargeRequests";
import PastDoctorVisit from "../pages/nurse-view/PastDoctorVisit";
import EncounterSummery from "../pages/doctorsViews/EncounterSummery";
import ReadNurseNotes from "../pages/nurse-view/ReadNurseNotes";
import EncounterSummeryDetails from "../pages/nurse-view/EncounterSummeryDetails";
import RadiologyOutPatient from "../pages/doctorsViews/tables/Radiology/RadiologyOutPatient";
import VerifiedAdmission from "../pages/doctorsViews/DocAdmission-views/VerifiedAdmission";
import AdmittedPatients from "../pages/doctorsViews/DocAdmission-views/AdmittedPatients";
import PharmacyOutpatient from "../pages/pharmacy-views/PharmacyOutpatient";
import PharmacyInpatient from "../pages/pharmacy-views/PharmacyInpatient";
import PharmacyCard from "../pages/pharmacy-views/PharmacyCard";
import PharmacyListReturnLines from "../pages/pharmacy-views/PharmacyListReturnLines";
import PharmacyHistoryList from "../pages/pharmacy-views/PharmacyHistoryList";
import ReadDoctorNotes from "../pages/ReadDoctorNotes";
import ViewProfile from "../Auth/ViewProfile";
import Inpatient from "../pages/nurse-view/Inpatient";
import TreatmentCard from '../pages/nurse-view/TreatmentCard';


export default function PsychologyRoutes() {
  return (
    <Route element={<PrivateRoute allowedDepartments={["Psychology"]} />}>
        <Route path="/Psychology" element={<MainLayout />}>
          <Route index element={<DoctorDashboard />} />
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
          <Route path="/Psychology/Inpatient" element={<Inpatient />} />
          <Route
            path="/Psychology/Inpatient/Patient-card"
            element={<InpatientCard/>}
          />
          <Route path="/Psychology/Admissions" element={<DoctorAdmissions />} />
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
            element={<TreatmentCard/>}
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
          <Route path="/Psychology/Pharmacy-Card" element={<PharmacyCard />} />
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
          <Route path="view-profile" element={<ViewProfile />} />
        </Route>
      </Route>
    )
  }