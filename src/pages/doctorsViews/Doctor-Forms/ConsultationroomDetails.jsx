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
import FourPsForm from './FourPsForm';
import SuicidalForm from '../../nurse-view/nurse-forms/SuicidalForm';

const ConsultationroomDetails = ({ treatmentNo, observationNo, patientNo }) => {
  // Function to handle the button clicks and set the corresponding component
  const handleOnClick = (item) => {
    switch (item) {
      case "Patient History Notes":
        setSelectedItem(<PatientSigns treatmentNo={treatmentNo} observationNo={observationNo} patientNo={patientNo} />);
        break;
      case "Mental Sytemic Examination Form":
        setSelectedItem(<PatientSymptoms treatmentNo={treatmentNo} />);
        break;
      case "Diagnosis Formulation":
        setSelectedItem(<Diagnosis />);
        break;
      case "Doctor Notes":
        setSelectedItem(<DoctorNotes treatmentNo={treatmentNo} patientNo={patientNo} />);
        break;
        case "Aetiology":
        setSelectedItem(<FourPsForm treatmentNo={treatmentNo} observationNo={observationNo} patientNo={patientNo} />);
        break;
      case "Suicide Risk Assessment":
        setSelectedItem(<SuicidalForm />);
        break;
      default:
        setSelectedItem(<PatientSigns treatmentNo={treatmentNo} observationNo={observationNo} patientNo={patientNo} />);
    }
  };

  // Default selected item on first render
  const [selectedItem, setSelectedItem] = useState(<PatientSigns treatmentNo={treatmentNo} observationNo={observationNo} patientNo={patientNo} />);

  // Button items array to map through
  const buttonItems = [
    { label: "Patient History Notes", icon: <SolutionOutlined /> },
    { label: "Mental Systemic Examination Form", icon: <SolutionOutlined /> },
    { label: "Diagnosis Formulation", icon: <MedicineBoxOutlined /> },
    { label: "Doctor Notes", icon: <FaNotesMedical /> },
    { label: "Aetiology", icon: <HeartOutlined /> },
    { label: "Suicide Risk Assessment", icon: <HeartOutlined /> }
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
