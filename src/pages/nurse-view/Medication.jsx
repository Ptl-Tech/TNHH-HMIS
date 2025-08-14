import { useState } from "react";

import {
  RollbackOutlined,
  ExperimentOutlined,
  MedicineBoxOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Button, Divider } from "antd";

import useAuth from "../../hooks/auth";

import Consumables from "./nurse-patient-file/Consumables";
import TreatmentsSheet from "./nurse-care-plan/TreatmentsSheet";
import InpatientMedication from "./nurse-care-plan/InpatientMedication";
import NursePharmacyReturnLine from "./tables/NursePharmacyReturnLine";

const Medication = ({ patientDetails }) => {
  const [activeItem, setActiveItem] = useState("Prescription");
  const [selectedItem, setSelectedItem] = useState(<InpatientMedication />);
  const { user } = useAuth();
  const userRole = user?.role;

  const handleOnClick = (item) => {
    setActiveItem(item.label);
    switch (item.label) {
      case "Prescription":
        setSelectedItem(<InpatientMedication />);
        break;
      case "Treatments Sheet":
        setSelectedItem(<TreatmentsSheet patientDetails={patientDetails} />);
        break;
      case "Order Sheet":
        setSelectedItem(<Consumables />);
        break;
      case "Pharmacy Return Drugs":
        setSelectedItem(
          <NursePharmacyReturnLine patientNo={patientDetails?.Patient_No} />
        );
        break;
      default:
        setSelectedItem(null);
    }
  };
  const menuItems = [
    {
      label: "Prescription",
      icon: <MedicineBoxOutlined />,
    },
    {
      label: "Treatments Sheet",
      icon: <ExperimentOutlined />,
    },
    ...(userRole === "Nurse"
      ? [
          {
            label: "Order Sheet",
            icon: <ShoppingCartOutlined />,
          },
        ]
      : []),
    {
      label: "Pharmacy Return Drugs",
      icon: <RollbackOutlined />,
    },
  ];
  return (
    <>
      <div
        style={{
          display: "flex",
          flex: 1,
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "10px",
        }}
      >
        {menuItems.map((item, index) => (
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
      </div>

      <Divider />
      <div className="patient-file-content">{selectedItem}</div>
    </>
  );
};

export default Medication;
