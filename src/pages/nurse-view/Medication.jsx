import { Button, Divider } from "antd";
import { useState } from "react";
import InpatientMedication from "./nurse-care-plan/InpatientMedication";
import TreatmentsSheet from "./nurse-care-plan/TreatmentsSheet";
import Consumables from "./nurse-patient-file/Consumables";
import {
  MedicineBoxOutlined,
  BorderlessTableOutlined,
  ExperimentOutlined,
  ShoppingCartOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import useAuth from "../../hooks/useAuth";
import NursePharmacyReturnLine from "./tables/NursePharmacyReturnLine";

const Medication = ({  role, patientDetails }) => {
  const [activeItem, setActiveItem] = useState("Prescription");
  const [selectedItem, setSelectedItem] = useState(<InpatientMedication />);
  const userRole = useAuth().userData.departmentName;

  const handleOnClick = (item) => {
    setActiveItem(item.label);
    switch (item.label) {
      case "Prescription":
        setSelectedItem(<InpatientMedication role={role} />);
        break;
      case "Treatments Sheet":
        setSelectedItem(<TreatmentsSheet patientDetails={patientDetails} />);
        break;
      case "Order Sheet":
        setSelectedItem(<Consumables />);
        break;
        case "Pharmacy Return Drugs":
        setSelectedItem(<NursePharmacyReturnLine patientNo={patientDetails?.Patient_No} />);
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
    icon: (
      <RollbackOutlined /> 
    ),
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
