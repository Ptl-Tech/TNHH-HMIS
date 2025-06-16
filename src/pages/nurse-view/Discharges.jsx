import { Tabs } from "antd";
import { TbNotes } from "react-icons/tb";
import { BsBookmarkCheck } from "react-icons/bs";
import { AiOutlineMedicineBox } from "react-icons/ai";
import { UserAddOutlined, FileMarkdownOutlined } from "@ant-design/icons";

import SickOff from "./discharges/SickOff";
import AppointmentTCA from "./discharges/AppointmentTCA";
import DischargeSummaryTab from "./discharges/DischargeSummaryTab";
import InpatientMedication from "./nurse-care-plan/InpatientMedication";

const Discharges = () => {
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
      children: <DischargeSummaryTab />,
    },
    {
      key: "sickOff",
      label: "Sick Off",
      icon: <UserAddOutlined />,
      children: <SickOff />,
    },
    {
      key: "appointmentTCA",
      label: "Appointment TCA",
      icon: <BsBookmarkCheck />,
      children: <AppointmentTCA />,
    },
  ];

  return <Tabs destroyOnHidden type="card" items={menuItems} />;
};

export default Discharges;
