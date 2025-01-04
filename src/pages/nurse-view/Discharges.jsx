import { Button, Divider, message } from "antd";
import { useState } from "react";
import Summery from "./discharges/Summery";
import DischargeMedication from "./discharges/DischargeMedication";
import SickOff from "./discharges/SickOff";
import { useDispatch, useSelector } from "react-redux";
import { postInitiatePatientDischarge, postInpatientDischarge } from "../../actions/Doc-actions/Admission/postInitiateDischarge";

const Discharges = () => {
  const [selectedItem, setSelectedItem] = useState("Summery");
  const dispatch=useDispatch();

  const {
    loading: InitiateDischargeLoading,
    success: InitiateDischargeSuccess,
  } = useSelector((state) => state.postInitiateDischarge);
  const {
    loading: postInpatientDischargeLoading,
    success: postInpatientDischargeSuccess,
  } = useSelector((state) => state.postInpatient);
  const admnNo = new URLSearchParams(window.location.search).get("treatmentNo");

  const handleInpatientDischarge = async () => {
   const response= await dispatch(postInitiatePatientDischarge(admnNo));
   console.log(response);
    if (response.status === "success") {
    //   message.success("You have initiated patient discharge successfully");
    //   console.log("Patient discharge initiated successfully");
    // //   navigate(
    // //     `/Nurse/Discharge-list/Discharge-card?PatientNo=${patientNo}&AdmNo=${admNo}`
    // //   );
    const response = await dispatch(postInpatientDischarge(admnNo));
    if (response.status === "success") {
        setTimeout(() => {
            message.success(
                <>
                  Successfully Initiated Discharge process for Admission No: <b>{admnNo}</b>
                </>
              );  
        }, 1200);   
    }
    } else {
      message.error("Patient discharge failed");
    }
  };

  const handleOnClick = (item) => {
    switch (item) {
      case "Initiate Discharge":
        handleInpatientDischarge();
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
          "Summery",
          "Discharge Medication",
          "Sick Off",
        ].map((item, index) => (
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
        {selectedItem === "Summery" ? <Summery /> : selectedItem}
      </div>
    </>
  );
};

export default Discharges;
