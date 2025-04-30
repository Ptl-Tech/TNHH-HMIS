import { useState } from "react";
import { UsergroupAddOutlined, PrinterOutlined } from "@ant-design/icons";

import { Button, Space } from "antd";
import { IoBedOutline } from "react-icons/io5";
import AdmitPatientForm from "./AdmitPatient";
import Referrals from "./Referrals";
import LabResults from "./LabResults";
import SickOff from "../../nurse-view/discharges/SickOff";

const AdmissionTab = () => {
  const [activeItem, setActiveItem] = useState("Admission Requests");
  const handleOnClick = (item) => {
    setActiveItem(item.label);
    switch (item.label) {
      case "Admission Requests":
        setSelectedItem(<AdmitPatientForm />);
        break;
      case "Patient Referals":
        setSelectedItem(<Referrals />);
        break;
      case "Sick Off":
        setSelectedItem(<SickOff />);
        break;
      default:
        setSelectedItem(<LabResults />);
    }
  };

  const [selectedItem, setSelectedItem] = useState(<AdmitPatientForm />);
  const buttonItems = [
    {
      label: "Admission Requests",
      icon: <IoBedOutline />,
    },
    {
      label: "Patient Referals",
      icon: <UsergroupAddOutlined />,
    },
    {
      label: "Sick Off",
      icon: <PrinterOutlined />,
    },
  ];

  return (
    <div>
      <Space
        direction="horizontal"
        size="middle"
        style={{ marginBottom: "20px", display: "flex", flexWrap: "wrap" }}
      >
        {buttonItems.map((item, index) => (
          <Button
            key={index}
            style={{
              backgroundColor: "#0f5689",
              color: "#ffffff",
              border: "none",
              padding: "18px 20px",
            }}
            className={activeItem === item.label ? "active-button" : ""}
            onClick={() => handleOnClick(item)}
          >
            {item.icon}
            {item.label}
          </Button>
        ))}
      </Space>
      <div>{selectedItem}</div>
    </div>
  );
};

export default AdmissionTab;
