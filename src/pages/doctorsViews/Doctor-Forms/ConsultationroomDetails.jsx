import React, { useState } from 'react'
import {
  HeartOutlined,
  SolutionOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
} from "@ant-design/icons"; // Import icons
import { Button, Typography } from "antd";

import PatientSigns from './PatientSigns';
import PatientSymptoms from './PatientSyptoms';
import Diagnosis from './Diagnosis';
import { FaNotesMedical } from 'react-icons/fa';
const ConsultationroomDetails = ({ treatmentNo, observationNo,patientNo }) => {
  const handleOnClick = (item) => {
    switch (item) {
      
      case "Add Patient Signs":
        setSelectedItem(<PatientSigns treatmentNo={treatmentNo} />);
        break;
        case "Add Patient Syptoms":
        setSelectedItem(<PatientSymptoms treatmentNo={treatmentNo} />);
        break;
      case "Diagnosis":
        setSelectedItem(<Diagnosis />);
        break;
        // case "Doctor Notes":
        // setSelectedItem(<DoctorNotes />);
        // break;
        // case "Sick Off":
        // setSelectedItem(<SickOff />);
        // break;

      default:

        setSelectedItem(<PatientSigns />);
    }
  };

  const [selectedItem, setSelectedItem] = useState(<PatientSigns treatmentNo={treatmentNo} observationNo={observationNo} patientNo={patientNo} />);

  const buttonItems = [
    { label: "Add Patient Signs", icon: <SolutionOutlined /> },
    { label: "Add Patient Syptoms", icon: <SolutionOutlined /> },
    { label: "Diagnosis", icon: <MedicineBoxOutlined /> },
    { label: "Doctor Notes", icon: <FaNotesMedical /> },
    {
      label: "Sick Off",
      icon: < CalendarOutlined/>,
    }
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
}

export default ConsultationroomDetails