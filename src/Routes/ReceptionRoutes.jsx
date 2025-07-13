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
import { GiCoinsPile } from "react-icons/gi";
import PreviousBill from "../pages/billing/PreviousBill";

export const receptionRoutes = [
  {
    key: "/Reception",
    icon: <AppstoreOutlined style={{ color: "#fff" }} />,
    label: "Dashboard",
  },
  {
    key: "/Reception/visitors-list",
    icon: <UserOutlined style={{ color: "#fff" }} />,
    label: "Visitors",
  },
  
  {
    key: "/Reception/patient-list",
    icon: <FaUserGroup style={{ color: "#fff" }} />,
    label: "Patient List",
    children: [
      {
        key: "/Reception/Patient-list",
        label: "Patient List",
        icon: <FileTextOutlined style={{ color: "#fff" }} />,
      },
      {
        key: "/Reception/Walkin-Patient-List",
        label: "Walk-in Patient List",
        icon: <FaPersonWalking style={{ color: "#fff" }} />,
      },
    ],
  },
  {
    key: "/Reception/appointments",
    icon: <CalendarOutlined style={{ color: "#fff" }} />,
    label: "Appointments",
    children: [
      {
        key: "/Reception/appointments/list",
        label: " New Appointments",
        icon: <CalendarOutlined style={{ color: "#fff" }} />,
      },
      {
        key: "/Reception/appointments/Dispatched",
        label: "Dispatched List",
        icon: <CalendarOutlined style={{ color: "#fff" }} />,
      },
    ],
  },
  {
    key: "/Reception/admission",
    icon: <BiBed style={{ color: "#fff" }} />,
    label: "Admissions",
    children: [
      {
        key: "/Reception/admission-requests",
        label: "Pending Admissions Requests",
        icon: <FieldTimeOutlined style={{ color: "#fff" }} />,
      },
    ],
  },
  {
    key: "/Reception/billing",
    icon: <BiCoinStack style={{ color: "#fff" }} />,
    label: "Billing",
    children: [
      {
        key: "/Reception/Billing/Outpatients",
        label: "OutPatient",
        icon: <CalendarOutlined style={{ color: "#fff" }} />,
      },
      {
        key: "/Reception/Billing/Inpatients",
        label: "InPatient",
        icon: <CalendarOutlined style={{ color: "#fff" }} />,
      },
      // {
      //   key: "/Reception/Billing/Previous-Bill",
      //   label: "Previous Bill",
      //   icon: <GiCoinsPile style={{ color: "#fff" }} />,
      // },
    ],
  },
];

export default function ReceptionRoutes() {
  return (
    <Route element={<PrivateRoute allowedDepartments={["Reception"]} />}>
      <Route path="/Reception" element={<MainLayout />}>
        <Route index element={<ReceptionDashboard />} />
        <Route
          path="/Reception/Patient-Registration/:PatientNo?"
          element={<PatientRegistration />}
        />
        <Route
          path="/Reception/Add-Appointment/:patientNo?"
          element={<CreateVisitForm />}
        />
        <Route
          path="/Reception/Discharge-patient/:patientNo?"
          element={<DischargePage />}
        />
        <Route path="/Reception/Patient-list" element={<OutpatientList />} />
        <Route
          path="/Reception/Walkin-Patient-List"
          element={<WalkInPatientList />}
        />
        <Route
          path="/Reception/Walkin-Patient-List/Walk-In-Create-Visit"
          element={<WalkInCreateVisit />}
        />
        <Route
          path="/Reception/Register-walkin"
          element={<WalkinRegistration />}
        />
        <Route path="/Reception/view-profile" element={<ViewProfile />} />
        <Route
          path="/Reception/appointments/list"
          element={<ActiveAppmnts />}
        />
        <Route
          path="/Reception/converted-patients"
          element={<ConvertedPatients />}
        />
        <Route
          path="/Reception/appointments/Dispatched"
          element={<DispatchedAppmnts />}
        />
        <Route
          path="/Reception/Billing/Outpatients"
          element={<ActiveOutPatients />}
        />
        <Route
          path="/Reception/Billing/Inpatients"
          element={<ActiveInpatient />}
        />
         <Route
          path="/Reception/Billing/Previous-Bill"
          element={<PreviousBill />}
        />
        <Route path="/Reception/visitors-list" element={<VisitorList />} />
        {/* disptching the patient in walk in */}
        <Route
          path="/Reception/Walkin-Patient-List/:patientNo?"
          element={<DispatchWalkInPatient />}
        />
        <Route
          path="/Reception/create-visit/:patientNo"
          element={<CreateVisitForm />}
        />
        <Route
          path="/Reception/Patient-admissions"
          element={<PatientAdmissions />}
        />
        <Route
          path="/Reception/Admission-requests"
          element={<AdmissionRequests />}
        />
        <Route
          path="/Reception/Admission-requests/:id"
          element={<AdmissionRequest />}
        />
        {/* <Route path="/Reception/invoice/:patientNo" element={<ViewInvoice />} />
        <Route path="/Reception/Receipt/:patientNo" element={<ViewReceipt />} />
        <Route path="/Reception/invoice/:patientNo" element={<ViewInvoice />} />
        <Route path="/Reception/Receipt/:patientNo" element={<ViewReceipt />} /> */}
        <Route
          path="/Reception/CashPatient-Charges"
          element={<ReceiptPatient />}
        />

        <Route
          path="/Reception/CorporatePatient-Charges"
          element={<InvoicePatient />}
        />
        <Route
          path="/Reception/InPatient-Charges"
          element={<ReceiptInpatient />}
        />
         <Route
          path="/Reception/Corporate-Inpatient-Charges"
          element={<InvoiceInpatient />}
        />
        <Route
          path="/Reception/patient-list/Direct-Admission/:PatientNo?"
          element={<DirectAdmission />}
        />
      </Route>
    </Route>
  );
}
