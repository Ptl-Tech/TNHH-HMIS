import { Button, Divider } from "antd";
import { useState } from "react";
import PatientInfo from "./nurse-patient-file/PatientInfo";
import MedicalInfo from "./nurse-patient-file/MedicalInfo";
import NextOfKin from "./nurse-patient-file/NextOfKin";
import DoctorNotes from "./nurse-patient-file/DoctorNotes";
import NursingNotes from "./nurse-patient-file/NursingNotes";
import TreatmentHistory from "./nurse-patient-file/TreatmentHistory";
import Consumables from "./nurse-patient-file/Consumables";
import PropTypes from "prop-types";
import useAuth from "../../hooks/useAuth";
import TCAAppointments from "./nurse-care-plan/TCAAppointments";

const PatientFile = ({ patientDetails }) => {
  const userRole = useAuth();
  const [selectedItem, setSelectedItem] = useState(<PatientInfo patientDetails={patientDetails} />);

  // Define menu items conditionally
  const menuItems = [
    "Patient Info",
    "Medical Info",
    "Next of Kin",
    ...(userRole.userData.departmentName === "Doctor" ? ["Doctor Notes"] : []),
    "Nursing Notes",
    "Treatments History",
    "Consumables",
    ...(userRole.userData.departmentName === "Doctor" ? ["Charges"] : []),

    ...(userRole.userData.departmentName === "Doctor" ? ["TCA"] : []),
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
      case "Consumables":
        setSelectedItem(<Consumables />);
        break;
      case "Charges":
        setSelectedItem(<Charges/>);
        break;
        case "TCA":
        setSelectedItem(<TCAAppointments/>);
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
            {
                selectedItem === 'Patient Info' ? <PatientInfo /> : selectedItem
            }
      </div>
    </>
  );
};

export default PatientFile;

// Props validation
PatientFile.propTypes = {
  patientDetails: PropTypes.object.isRequired,
};
