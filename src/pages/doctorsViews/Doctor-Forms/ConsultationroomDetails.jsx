import React, { useState } from 'react';
import { Button } from 'antd';
import {
  HeartOutlined,
  SolutionOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
} from "@ant-design/icons"; // Import icons
import { FaNotesMedical } from 'react-icons/fa';

// Import the components for each label
import PatientSigns from './PatientSigns';
import PatientSymptoms from './PatientSyptoms';
import Diagnosis from './Diagnosis';
import SickOff from './SickOff'; // Import SickOff component
import DoctorNotes from '../../nurse-view/nurse-patient-file/DoctorNotes';

const ConsultationroomDetails = ({ treatmentNo, observationNo, patientNo }) => {
  // Function to handle the button clicks and set the corresponding component
  const handleOnClick = (item) => {
    switch (item) {
      case "Add Patient Signs":
        setSelectedItem(<PatientSigns treatmentNo={treatmentNo} observationNo={observationNo} patientNo={patientNo} />);
        break;
      case "Add Patient Symptoms":
        setSelectedItem(<PatientSymptoms treatmentNo={treatmentNo} />);
        break;
      case "Diagnosis":
        setSelectedItem(<Diagnosis />);
        break;
      case "Doctor Notes":
        setSelectedItem(<DoctorNotes treatmentNo={treatmentNo} patientNo={patientNo} />);
        break;
      case "Sick Off":
        setSelectedItem(<SickOff />);
        break;
      default:
        setSelectedItem(<PatientSigns treatmentNo={treatmentNo} observationNo={observationNo} patientNo={patientNo} />);
    }
  };

  // Default selected item on first render
  const [selectedItem, setSelectedItem] = useState(<PatientSigns treatmentNo={treatmentNo} observationNo={observationNo} patientNo={patientNo} />);

  // Button items array to map through
  const buttonItems = [
    { label: "Add Patient Signs", icon: <SolutionOutlined /> },
    { label: "Add Patient Symptoms", icon: <SolutionOutlined /> },
    { label: "Diagnosis", icon: <MedicineBoxOutlined /> },
    { label: "Doctor Notes", icon: <FaNotesMedical /> },
    { label: "Sick Off", icon: <CalendarOutlined /> }
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
        {/* Render buttons dynamically from buttonItems array */}
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
            onClick={() => handleOnClick(item.label)} // Handle button click
          >
            {item.icon} {item.label}
          </Button>
        ))}
      </div>

      {/* Display the selected component */}
      <div>{selectedItem}</div>
    </>
  );
};

export default ConsultationroomDetails;
