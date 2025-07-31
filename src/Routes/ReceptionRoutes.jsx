import { Route } from "react-router-dom";

import {
  AppstoreOutlined,
  UserOutlined,
  FileTextOutlined,
  UserAddOutlined,
  CalendarOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";
import { FaUserGroup, FaPersonWalking } from "react-icons/fa6";
import { BiBed, BiCoinStack } from "react-icons/bi";

import ViewProfile from "../Auth/ViewProfile";
import VisitorList from "../pages/VisitorList";
import MainLayout from "../Layouts/MainLayout";
import PrivateRoute from "../private/PrivateRoute";
import ActiveAppmnts from "../pages/ActiveAppmnts";
import OutpatientList from "../pages/OutpatientList";
import CreateVisitForm from "../pages/CreateVisitForm";
import PatientAdmissions from "../pages/PatientAdmissions";
import WalkInPatientList from "../pages/WalkInPatientList";
import WalkinRegistration from "../pages/WalkinRegistration";
import PatientRegistration from "../pages/PatientRegistration";
import ActiveInpatient from "../pages/billing/ActiveInpatient";
import ReceptionDashboard from "../Dashboards/ReceptionDashboard";
import DirectAdmission from "../pages/nurse-view/DirectAdmission";
import ActiveOutPatients from "../pages/billing/ActiveOutPatients";
import AdmissionRequest from "../pages/nurse-view/AdmissionRequest";
import AdmissionRequests from "../pages/nurse-view/AdmissionRequests";
import ConvertedPatients from "../pages/reception-views/ConvertedPatients";
import DispatchedAppmnts from "../pages/reception-views/DispatchedAppmnts";
import WalkInCreateVisit from "../pages/reception-views/WalkInCreateVisit";
import { DispatchWalkInPatient } from "../pages/reception-views/DispatchWalkInPatient";
import ReceiptPatient from "../pages/billing/CashPatients/ReceiptPatient";
import InvoicePatient from "../pages/billing/InsurancePatients/InvoicePatient";
import ReceiptInpatient from "../pages/billing/CashPatients/ReceiptInpatient";
import InvoiceInpatient from "../pages/billing/InsurancePatients/InvoiceInpatient";
import DischargePage from "../pages/billing/DischargePage";
import PreviousBill from "../pages/billing/PreviousBill";
import { Can } from "../hooks/casl";

export const receptionRoutes = [
  {
    key: "/Dashboard",
    icon: <AppstoreOutlined style={{ color: "#fff" }} />,
    label: "Dashboard",
  },
  {
    key: "/Dashboard/visitors-list",
    icon: <UserOutlined style={{ color: "#fff" }} />,
    label: "Visitors",
  },

  {
    key: "/Dashboard/patient-list",
    icon: <FaUserGroup style={{ color: "#fff" }} />,
    label: "Patient List",
    children: [
      {
        key: "/Dashboard/Patient-list",
        label: "Patient List",
        icon: <FileTextOutlined style={{ color: "#fff" }} />,
      },
      {
        key: "/Dashboard/Walkin-Patient-List",
        label: "Walk-in Patient List",
        icon: <FaPersonWalking style={{ color: "#fff" }} />,
      },
    ],
  },
  {
    key: "/Dashboard/appointments",
    icon: <CalendarOutlined style={{ color: "#fff" }} />,
    label: "Appointments",
    children: [
      {
        key: "/Dashboard/appointments/list",
        label: " New Appointments",
        icon: <CalendarOutlined style={{ color: "#fff" }} />,
      },
      {
        key: "/Dashboard/appointments/Dispatched",
        label: "Dispatched List",
        icon: <CalendarOutlined style={{ color: "#fff" }} />,
      },
    ],
  },
  {
    key: "/Dashboard/admission",
    icon: <BiBed style={{ color: "#fff" }} />,
    label: "Admissions",
    children: [
      {
        key: "/Dashboard/admission-requests",
        label: "Pending Admissions Requests",
        icon: <FieldTimeOutlined style={{ color: "#fff" }} />,
      },
    ],
  },
  {
    key: "/Dashboard/billing",
    icon: <BiCoinStack style={{ color: "#fff" }} />,
    label: "Billing",
    children: [
      {
        key: "/Dashboard/Billing/Outpatients",
        label: "OutPatient",
        icon: <CalendarOutlined style={{ color: "#fff" }} />,
      },
      {
        key: "/Dashboard/Billing/Inpatients",
        label: "InPatient",
        icon: <CalendarOutlined style={{ color: "#fff" }} />,
      },
    ],
  },
];

export default function ReceptionRoutes() {
  return (
    <Route path="/Dashboard" element={<MainLayout />}>
      <Route index element={<ReceptionDashboard />} />
      <Route
        path="/Dashboard/Patient-Registration/:PatientNo?"
        element={<PatientRegistration />}
      />
      <Route
        path="/Dashboard/Add-Appointment/:patientNo?"
        element={<CreateVisitForm />}
      />
      <Route
        path="/Dashboard/Discharge-patient/:patientNo?"
        element={<DischargePage />}
      />
      <Route path="/Dashboard/Patient-list" element={<OutpatientList />} />
      <Route
        path="/Dashboard/Walkin-Patient-List"
        element={<WalkInPatientList />}
      />
      <Route
        path="/Dashboard/Walkin-Patient-List/Walk-In-Create-Visit"
        element={<WalkInCreateVisit />}
      />
      <Route
        path="/Dashboard/Register-walkin"
        element={<WalkinRegistration />}
      />
      <Route path="/Dashboard/view-profile" element={<ViewProfile />} />
      <Route path="/Dashboard/appointments/list" element={<ActiveAppmnts />} />
      <Route
        path="/Dashboard/converted-patients"
        element={<ConvertedPatients />}
      />
      <Route
        path="/Dashboard/appointments/Dispatched"
        element={<DispatchedAppmnts />}
      />
      <Route
        path="/Dashboard/Billing/Outpatients"
        element={<ActiveOutPatients />}
      />
      <Route
        path="/Dashboard/Billing/Inpatients"
        element={<ActiveInpatient />}
      />
      <Route
        path="/Dashboard/Billing/Previous-Bill"
        element={<PreviousBill />}
      />
      <Route path="/Dashboard/visitors-list" element={<VisitorList />} />
      {/* disptching the patient in walk in */}
      <Route
        path="/Dashboard/Walkin-Patient-List/:patientNo?"
        element={<DispatchWalkInPatient />}
      />
      <Route
        path="/Dashboard/create-visit/:patientNo"
        element={<CreateVisitForm />}
      />
      <Route
        path="/Dashboard/Patient-admissions"
        element={<PatientAdmissions />}
      />
      <Route
        path="/Dashboard/Admission-requests"
        element={<AdmissionRequests />}
      />
      <Route
        path="/Dashboard/Admission-requests/:id"
        element={<AdmissionRequest />}
      />
      <Route
        path="/Dashboard/CashPatient-Charges"
        element={<ReceiptPatient />}
      />

      <Route
        path="/Dashboard/CorporatePatient-Charges"
        element={<InvoicePatient />}
      />
      <Route
        path="/Dashboard/InPatient-Charges"
        element={<ReceiptInpatient />}
      />
      <Route
        path="/Dashboard/Corporate-Inpatient-Charges"
        element={<InvoiceInpatient />}
      />
      <Route
        path="/Dashboard/patient-list/Direct-Admission/:PatientNo?"
        element={<DirectAdmission />}
      />
    </Route>
  );
}
