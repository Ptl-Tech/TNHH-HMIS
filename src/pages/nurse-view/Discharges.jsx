import { Button, Divider, message, Modal } from "antd";
import { useState } from "react";
import Summery from "./discharges/Summery";
import SickOff from "./discharges/SickOff";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  POST_INITIATE_DISCHARGE_FAILURE,
  POST_INITIATE_DISCHARGE_SUCCESS,
  postInitiateDischargeSlice,
} from "../../actions/nurse-actions/postInitiateDischargeSlice";
import useAuth from "../../hooks/useAuth";
import {
  FileMarkdownOutlined,
  FileOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import InitiateDischarge from "./discharges/InitiateDischarge";
import InpatientMedication from "./nurse-care-plan/InpatientMedication";

const Discharges = () => {
  const role = useAuth().userData.departmentName;
  const [selectedItem, setSelectedItem] = useState(
    role === "Doctor" ? "Initiate Discharge" : "Summary"
  );
  const dispatch = useDispatch();
  const { patientDetails } = useLocation().state;
  const { confirm } = Modal;
  const [activeItem, setActiveItem] = useState(() =>
    role === "Nurse" ? "Summary" : "Initiate Discharge"
  );

  const handleInitiateDischargeAction = async () => {
    try {
      const result = await dispatch(
        postInitiateDischargeSlice("/Inpatient/InitiateDischarge", {
          admissionNo: patientDetails?.CurrentAdmNo,
        })
      );

      if (result.type === POST_INITIATE_DISCHARGE_SUCCESS) {
        message.success(
          result.payload.message ||
            `${
              patientDetails?.PatientName || patientDetails?.SearchName
            } discharge initiated successfully!`
        );
        return Promise.resolve(); // Resolve the Promise to close the modal
      } else if (result.type === POST_INITIATE_DISCHARGE_FAILURE) {
        message.error(
          result.payload.message ||
            "An error occurred while initiating patient discharge, please try again."
        );
        return Promise.reject(); // Reject the Promise to keep the modal open
      }
    } catch (error) {
      message.error(error.message || "Unexpected error occurred");
      return Promise.reject(); // Reject on unexpected errors
    }
  };

  const handleInitiateDischarge = () => {
    confirm({
      title: "Confirm Initiate Discharge",
      content: `Are you sure you want to initiate discharge for ${
        patientDetails?.PatientName || patientDetails?.SearchName
      } ?`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        return new Promise((resolve, reject) => {
          handleInitiateDischargeAction(patientDetails?.AdmissionNo)
            .then(resolve) // Resolve the modal when successful
            .catch(reject); // Reject on failure
        });
      },
    });
  };

  const handleOnClick = (item) => {
    setActiveItem(item.label);
    switch (item.label) {
      case "Initiate Discharge":
        // handleInitiateDischarge();
        setSelectedItem(
          <InitiateDischarge
            handleInitiateDischarge={handleInitiateDischarge}
          />
        );
        break;
      case "Summary":
        setSelectedItem(<Summery />);
        break;
      case "Discharge Medication":
        setSelectedItem(<InpatientMedication />);
        break;
      case "Sick Off":
        setSelectedItem(<SickOff />);
        break;
      default:
        setSelectedItem(
          <InitiateDischarge
            handleInitiateDischarge={handleInitiateDischarge}
          />
        );
    }
  };
  const menuItems = [
    ...(role === "Nurse"
      ? []
      : [{ label: "Initiate Discharge", icon: <FileOutlined /> }]),
    { label: "Summary", icon: <FileOutlined /> },
    { label: "Discharge Medication", icon: <FileMarkdownOutlined /> },
    { label: "Sick Off", icon: <UserAddOutlined /> },
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
        {menuItems.map((item, index) => (
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

      <Divider />
      <div className="patient-file-content">
        {selectedItem === "Initiate Discharge" ? (
          <InitiateDischarge
            handleInitiateDischarge={handleInitiateDischarge}
          />
        ) : (
          selectedItem
        )}
      </div>
    </>
  );
};

export default Discharges;
