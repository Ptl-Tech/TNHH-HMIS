import { Button, Divider } from "antd";
import { useState } from "react";
import PatientInfo from "./nurse-patient-file/PatientInfo";
import MedicalInfo from "./nurse-patient-file/MedicalInfo";
import NextOfKin from "./nurse-patient-file/NextOfKin";
import DoctorNotes from "./nurse-patient-file/DoctorNotes";
import NursingNotes from "./nurse-patient-file/NursingNotes";
import TreatmentHistory from "./nurse-patient-file/TreatmentHistory";
import Charges from "./nurse-patient-file/Charges";
import Consumables from "./nurse-patient-file/Consumables";
import PropTypes from "prop-types";
import useAuth from "../../hooks/useAuth";

const PatientFile = ({ patientDetails }) => {
  const userRole = useAuth();
  const [selectedItem, setSelectedItem] = useState("Patient Info");

  // Define menu items conditionally
  const menuItems = [
    "Patient Info",
    "Medical Info",
    "Next of Kin",
    ...(userRole.userData.departmentName === "Nurse" ? ["Doctor Notes"] : []),
    "Nursing Notes",
    "Treatments History",
    "Charges",
    "Consumables",
  ];

  const handleOnClick = (item) => {
    switch (item) {
      case "Patient Info":
        setSelectedItem(<PatientInfo patientDetails={patientDetails} />);
        break;
      case "Medical Info":
        setSelectedItem(<MedicalInfo />);
        break;
      case "Next of Kin":
        setSelectedItem(<NextOfKin />);
        break;
      case "Doctor Notes":
        setSelectedItem(<DoctorNotes />);
        break;
      case "Nursing Notes":
        setSelectedItem(<NursingNotes />);
        break;
      case "Treatments History":
        setSelectedItem(<TreatmentHistory />);
        break;
      case "Charges":
        setSelectedItem(<Charges />);
        break;
      case "Consumables":
        setSelectedItem(<Consumables />);
        break;
      default:
        setSelectedItem(<PatientInfo />);
    }
  };

  return (
    <>
      <div style={{ display: "flex", flex: 1, gap: "10px", flexWrap: "wrap" }}>
        {menuItems.map((item, index) => (
          <Button
            key={index}
            type="primary"
            onClick={() => handleOnClick(item)}
          >
            {item}
          </Button>
        ))}
      </div>
      <Divider />
      <div className="patient-file-content">
        {selectedItem}
      </div>
    </>
  );
};

export default PatientFile;

// Props validation
PatientFile.propTypes = {
  patientDetails: PropTypes.object.isRequired,
};
