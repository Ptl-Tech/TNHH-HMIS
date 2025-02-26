import { useState } from "react";
import AllergyAndMedication from "../../nurse-view/forms/triage-forms/AllergyAndMedication";
import { Button } from "antd";
import {
  HeartOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons"; // Import icons
import FormVitals from "../Vitals";
import PropTypes from "prop-types";
import ObservationNotes from "../ConsultationCard/ObservationNotes";

const ObservationRoom = ({ treatmentNo, observationNo, patientNo }) => {
  const [activeItem, setActiveItem] = useState('Vitals');
  const handleOnClick = (item) => {
    setActiveItem(item.label);
    switch (item.label) {
      case "Vitals":
        setSelectedItem(<FormVitals treatmentNo={treatmentNo} observationNo={observationNo} patientNo={patientNo} />);
        break;
      case 'Allergies and Medications':
        setSelectedItem(<AllergyAndMedication treatmentNo={treatmentNo} observationNumber={observationNo} patientNumber={patientNo} setIsFormVisible={false} />);
        break;
      case 'Nurse Notes':
        setSelectedItem(<ObservationNotes treatmentNo={treatmentNo} patientNo={patientNo} />);
        break;
      default:

        setSelectedItem(<FormVitals />);
    }
  };

  const [selectedItem, setSelectedItem] = useState(<FormVitals treatmentNo={treatmentNo} observationNo={observationNo} patientNo={patientNo} />);

  const buttonItems = [
    { label: "Vitals", icon: <HeartOutlined /> },
    { label: "Allergies and Medications", icon: <MedicineBoxOutlined /> },
    { label: "Nurse Notes", icon: <MedicineBoxOutlined /> },

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

export default ObservationRoom;

ObservationRoom.propTypes = {
  treatmentNo: PropTypes.string,
  observationNo: PropTypes.string,
  patientNo: PropTypes.string,
}