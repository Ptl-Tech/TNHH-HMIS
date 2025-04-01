import { Button } from "antd";
import TreatmentCardInfo from "./TreatmentCardInfo";
import { useEffect, useState } from "react";
import VitalsTable from "./tables/triage-tables/VitalsTable";
import Diagnosis from "../doctorsViews/Doctor-Forms/Diagnosis";
import Medication from "../doctorsViews/Doctor-Forms/Medication";
import LabResults from "../doctorsViews/Doctor-Forms/LabResults";
import Imaging from "../doctorsViews/Doctor-Forms/Imaging";
import ECTScan from "./nurse-care-plan/ECTScan";
import {
  VerticalAlignTopOutlined,
  DeliveredProcedureOutlined,
  ExperimentOutlined,
  SnippetsOutlined,
  FileAddOutlined,
  DisconnectOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getSinglePatientAllVitalsLines } from "../../actions/triage-actions/getVitalsLinesSlice";
import { useLocation } from "react-router-dom";

const EncounterSummeryDetails = () => {
  const [activeItem, setActiveItem] = useState("Triage");
  const [selectedItem, setSelectedItem] = useState("Triage");
  const dispatch = useDispatch();
  const location = useLocation();
  const patientDetails = location.state?.patientDetails;

  console.log("Patient number", patientDetails?.PatientNo)

  const { loading:loadingVitalsLines, data: vitalsLines } = useSelector(
    (state) => state.getPatientVitals
  );

  const menuItems = [
    { label: "Triage", icon: <SnippetsOutlined /> },
    { label: "Diagnosis", icon: <FileAddOutlined /> },
    { label: "Prescription", icon: <DisconnectOutlined /> },
    { label: "Laboratory", icon: <ExperimentOutlined /> },
    { label: "Radiology", icon: <DeliveredProcedureOutlined /> },
    { label: "ECT", icon: <VerticalAlignTopOutlined /> },
  ];

  const handleOnClick = (item) => {
    setActiveItem(item.label);
    switch (item.label) {
      case "Triage":
        setSelectedItem(
          <VitalsTable
            filterVitals={vitalsLines}
            loadingInpatientVitals={loadingVitalsLines}
          />
        );
        break;
      case "Diagnosis":
        setSelectedItem(<Diagnosis />);
        break;
      case "Prescription":
        setSelectedItem(<Medication />);
        break;
      case "Laboratory":
        setSelectedItem(<LabResults />);
        break;
      case "Radiology":
        setSelectedItem(<Imaging />);
        break;
      case "ECT":
        setSelectedItem(<ECTScan />);
        break;
      default:
        setSelectedItem(<VitalsTable />);
    }
  };

  useEffect(() => {
    dispatch(getSinglePatientAllVitalsLines(patientDetails?.PatientNo));
  }, [dispatch, patientDetails?.PatientNo]);

  return (
    <div>
      <TreatmentCardInfo />
      <div
        style={{
          display: "flex",
          flex: 1,
          gap: "10px",
          flexWrap: "wrap",
          paddingTop: "40px",
        }}
      >
        {menuItems.map((item, index) => (
          <Button
            key={index}
            className={activeItem === item.label ? "active-button" : ""}
            onClick={() => handleOnClick(item)}
          >
            {item.icon}
            {item.label}
          </Button>
        ))}
      </div>
      <div className="patient-file-content" style={{ paddingTop: "20px" }}>
        {selectedItem === "Triage" ? (
          <VitalsTable
            filterVitals={vitalsLines}
            loadingInpatientVitals={loadingVitalsLines}
          />
        ) : (
          selectedItem
        )}
      </div>
    </div>
  );
};

export default EncounterSummeryDetails;
