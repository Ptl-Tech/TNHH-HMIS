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
import { UserOutlined, FileMarkdownOutlined, FileProtectOutlined, ExperimentOutlined, FilterOutlined, UserAddOutlined } from "@ant-design/icons";

const PatientFile = ({ patientDetails }) => {
  const [activeItem, setActiveItem] = useState('Patient Info');
  const userRole = useAuth();
  
  const [selectedItem, setSelectedItem] = useState(<PatientInfo patientDetails={patientDetails} />);

  // Define menu items conditionally
  const menuItems = [
    {label: "Patient Info", icon: <UserOutlined />},
    // "Medical Info",
    {label: "Next of Kin", icon: <UserAddOutlined />},
    ...(userRole.userData.departmentName === "Doctor" ? [{ label: 'Past Doctor Notes', icon: <FileMarkdownOutlined /> }] : []),
    {label: "Nursing Notes", icon: <FileProtectOutlined />},
    {label: "Past Encounters Notes", icon: <ExperimentOutlined />},
    // "Consumables",
    ...(userRole.userData.departmentName === "Nurse" ? [{label: "Order Sheet", icon: <FilterOutlined />}] : []),

    // ...(userRole.userData.departmentName === "Doctor" ? ["TCA"] : []),
  ];

  const handleOnClick = (item) => {
    setActiveItem(item.label);
    switch (item.label) {
      case "Patient Info":
        setSelectedItem(<PatientInfo patientDetails={patientDetails} />);
        break;
      // case "Medical Info":
      //   setSelectedItem(<MedicalInfo />);
      //   break;
      case "Next of Kin":
        setSelectedItem(<NextOfKin />);
        break;
      case "Past Doctor Notes":
        setSelectedItem(<DoctorNotes />);
        break;
      case "Nursing Notes":
        setSelectedItem(<NursingNotes />);
        break;
      case "Past Encounters Notes":
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
            style={{ backgroundColor: "#0f5689", color: "#ffffff", border: "none", padding: "18px 20px" }}
            className={activeItem === item.label ? "active-button" : ""}
            onClick={() => handleOnClick(item)}
          >
            {item.icon}
            {item.label}
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