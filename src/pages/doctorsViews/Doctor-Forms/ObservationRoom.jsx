import React, { useState } from "react";
import Vitals from "../Vitals";
import AddAllergies from "../AddAllergies";
import AllergyAndMedication from "../../nurse-view/forms/triage-forms/AllergyAndMedication";
import Injections from "../../nurse-view/forms/triage-forms/Injections";
import { Button, Typography } from "antd";
import {
  HeartOutlined,
  SolutionOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons"; // Import icons
import DoctorNotes from "./DoctorNotes";
import Diagnosis from "./Diagnosis";
import FormVitals from "../Vitals";
import PatientSigns from "./PatientSigns";
import PatientSymptoms from "./PatientSyptoms";

const { Title } = Typography;

const ObservationRoom = ({ treatmentNo, observationNo,patientNo }) => {
  const handleOnClick = (item) => {
    switch (item) {
      case "Vitals":
        setSelectedItem(<FormVitals treatmentNo={treatmentNo} observationNo={observationNo} patientNo={patientNo} />);
        break;
      case "Add Patient Signs":
        setSelectedItem(<PatientSigns treatmentNo={treatmentNo} />);
        break;
        case "Add Patient Syptoms":
        setSelectedItem(<PatientSymptoms treatmentNo={treatmentNo} />);
        break;
      case "Diagnosis":
        setSelectedItem(<Diagnosis />);
        break;
      default:
        setSelectedItem(<FormVitals />);
    }
  };

  const [selectedItem, setSelectedItem] = useState(<FormVitals treatmentNo={treatmentNo} observationNo={observationNo} patientNo={patientNo} />);

  const buttonItems = [
    { label: "Vitals", icon: <HeartOutlined /> },
    { label: "Add Patient Signs", icon: <SolutionOutlined /> },
    { label: "Add Patient Syptoms", icon: <SolutionOutlined /> },
    { label: "Diagnosis", icon: <MedicineBoxOutlined /> },

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
            style={{ backgroundColor: "#0f5689", display: "flex", alignItems: "center", gap: "5px" }}
            onClick={() => handleOnClick(item.label)}
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

export default ObservationRoom;
