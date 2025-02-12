import { useState } from "react";
import { Button } from "antd";
import {
  HeartOutlined,
  SolutionOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
// Import components
import PatientSigns from "./PatientSigns";
import PatientSymptoms from "./PatientSyptoms";
import Diagnosis from "./Diagnosis";
import FourPsForm from "./FourPsForm";
import PhysicalExamintaion from "../DocAdmission-views/PhysicalExamintaion";
import PsychologyNotes from "./PsychologyNotes";
import PastMedicalHistory from "./PastMedicalHistory";
import useAuth from "../../../hooks/useAuth";
import PropTypes from "prop-types";
import PastEncounters from "./PastEncounters";
import { useLocation } from "react-router-dom";

const ConsultationroomDetails = ({
  treatmentNo,
  observationNo,
  patientNo,
  moveToNextTab,
}) => {

  const location = useLocation();
  const patientDetails = location.state?.patientDetails;
  const role = useAuth().userData.departmentName;
  const [activeItem, setActiveItem] = useState("Patient History Notes");
  
  const [selectedItem, setSelectedItem] = useState(
    <PatientSigns
      treatmentNo={treatmentNo}
      observationNo={observationNo}
      patientNo={patientNo}
      moveToNextTab={() => handleOnClick({ label: "Physical Examination" })} // Pass the next tab handler
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
            moveToNextTab={() =>
              handleOnClick({
                label:
                  role === "Doctor"
                    ? "Physical Examination"
                    : "Mental Status Exam",
              })
            }
          />
        );
        break;
      case "Physical Examination":
        setSelectedItem(
          <PhysicalExamintaion
            treatmentNo={treatmentNo}
            patientNo={patientNo}
            moveToNextTab={() => handleOnClick({ label: "Mental Status Exam" })}
          />
        );
        break;
      case "Mental Status Exam":
        setSelectedItem(
          <PatientSymptoms
            treatmentNo={treatmentNo}
            patientNo={patientNo}
            moveToNextTab={() =>
              handleOnClick({ label: "Diagnosis Formulation" })
            }
          />
        );
        break;
      case "Past Medical History":
        setSelectedItem(
          <PastMedicalHistory
            treatmentNo={treatmentNo}
            patientNo={patientNo}
            moveToNextTab={() =>
              handleOnClick({ label: "Diagnosis Formulation" })
            }
          />
        );
        break;
      case "Diagnosis Formulation":
        setSelectedItem(
          <Diagnosis
            moveToNextTab={() => handleOnClick({ label: "Aetiology" })}
          />
        );
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
            moveToNextTab={() =>
              handleOnClick({ label: "Patient History Notes" })
            }
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
      case "Doctor Notes":
        setSelectedItem(
          <PastEncounters
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
            moveToNextTab={() =>
              handleOnClick({ label: "Physical Examination" })
            }
          />
        );
    }
  };

  const buttonItems = [
    { label: "Patient History Notes", icon: <SolutionOutlined /> },
    ...(role === "Doctor"
      ? [{ label: "Physical Examination", icon: <HeartOutlined /> }]
      : []),
    { label: "Mental Status Exam", icon: <SolutionOutlined /> },
    // { label: "Past Medical History", icon: <SolutionOutlined /> },
    { label: "Diagnosis Formulation", icon: <MedicineBoxOutlined /> },
    // { label: "Past Encounters Notes", icon: <FaNotesMedical /> },
    { label: "Aetiology", icon: <HeartOutlined /> },
    ...(role === "Doctor"
      ? [{ label: "Psychology Notes", icon: <HeartOutlined /> }]
      : []),

    ...(role === "Psychology" && patientDetails.Status !== 'Completed'
      ? [{ label: "Doctor Notes", icon: <HeartOutlined /> }]
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
      </div>

      <div>{selectedItem}</div>
    </>
  );
};

export default ConsultationroomDetails;
// propTypes
ConsultationroomDetails.propTypes = {
  treatmentNo: PropTypes.string,
  observationNo: PropTypes.string,
  patientNo: PropTypes.string,
};
