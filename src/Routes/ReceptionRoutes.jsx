import { Route } from "react-router-dom";

import {
  AppstoreOutlined,
  UserOutlined,
  FileTextOutlined,
  UserAddOutlined,
  CalendarOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";
import { BiBed, BiCoinStack } from "react-icons/bi";
import { FaUserGroup } from "react-icons/fa6";

import ViewProfile from "../Auth/ViewProfile";
import VisitorList from "../pages/VisitorList";
import MainLayout from "../Layouts/MainLayout";
import PrivateRoute from "../private/PrivateRoute";
import ActiveAppmnts from "../pages/ActiveAppmnts";
import OutpatientList from "../pages/OutpatientList";
import ViewReceipt from "../pages/billing/ViewReceipt";
import CreateVisitForm from "../pages/CreateVisitForm";
import ViewInvoice from "../pages/billing/ViewInvoice";
import WalkInPatientList from "../pages/WalkInPatientList";
import WalkinRegistration from "../pages/WalkinRegistration";
import PatientRegistration from "../pages/PatientRegistration";
import ActiveInpatient from "../pages/billing/ActiveInpatient";
import ReceptionDashboard from "../Dashboards/ReceptionDashboard";
import ActiveOutPatients from "../pages/billing/ActiveOutPatients";
import ViewPatientsReceipts from "../pages/billing/ViewPatientsReceipts";
import ConvertedPatients from "../pages/reception-views/ConvertedPatients";
import DispatchedAppmnts from "../pages/reception-views/DispatchedAppmnts";
import { DispatchWalkInPatient } from "../pages/reception-views/DispatchWalkInPatient";

export const receptionRoutes = [
  {
    key: "/reception",
    icon: <AppstoreOutlined style={{ color: "#fff" }} />,
    label: "Dashboard",
  },
  {
    key: "/reception/visitors-list",
    icon: <UserOutlined style={{ color: "#fff" }} />,
    label: "Visitors",
  },
  {
    key: "/reception/patient-list",
    icon: <FaUserGroup style={{ color: "#fff" }} />,
    label: "Patient List",
    children: [
      {
        key: "/reception/Patient-list",
        label: "Patient List",
        icon: <FileTextOutlined style={{ color: "#fff" }} />,
      },
      {
        key: "/reception/Walkin-patient-list",
        label: "Walk-in Patient List",
        icon: <UserAddOutlined style={{ color: "#fff" }} />,
      },
    ],
  },
  {
    key: "/reception/appointments",
    icon: <CalendarOutlined style={{ color: "#fff" }} />,
    label: "Appointments",
    children: [
      {
        key: "/reception/appointments/list",
        label: " New Appointments",
        icon: <CalendarOutlined style={{ color: "#fff" }} />,
      },
      {
        key: "/reception/appointments/Dispatched",
        label: "Dispatched List",
        icon: <CalendarOutlined style={{ color: "#fff" }} />,
      },
    ],
  },
  {
    key: "/reception/admission",
    icon: <BiBed style={{ color: "#fff" }} />,
    label: "Admissions",
    children: [
      {
        key: "/reception/admission-requests",
        label: "Pending Admissions Requests",
        icon: <FieldTimeOutlined style={{ color: "#fff" }} />,
      },
    ],
  },
  {
    key: "/reception/billing",
    icon: <BiCoinStack style={{ color: "#fff" }} />,
    label: "Billing",
    children: [
      {
        key: "/reception/Billing/Outpatients",
        label: "OutPatient",
        icon: <CalendarOutlined style={{ color: "#fff" }} />,
      },
      {
        key: "/reception/Billing/Inpatients",
        label: "InPatient",
        icon: <CalendarOutlined style={{ color: "#fff" }} />,
      },
    ],
  },
];

export default function ReceptionRoutes() {
  return (
    <Route element={<PrivateRoute allowedDepartments={["Reception"]} />}>
      <Route path="/reception" element={<MainLayout />}>
        <Route index element={<ReceptionDashboard />} />
        <Route
          path="/reception/Patient-Registration/:PatientNo?"
          element={<PatientRegistration />}
        />
        <Route
          path="/reception/Add-Appointment/:patientNo?"
          element={<CreateVisitForm />}
        />
        <Route path="/reception/Patient-list" element={<OutpatientList />} />
        <Route
          path="/reception/Walkin-patient-list"
          element={<WalkInPatientList />}
        />
        <Route
          path="/reception/Register-walkin"
          element={<WalkinRegistration />}
        />
        <Route path="/reception/view-profile" element={<ViewProfile />} />
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
          path="/reception/Billing/Outpatients"
          element={<ActiveOutPatients />}
        />
        <Route
          path="/reception/Billing/Inpatients"
          element={<ActiveInpatient />}
        />
        <Route path="/reception/visitors-list" element={<VisitorList />} />
        {/* disptching the patient in walk in */}
        <Route
          path="/reception/visitors-list/Dispatch-Patient/:patientNo?"
          element={<DispatchWalkInPatient />}
        />
        <Route
          path="/reception/create-visit/:patientNo"
          element={<CreateVisitForm />}
        />
        <Route path="/reception/invoice/:patientNo" element={<ViewInvoice />} />
        <Route path="/reception/Receipt/:patientNo" element={<ViewReceipt />} />
        <Route
          path="/reception/Patient-Charges/:patientNo"
          element={<ViewPatientsReceipts />}
        />
      </Route>
    </Route>
  );
}
