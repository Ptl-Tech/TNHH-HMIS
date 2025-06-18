import { Tabs } from "antd";
import { IoBedOutline } from "react-icons/io5";
import { BsBookmarkCheck } from "react-icons/bs";
import { UsergroupAddOutlined, PrinterOutlined } from "@ant-design/icons";

import Referrals from "./Referrals";
import AdmitPatientForm from "./AdmitPatient";

import SickOff from "../../nurse-view/discharges/SickOff";
import AppointmentTCA from "../../nurse-view/discharges/AppointmentTCA";

const AdmissionTab = () => {
  const { data: currentInpatient } = useSelector(
    (state) => state.currentInpatient
  );

  console.log({ currentInpatient });

  const buttonItems = [
    {
      icon: <IoBedOutline />,
      key: "admissionRequests",
      label: "Admission Requests",
      children: <AdmitPatientForm />,
    },
    {
      key: "patientRefferals",
      children: <Referrals />,
      label: "Patient Referals",
      icon: <UsergroupAddOutlined />,
    },
    {
      key: "sickOff",
      label: "Sick Off",
      children: <SickOff />,
      icon: <PrinterOutlined />,
    },
    {
      key: "appointmentTCA",
      label: "Appointment TCA",
      icon: <BsBookmarkCheck />,
      children: <AppointmentTCA currentInpatient={currentInpatient} />,
    },
  ];

  return <Tabs type="card" items={buttonItems} />;
};

export default AdmissionTab;
