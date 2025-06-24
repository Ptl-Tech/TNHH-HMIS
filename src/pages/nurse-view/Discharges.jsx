import { useSelector } from "react-redux";

import { Tabs } from "antd";
import { TbNotes } from "react-icons/tb";
import { BsBookmarkCheck } from "react-icons/bs";
import { UserAddOutlined } from "@ant-design/icons";
import { AiOutlineMedicineBox } from "react-icons/ai";

import SickOff from "./discharges/SickOff";
import AppointmentTCA from "./discharges/AppointmentTCA";
import DischargeSummaryTab from "./discharges/DischargeSummaryTab";
import InpatientMedication from "./nurse-care-plan/InpatientMedication";

const Discharges = () => {
  const { data: currentInpatient } = useSelector(
    (state) => state.currentInpatient
  );

  const menuItems = [
    {
      key: "dischargeMedication",
      label: "Discharge Medication",
      icon: <AiOutlineMedicineBox />,
      children: <InpatientMedication />,
    },
    {
      icon: <TbNotes size={17} />,
      key: "dischargeSummary",
      label: "Discharge Summary",
      children: <DischargeSummaryTab currentInpatient={currentInpatient} />,
    },
    {
      key: "sickOff",
      label: "Sick Off",
      icon: <UserAddOutlined />,
      children: <SickOff currentInpatient={currentInpatient} />,
    },
    {
      key: "appointmentTCA",
      label: "Appointment TCA",
      icon: <BsBookmarkCheck />,
      children: <AppointmentTCA currentInpatient={currentInpatient} />,
    },
  ];

  return <Tabs destroyOnHidden type="card" items={menuItems} />;
};

export default Discharges;
