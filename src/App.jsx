import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Auth/Login';
import Register from './Auth/Register';
import PrivateRoute from './private/PrivateRoute';
import PatientRegistration from './pages/PatientRegistration';
import OutpatientList from './pages/OutpatientList';
import InpatientList from './pages/InpatientList';
import ForgotPwd from './Auth/ForgotPwd';
import ResetPwd from './Auth/ResetPwd';
import ViewProfile from './Auth/ViewProfile';
import MainLayout from './Layouts/MainLayout';
import ReceptionDashboard from './Dashboards/ReceptionDashboard';
// import SecurityLayout from "./Layouts/SecurityLayout";
import VisitorList from './pages/VisitorList';
import VisitorForm from './pages/security-views/VisitorForm';
import CreateVisitForm from './pages/CreateVisitForm';

import HistoryVisitorList from './pages/HistoryVisitorList';
import ActiveAppmnts from './pages/ActiveAppmnts';
import CashPatients from './pages/CashPatients';
import InsurancePatients from './pages/InsurancePatients';
import AdmitPatient from './pages/nurse-view/forms/nurse-forms/AdmitPatient';
import PatientCharges from './pages/nurse-view/PatientCharges';
import ReleaseBed from './pages/nurse-view/ReleaseBed';
import TransferBed from './pages/nurse-view/TransferBed ';
import InpatientCard from './pages/nurse-view/InpatientCard';
import TreatmentCard from './pages/nurse-view/TreatmentCard';

// Nurse Department
import Dashboard from './pages/nurse-view/Dashboard';
import PastDoctorVisit from './pages/nurse-view/PastDoctorVisit';
import TriageList from './pages/nurse-view/TriageList';
import ExaminePatientInTriage from './pages/nurse-view/ExaminePatientInTriage';
import TriageListPending from './pages/nurse-view/TriageListPending';
import TriageListClosed from './pages/nurse-view/TriageListClosed';
import AdmitPatients from './pages/nurse-view/AdmitPatients';
import WardManagement from './pages/nurse-view/WardManagement';
import Inpatient from './pages/nurse-view/Inpatient';
import WaitingList from './pages/WaitingList';
// import Patientlist from "./pages/Patientlist";
// import NewPatients from "./pages/NewPatients";
import NurseObservation from './pages/NurseObservation';
import NurseOutpatientList from './pages/NurseOutpatientList';
import BedManager from './pages/BedManager';
import PatientAdmissions from './pages/PatientAdmissions';
import DocOutPatient from './pages/doctorsViews/DoctorVisits';
import DispatchedAppmnts from './pages/reception-views/DispatchedAppmnts';
import ConvertedPatients from './pages/reception-views/ConvertedPatients';
import SecVisitorList from './pages/security-views/SecVisitorList';
import AddAllergies from './pages/doctorsViews/AddAllergies';
import FormVitals from './pages/doctorsViews/Vitals';
import Vitals from './pages/doctorsViews/Vitals';
import DoctorVisits from './pages/doctorsViews/DoctorVisits';
import ConsultationRoomEvalutionCard from './pages/doctorsViews/ConsultationRoomEvalutionCard';
import DoctorDashboard from './pages/doctorsViews/DoctorDashboard';
import TreamentListPending from './pages/doctorsViews/TreamentListPending';
import DischargeRequests from './pages/nurse-view/DischargeRequests';
import Admissions from './pages/nurse-view/Admissions';
import AdmissionRequests from './pages/nurse-view/AdmissionRequests';
import AdmissionRequest from './pages/nurse-view/AdmissionRequest';
import DischargeList from './pages/nurse-view/DischargeList';
import LabOutPatient from './pages/doctorsViews/tables/lab/LabOutPatient';
import RadiologyOutPatient from './pages/doctorsViews/tables/Radiology/RadiologyOutPatient';
import RadiologyOutPatients from './pages/doctorsViews/tables/Radiology/RadiologyOutPatients';

import ViewDoctorNotes from './pages/nurse-view/nurse-patient-file/ViewDoctorNotes';
import PostedConsumables from './pages/nurse-view/PostedConsumables';

import LaboratoryEvaluationCard from './pages/doctorsViews/tables/lab/LaboratoryEvaluationCard';
import DoctorAdmissions from './pages/doctorsViews/DocAdmission-views/DoctorAdmissions';
import VerifiedAdmission from './pages/doctorsViews/DocAdmission-views/VerifiedAdmission';
import AdmittedPatients from './pages/doctorsViews/DocAdmission-views/AdmittedPatients';
import PhamarcyDashboard from './pages/pharmacy-views/PhamarcyDashboard';
import PhamarcyOutpatient from './pages/pharmacy-views/PhamarcyOutpatient';
import PharmacyCard from './pages/pharmacy-views/PharmacyCard';
import PharmacyInpatient from './pages/pharmacy-views/PharmacyInpatient';
import PharmacyListReturnLines from './pages/pharmacy-views/PharmacyListReturnLines';
import PharmacyHistoryList from './pages/pharmacy-views/PharmacyHistoryList';
import ReadNurseNotes from './pages/nurse-view/ReadNurseNotes';
import ConsultationCard from './pages/nurse-view/ConsultationCard';
import BedOccupancy from './pages/nurse-view/BedOccupancy';
import CloseList from './pages/doctorsViews/tables/ClosedDocctorVisits';
import ReadDoctorNotes from './pages/ReadDoctorNotes';
import ConsultationRoomPatients from './pages/doctorsViews/tables/ConsultationRoomPatients';
import WalkInPatientList from './pages/WalkInPatientList';
import WalkinRegistration from './pages/WalkinRegistration';
import RadiologyDashboard from './Dashboards/RadiologyDashboard';

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<Login />}
      />
      <Route
        path="/register"
        element={<Register />}
      />
      <Route
        path="/forgot-password"
        element={<ForgotPwd />}
      />
      <Route
        path="/reset-password"
        element={<ResetPwd />}
      />

      <Route element={<PrivateRoute allowedDepartments={['Nurse']} />}>
        <Route
          path="/Nurse"
          element={<MainLayout />}
        >
          <Route
            index
            element={<Dashboard />}
          />

          {/* Routes */}
          <Route
            path="Patient-Registration"
            element={<PatientRegistration />}
          />
          <Route
            path="Past-doctor-visit"
            element={<PastDoctorVisit />}
          />
          <Route
            path="Past-doctor-visit/Patient"
            element={<TreatmentCard />}
          />

          <Route
            path="Triage"
            element={<TriageList />}
          />
          <Route
            path="PendingTriageList"
            element={<TriageListPending />}
          />
          <Route
            path="ClosedTriageList"
            element={<TriageListClosed />}
          />
          <Route
            path="Triage/Patient"
            element={<ExaminePatientInTriage />}
          />
          <Route
            path="Triage-list"
            element={<WaitingList />}
          />
          {/* <Route path="Patient-list" element={<Patientlist />} /> */}
          {/* <Route path="New-Patients" element={<NewPatients />} /> */}

          <Route
            path="Inpatient"
            element={<Inpatient />}
          />
          <Route
            path="Admit-patient"
            element={<AdmitPatients />}
          />
          <Route
            path="Admit-patient/Patient"
            element={<AdmitPatient />}
          />
          <Route
            path="Admit-patient/Charges"
            element={<PatientCharges />}
          />
          <Route
            path="Ward-management"
            element={<WardManagement />}
          />
          <Route
            path="Ward-management/Release-bed"
            element={<ReleaseBed />}
          />
          <Route
            path="Ward-management/Transfer-bed"
            element={<TransferBed />}
          />
          <Route
            path="Inpatient/Patient-card"
            element={<InpatientCard />}
          />

          <Route
            path="Consultation"
            element={<Admissions />}
          />
          <Route
            path="Consultation/Patient"
            element={<ConsultationCard />}
          />
          <Route
            path="Consultation/Read-Doctor-Dotes"
            element={<ReadDoctorNotes />}
          />

          <Route
            path="Admission-requests"
            element={<AdmissionRequests />}
          />
          <Route
            path="Admission-requests/:id"
            element={<AdmissionRequest />}
          />

          <Route
            path="Discharge-requests"
            element={<DischargeRequests />}
          />

          <Route
            path="Inpatient/Doctor-Notes"
            element={<ViewDoctorNotes />}
          />

          <Route
            path="Ward-management/Transfer-bed"
            element={<TransferBed />}
          />
          <Route
            path="Ward-management/Bed-occupancy"
            element={<BedOccupancy />}
          />
          <Route
            path="Inpatient/Patient-card"
            element={<InpatientCard />}
          />
          <Route
            path="Inpatient/Read-nurse-notes"
            element={<ReadNurseNotes />}
          />

          <Route
            path="Observation-Room/:id"
            element={<NurseObservation />}
          />
          <Route
            path="Outpatient-list"
            element={<NurseOutpatientList />}
          />
          <Route
            path="Patient-admissions"
            element={<PatientAdmissions />}
          />
          <Route
            path="BedManagement"
            element={<BedManager />}
          />

          <Route
            path="Discharge-list"
            element={<DischargeList />}
          />
          <Route
            path="Discharge-list/Posted-Consumables"
            element={<PostedConsumables />}
          />

          <Route
            path="view-profile"
            element={<ViewProfile />}
          />
        </Route>
      </Route>

      <Route element={<PrivateRoute allowedDepartments={['Reception']} />}>
        <Route
          path="/reception"
          element={<MainLayout />}
        >
          <Route
            index
            element={<ReceptionDashboard />}
          />

          <Route
            path="/reception/Patient-Registration/:PatientNo?"
            element={<PatientRegistration />}
          />
          <Route
            path="/reception/Add-Appointment/:patientNo?"
            element={<CreateVisitForm />}
          />

          <Route
            path="/reception/Patient-list"
            element={<OutpatientList />}
          />
          <Route
            path="/reception/Walkin-patient-list"
            element={<WalkInPatientList />}
          />
          <Route
            path="/reception/Register-walkin"
            element={<WalkinRegistration />}
          />
          <Route
            path="/reception/view-profile"
            element={<ViewProfile />}
          />
          <Route
            path="/reception/appointments/list"
            element={<ActiveAppmnts />}
          />
          <Route
            path="/reception/converted-patients"
            element={<ConvertedPatients />}
          />
          <Route
            path="/reception/appointments/Dispatched"
            element={<DispatchedAppmnts />}
          />

          <Route
            path="/reception/cash-List"
            element={<CashPatients />}
          />
          <Route
            path="/reception/insurance-List"
            element={<InsurancePatients />}
          />

          <Route
            path="/reception/InPatient-list"
            element={<InpatientList />}
          />

          <Route
            path="/reception/visitors-list"
            element={<VisitorList />}
          />

          <Route
            path="/reception/create-visit/:patientNo"
            element={<CreateVisitForm />}
          />
        </Route>
      </Route>

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
            path="/Doctor/Consultation/Patient"
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
            path="/Doctor/Inpatient/Read-nurse-notes"
            element={<ReadNurseNotes />}
          />
          <Route
            path="/Doctor/Past-doctor-visit/Patient"
            element={<TreatmentCard />}
          />
          <Route
            path="/Doctor/Lab-Patients"
            element={<LabOutPatient />}
          />
          <Route
            path="/Doctor/Radiology-Patients"
            element={<RadiologyOutPatient />}
          />
          {/* Laboratory Routes */}
          <Route
            path="/Doctor/Lab/Patient"
            element={<LaboratoryEvaluationCard />}
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
            element={<PhamarcyOutpatient />}
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
            path="view-profile"
            element={<ViewProfile />}
          />
        </Route>
      </Route>

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
            path="/Psychology/Consultation/Patient"
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
            path="/Psychology/Past-doctor-visit/Patient"
            element={<TreatmentCard />}
          />
          <Route
            path="/Psychology/Inpatient/Read-nurse-notes"
            element={<ReadNurseNotes />}
          />
          <Route
            path="/Psychology/Past-doctor-visit/Patient"
            element={<TreatmentCard />}
          />
          <Route
            path="/Psychology/Lab-Patients"
            element={<LabOutPatient />}
          />
          <Route
            path="/Psychology/Radiology-Patients"
            element={<RadiologyOutPatient />}
          />
          {/* Laboratory Routes */}
          <Route
            path="/Psychology/Lab/Patient"
            element={<LaboratoryEvaluationCard />}
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
            element={<PhamarcyOutpatient />}
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
      <Route element={<PrivateRoute allowedDepartments={['Security']} />}>
        <Route
          path="/Security"
          element={<MainLayout />}
        >
          <Route
            index
            element={<VisitorForm />}
          />
          <Route
            path="/Security/visitors-list"
            element={<SecVisitorList />}
          />
          <Route
            path="/Security/History-list"
            element={<HistoryVisitorList />}
          />
        </Route>
      </Route>
      
      <Route element={<PrivateRoute allowedDepartments={["Pharmacy"]} />}>
        <Route path="/Pharmacy" element={<MainLayout />}>
          <Route index element={<PhamarcyDashboard />} />
          <Route path="/Pharmacy/Pharmacy-OutPatient" element={<PhamarcyOutpatient />} />
          <Route path="/Pharmacy/Pharmacy-Inpatient" element={<PharmacyInpatient />} />
          <Route path="/Pharmacy/Pharmacy-Card" element={<PharmacyCard />} />
          <Route path="/Pharmacy/Pharmacy-Returns" element={<PharmacyListReturnLines />} />
          <Route path="/Pharmacy/Pharmacy-History" element={<PharmacyHistoryList />} />
          {/* <Route path="/Pharmacy/Consultation/Read-Doctor-Dotes" element={<ReadDoctorNotes />} /> */}
          <Route path="view-profile" element={<ViewProfile />} />
        </Route>
      </Route>

      <Route
        path="*"
        element={<Navigate to="/login" />}
      />
    </Routes>
    // <Routes>
    //   <Route path="/login" element={<Login />} />
    //   <Route path="/register" element={<Register />} />
    //   <Route path="/forgot-password" element={<ForgotPwd />} />
    //   <Route path="/reset-password" element={<ResetPwd />} />

    //   <Route element={<PrivateRoute allowedRoles={[Roles.Admin]} />}>
    //     <Route path="/admin" element={<AdminLayout />} />{" "}
    //     {/* Admin page route */}
    //   </Route>

    //   {/* removed - <Route element={<PrivateRoute allowedRoles={[Roles.Nurse]} />}  - from the nurse route otp*/}

    //   <Route element={<PrivateRoute allowedRoles={[Roles.Nurse]} />}>
    //   <Route path="/Nurse" element={<NurseLayout />}>
    //         {/* <Route index element={<NurseDashboard />} /> */}
    //         <Route path="Dashboard" element={<Dashboard />} />
    //         <Route
    //           path="Patient-Registration"
    //           element={<PatientRegistration />}
    //         />
    //         <Route path="Past-doctor-visit" element={<PastDoctorVisit />} />
    //         <Route path="Past-doctor-visit/Patient" element={<TreatmentCard />} />

    //         <Route path="Triage" element={<TriageList />} />
    //         <Route path="PendingTriageList" element={<TriageListPending />} />
    //         <Route path="ClosedTriageList" element={<TriageListClosed />} />
    //         <Route path="Triage/Patient" element={<ExaminePatientInTriage />} />
    //         <Route path="Triage-list" element={<WaitingList />} />
    //         <Route path="Patient-list" element={<Patientlist />} />
    //         <Route path="New-Patients" element={<NewPatients />} />

    //         <Route path="Inpatient" element={<Inpatient />} />
    //         <Route path="Admit-patient" element={<AdmitPatients />} />
    //         <Route path="Admit-patient/Patient" element={<AdmitPatient />} />
    //         <Route path="Admit-patient/Charges" element={<PatientCharges />} />
    //         <Route path="Ward-management" element={<WardManagement />} />
    //         <Route path="Ward-management/Release-bed" element={<ReleaseBed />} />
    //         <Route path="Ward-management/Transfer-bed" element={<TransferBed />} />
    //         <Route path="Inpatient/Patient-card" element={<InpatientCard />} />

    //         <Route
    //           path="Observation-Room/:id"
    //           element={<NurseObservation />}
    //         />
    //         <Route
    //           path="Outpatient-list"
    //           element={<NurseOutpatientList />}
    //         />
    //         <Route
    //           path="Patient-admissions"
    //           element={<PatientAdmissions />}
    //         />
    //         <Route path="BedManagement" element={<BedManager />} />

    //         <Route
    //           path="Discharge-list"
    //           element={<DischargeRequestList />}
    //         />
    //         <Route path="view-profile" element={<ViewProfile />} />
    //   </Route>
    //   </Route>

    //   <Route element={<PrivateRoute allowedDepartments={["Reception"]}  />}>
    //   <Route path="/Nurse" element={<NurseLayout />}>
    //         {/* <Route index element={<NurseDashboard />} /> */}
    //         <Route path="Dashboard" element={<Dashboard />} />
    //         <Route
    //           path="Patient-Registration"
    //           element={<PatientRegistration />}
    //         />
    //         <Route path="Past-Doctor-Visit" element={<PastDoctorVisit />} />
    //         <Route path="Triage" element={<TriageList />} />
    //         <Route path="PendingTriageList" element={<TriageListPending />} />
    //         <Route path="ClosedTriageList" element={<TriageListClosed />} />
    //         <Route path="Triage/Patient" element={<ExaminePatientInTriage />} />
    //         <Route path="Triage-list" element={<WaitingList />} />
    //         <Route path="Patient-list" element={<Patientlist />} />
    //         <Route path="New-Patients" element={<NewPatients />} />

    //         <Route path="Inpatient" element={<Inpatient />} />
    //         <Route path="Admit-patient" element={<AdmitPatients />} />
    //         <Route path="Ward-management" element={<WardManagement />} />

    //         <Route
    //           path="Observation-Room/:id"
    //           element={<NurseObservation />}
    //         />
    //         <Route
    //           path="Outpatient-list"
    //           element={<NurseOutpatientList />}
    //         />
    //         <Route
    //           path="Patient-admissions"
    //           element={<PatientAdmissions />}
    //         />
    //         <Route path="BedManagement" element={<BedManager />} />

    //         <Route
    //           path="Discharge-list"
    //           element={<DischargeRequestList />}
    //         />
    //         <Route path="view-profile" element={<ViewProfile />} />
    //   </Route>
    //   </Route>
    //   <Route element={<PrivateRoute allowedRoles={['Reception']} />}>
    //     <Route path="/reception" element={<MainLayout />}>
    //       <Route index element={<ReceptionDashboard />} />

    //       <Route
    //         path="/reception/Patient-Registration"
    //         element={<PatientRegistration />}
    //       />
    //       <Route
    //         path="/reception/Add-Appointment/:patientNo"
    //         element={<CreateVisitForm />}
    //       />

    //       <Route path="/reception/Patient-list" element={<OutpatientList />} />
    //       <Route path="/reception/view-profile" element={<ViewProfile />} />
    //       <Route
    //         path="/reception/appointments/list"
    //         element={<ActiveAppmnts />}
    //       />

    //       <Route path="/reception/cash-List" element={<CashPatients />} />
    //       <Route
    //         path="/reception/insurance-List"
    //         element={<InsurancePatients />}
    //       />

    //       <Route path="/reception/InPatient-list" element={<InpatientList />} />

    //       <Route path="/reception/visitors-list" element={<VisitorList />} />

    //       <Route
    //         path="/reception/create-visit/:patientNo"
    //         element={<CreateVisitForm />}
    //       />
    //     </Route>
    //   </Route>
    //   <Route element={<PrivateRoute allowedDepartments={["Doctor"]} />}>
    //     <Route path="/Doctor" element={<MainLayout />}>
    //       <Route index element={<PatientCard />} />

    //       <Route path="/Doctor/view-profile" element={<ViewProfile />} />
    //     </Route>
    //   </Route>

    //   <Route element={<PrivateRoute allowedRoles={["Security"]} />}>
    //     <Route path="/Security" element={<SecurityLayout />}>
    //       <Route index element={<VisitorForm />} />
    //       <Route path="/Security/visitors-list" element={<VisitorList />} />
    //       <Route
    //         path="/Security/History-list"
    //         element={<HistoryVisitorList />}
    //       />
    //     </Route>
    //   </Route>

    //   <Route path="*" element={<Navigate to="/login" />} />
    // </Routes>
  );
}

export default App;
