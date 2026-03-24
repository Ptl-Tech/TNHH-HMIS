import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { Button, Divider } from "antd";
import { UserOutlined, UserAddOutlined } from "@ant-design/icons";

import NextOfKin from "./nurse-patient-file/NextOfKin";
import PatientInfo from "./nurse-patient-file/PatientInfo";
import TCAAppointments from "./nurse-care-plan/TCAAppointments";

import { getOutPatientTreatmentList } from "../../actions/Doc-actions/OutPatientAction";

const PatientFile = ({ patientDetails }) => {
  const [activeItem, setActiveItem] = useState("Patient Info");

  const dispatch = useDispatch();

  const [selectedItem, setSelectedItem] = useState(
    <PatientInfo patientDetails={patientDetails} />
  );

  // Define menu items conditionally
  const menuItems = [
    { label: "Patient Info", icon: <UserOutlined /> },
    { label: "Next of Kin", icon: <UserAddOutlined /> },
  ];

  useEffect(() => {
    dispatch(getOutPatientTreatmentList());
  }, [dispatch]);

  const handleOnClick = (item) => {
    setActiveItem(item.label);
    switch (item.label) {
      case "Patient Info":
        setSelectedItem(<PatientInfo />);
        break;
      case "Next of Kin":
        setSelectedItem(<NextOfKin />);
        break;
      case "TCA":
        setSelectedItem(<TCAAppointments />);
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
            style={{
              backgroundColor: "#b96000",
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
      <Divider />
      <div className="patient-file-content">
        {selectedItem === "Patient Info" ? <PatientInfo /> : selectedItem}
      </div>
    </>
  );
};

export default PatientFile;
