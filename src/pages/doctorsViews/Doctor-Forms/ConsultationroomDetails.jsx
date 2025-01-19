import React, { useState } from "react";
import { Button } from "antd";
import {
  HeartOutlined,
  SolutionOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import { FaNotesMedical } from "react-icons/fa";

// Import components
import PatientSigns from "./PatientSigns";
import PatientSymptoms from "./PatientSyptoms";
import Diagnosis from "./Diagnosis";
import SickOff from "./SickOff";
import DoctorNotes from "../../nurse-view/nurse-patient-file/DoctorNotes";
import FourPsForm from "./FourPsForm";
import SuicidalForm from "../../nurse-view/nurse-forms/SuicidalForm";
import PhysicalExamintaion from "../DocAdmission-views/PhysicalExamintaion";
import PsychologyNotes from "./PsychologyNotes";
import PastMedicalHistory from "./PastMedicalHistory";
import TreatmentHistoryTable from "../../nurse-view/tables/nurse-tables/TreatmentHistoryTable";

const ConsultationroomDetails = ({ treatmentNo, observationNo, patientNo }) => {
  const [activeItem, setActiveItem] = useState('Patient History Notes');
  const [selectedItem, setSelectedItem] = useState(
    <PatientSigns
      treatmentNo={treatmentNo}
      observationNo={observationNo}
      patientNo={patientNo}
    />
  );

  const handleOnClick = (item) => {
    setActiveItem(item.label);
    switch (item.label) {
      case "Patient History Notes":
        setSelectedItem(
          <PatientSigns
            treatmentNo={treatmentNo}
            observationNo={observationNo}
            patientNo={patientNo}
          />
        );
        break;
      case "Physical Examination":
        setSelectedItem(<PhysicalExamintaion treatmentNo={treatmentNo} patientNo={patientNo}/>);
        break;
      case "Mental Status Exam":
        setSelectedItem(
          <PatientSymptoms treatmentNo={treatmentNo} patientNo={patientNo} />
        );
        break;
        case "Past Medical History":
        setSelectedItem(
          <PastMedicalHistory treatmentNo={treatmentNo} patientNo={patientNo} />
        )
        break;
      case "Diagnosis Formulation":
        setSelectedItem(<Diagnosis />);
        break;
      // case "Past Encounters Notes":
      //   setSelectedItem(
      //     // <DoctorNotes treatmentNo={treatmentNo} patientNo={patientNo} />
      //     <TreatmentHistoryTable />
      //   );
      //   break;
      case "Aetiology":
        setSelectedItem(
          <FourPsForm
            treatmentNo={treatmentNo}
            observationNo={observationNo}
            patientNo={patientNo}
          />
        );
        break;
      case "Psychology Notes":
        setSelectedItem(
          <PsychologyNotes
            treatmentNo={treatmentNo}
            observationNo={observationNo}
            patientNo={patientNo}
          />
        );
        break;
      default:
        setSelectedItem(
          <PatientSigns
            treatmentNo={treatmentNo}
            observationNo={observationNo}
            patientNo={patientNo}
          />
        );
    }
  };

  const buttonItems = [
    { label: "Patient History Notes", icon: <SolutionOutlined /> },
    { label: "Physical Examination", icon: <HeartOutlined /> },
    { label: "Mental Status Exam", icon: <SolutionOutlined /> },
    { label: "Past Medical History", icon: <SolutionOutlined /> },
    { label: "Diagnosis Formulation", icon: <MedicineBoxOutlined /> },
    // { label: "Past Encounters Notes", icon: <FaNotesMedical /> },
    { label: "Aetiology", icon: <HeartOutlined /> },
    { label: "Psychology Notes", icon: <HeartOutlined /> },
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
        {buttonItems.map((item, index) => (
                  <Button
                    key={index}
                    style={{ backgroundColor: "#0f5689", color: "#ffffff", border: "none", padding: "18px 20px" }}
                    className={activeItem === item.label ? "active-button" : ""}
                    onClick={() => handleOnClick(item)}
                  >
                    {item.icon}
                    {item.label}
                  </Button>
          ))}
      </div>

      <div>{selectedItem}</div>
    </>
  );
};

export default ConsultationroomDetails;
