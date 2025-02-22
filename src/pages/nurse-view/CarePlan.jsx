import { Button, Divider } from "antd";
import { useState } from "react";
import AddAllergies from "./nurse-care-plan/AddAllergies";
import Vitals from "./nurse-care-plan/Vitals";
import TreatmentsSheet from "./nurse-care-plan/TreatmentsSheet";
import ECTScan from "./nurse-care-plan/ECTScan";
import TCAAppointments from "./nurse-care-plan/TCAAppointments";
import DailyProcess from "./nurse-care-plan/DailyProcess";
import Diagnosis from "../../pages/doctorsViews/Doctor-Forms/Diagnosis";
import useAuth from "../../hooks/useAuth";
import Medication from "../doctorsViews/Doctor-Forms/Medication";
import {
  FileOutlined,
  FileMarkdownOutlined,
  MedicineBoxOutlined,
  SolutionOutlined,
  BorderlessTableOutlined,
} from "@ant-design/icons";
import VisitorsList from "./nurse-forms/VisitorsList";
import SuicidalForm from "./nurse-forms/SuicidalForm";
import MentalStateExaminationForm from "./nurse-forms/MentalStateExaminationForm";
import BriefMentalStateExaminationForm from "./nurse-forms/BriefMentalStateExaminationForm";
import DietaryIntakeForm from "./nurse-forms/DietaryIntakeForm";
import JacksonVisualForm from "./nurse-forms/JacksonVisualForm";
import CarePlanForm from "./nurse-forms/CarePlanForm";

const CarePlan = () => {
  const [activeItem, setActiveItem] = useState("Allergies and Medications");
  const [selectedItem, setSelectedItem] = useState(<AddAllergies />);
  const role = useAuth().userData.departmentName;

  const handleOnClick = (item) => {
    setActiveItem(item.label);
    switch (item.label) {
      case "Allergies and Medications":
        setSelectedItem(<AddAllergies />);
        break;
      case "Vitals":
        setSelectedItem(<Vitals />);
        break;
      case "Nursing Rounds":
        setSelectedItem(<DailyProcess />);
        break;
      case "Diagnosis":
        setSelectedItem(<Diagnosis />);
        break;
      case "Prescription":
        setSelectedItem(<Medication />);
        break;
      case "Care Plan":
        setSelectedItem(<CarePlanForm />);
        break;
      case "Treatments Sheet":
        setSelectedItem(<TreatmentsSheet />);
        break;
      case "ECT Procedure":
        setSelectedItem(<ECTScan />);
        break;
      case "TCA / Appointments":
        setSelectedItem(<TCAAppointments />);
        break;
      case "Daily Ward Rounds":
        setSelectedItem(<DailyProcess />);
        break;
      case "Visitor List":
        setSelectedItem(<VisitorsList />);
        break;
      case "Suicidal Form":
        setSelectedItem(<SuicidalForm />);
        break;
      case "MSE Status Level Checklist":
        setSelectedItem(<MentalStateExaminationForm />);
        break;
      case "Brief MSE Form":
        setSelectedItem(<BriefMentalStateExaminationForm />);
        break;
      case "Dietary Intake Form":
        setSelectedItem(<DietaryIntakeForm />);
        break;
      case "Jackson Visual Form":
        setSelectedItem(<JacksonVisualForm />);
        break;
      default:
        setSelectedItem(<AddAllergies />);
        break;
    }
  };
  const menuItems = [
    { label: "Allergies and Medications", icon: <FileOutlined /> },
    { label: "Vitals", icon: <FileMarkdownOutlined /> },
    ...(role === "Doctor"
      ? [{ label: "Daily Ward Rounds", icon: <FileOutlined /> }]
      : []),
    { label: "Diagnosis", icon: <MedicineBoxOutlined /> },
    { label: "Prescription", icon: <SolutionOutlined /> },
    ...(role === "Nurse"
      ? [
          { label: "Care Plan", icon: <BorderlessTableOutlined /> },
          { label: "Treatments Sheet", icon: <FileOutlined /> },
          { label: "Visitor List", icon: <FileOutlined /> },
          { label: "Suicidal Form", icon: <FileOutlined /> },
          { label: "MSE Status Level Checklist", icon: <FileOutlined /> },
          { label: "Brief MSE Form", icon: <FileOutlined /> },
          { label: "Dietary Intake Form", icon: <FileOutlined /> },
          { label: "Jackson Visual Form", icon: <FileOutlined /> },
        ]
      : []),
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

export default CarePlan;
