import { Button, Divider, message, Modal } from "antd";
import { useState } from "react";
import Summery from "./discharges/Summery";
import DischargeMedication from "./discharges/DischargeMedication";
import SickOff from "./discharges/SickOff";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { POST_INITIATE_DISCHARGE_FAILURE, POST_INITIATE_DISCHARGE_SUCCESS, postInitiateDischargeSlice } from "../../actions/nurse-actions/postInitiateDischargeSlice";
import useAuth from "../../hooks/useAuth";

const Discharges = () => {
  const role = useAuth().userData.departmentName;
  const [selectedItem, setSelectedItem] = useState("Summary");
  const dispatch=useDispatch();
  const { patientDetails } = useLocation().state;
  const { confirm } = Modal;

  const handleInitiateDischargeAction = async () => {
    try {
        const result = await dispatch(
          postInitiateDischargeSlice('/Inpatient/InitiateDischarge', {
            admissionNo: patientDetails?.CurrentAdmNo,
          })
        );
    
        if (result.type === POST_INITIATE_DISCHARGE_SUCCESS) {
          message.success(
            result.payload.message || `${patientDetails?.SearchName} discharge initiated successfully!`
          );
          return Promise.resolve(); // Resolve the Promise to close the modal
        } else if (result.type === POST_INITIATE_DISCHARGE_FAILURE) {
          message.error(
            result.payload.message || 'An error occurred while initiating patient discharge, please try again.'
          );
          return Promise.reject(); // Reject the Promise to keep the modal open
        }
      } catch (error) {
        message.error(error.message || 'Unexpected error occurred');
        return Promise.reject(); // Reject on unexpected errors
      }
}



  const handleInitiateDischarge = () => {
    confirm({
        title: 'Confirm Initiate Discharge',
        content: `Are you sure you want to initiate discharge for ${patientDetails?.SearchName} ?`,
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk(){
            return new Promise((resolve, reject) => {
                handleInitiateDischargeAction(patientDetails?.AdmissionNo)
                .then(resolve) // Resolve the modal when successful
                .catch(reject); // Reject on failure
            });
        },
    })
}

  const handleOnClick = (item) => {
    switch (item) {
      case "Initiate Discharge":
        handleInitiateDischarge();
        break;
      case "Summary":
        setSelectedItem(<Summery />);
        break;
      case "Discharge Medication":
        setSelectedItem(<DischargeMedication />);
        break;
      case "Sick Off":
        setSelectedItem(<SickOff />);
        break;
      default:
        setSelectedItem(<Summery />);
    }
  };
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
        {[
        "Initiate Discharge",
        "Summary",
        "Discharge Medication",
        "Sick Off",
        ]
        .filter((item) => !(role === "Nurse" && item === "Initiate Discharge")) // Exclude "Initiate Discharge" for Nurse
        .map((item, index) => (
        <Button
        key={index}
        type="primary"
        style={{ backgroundColor: "#0f5689" }}
        onClick={() => handleOnClick(item)}
        >
        {item}
        </Button>
        ))}

      </div>

      <Divider />
      <div className="patient-file-content">
        {selectedItem === "Summary" ? <Summery /> : selectedItem}
      </div>
    </>
  );
};

export default Discharges;
