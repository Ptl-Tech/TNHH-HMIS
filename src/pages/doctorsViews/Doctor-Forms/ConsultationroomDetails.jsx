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

const ConsultationroomDetails = ({ treatmentNo, observationNo, patientNo }) => {
  const [selectedItem, setSelectedItem] = useState(
    <PatientSigns
      treatmentNo={treatmentNo}
      observationNo={observationNo}
      patientNo={patientNo}
    />
  );

  const handleOnClick = (item) => {
    switch (item) {
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
        setSelectedItem(<PhysicalExamintaion />);
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
      case "Past Encounters Notes":
        setSelectedItem(
          <DoctorNotes treatmentNo={treatmentNo} patientNo={patientNo} />
        );
        break;
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
    { label: "Past Encounters Notes", icon: <FaNotesMedical /> },
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
            type="primary"
            style={{
              backgroundColor: "#0f5689",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
            onClick={() => handleOnClick(item.label)}
          >
            {item.icon} {item.label}
          </Button>
        ))}
      </div>

      <div>{selectedItem}</div>
    </>
  );
};

export default ConsultationroomDetails;
