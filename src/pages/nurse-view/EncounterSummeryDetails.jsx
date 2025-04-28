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
import InpatientMedication from "./nurse-care-plan/InpatientMedication";
import Ketamine from "../doctorsViews/Doctor-Forms/Ketamine";
import PatientSigns from "../doctorsViews/Doctor-Forms/PatientSigns";
import PhysicalExamination from "../doctorsViews/DocAdmission-views/PhysicalExamintaion";
import PatientSymptoms from "../doctorsViews/Doctor-Forms/PatientSyptoms";
import PastMedicalHistory from "../doctorsViews/Doctor-Forms/PastMedicalHistory";
import FourPsForm from "../doctorsViews/Doctor-Forms/FourPsForm";

const EncounterSummeryDetails = () => {
  const [activeItem, setActiveItem] = useState("Triage");
  const [selectedItem, setSelectedItem] = useState("Triage");
  const dispatch = useDispatch();
  const location = useLocation();
  const patientDetails = location.state?.patientDetails;
  const admissionNo = new URLSearchParams(location.search).get("AdmNo");

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
    { label: "Ketamine", icon: <DeliveredProcedureOutlined /> },
    // { label: "Patient History Notes", icon: <PatientSigns /> },
    // { label: "Physical Examination", icon: <PhysicalExamination /> },
    // { label: "Mental Status Exam", icon: <PatientSymptoms /> },
    // { label: "Past Medical History", icon: <PastMedicalHistory /> },
    // { label: "Diagnosis Formulation", icon: <Diagnosis /> },
    // { label: "Aetiology", icon: <FourPsForm /> },

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
        setSelectedItem(admissionNo != null ? <InpatientMedication /> : <Medication />);
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
      case "Ketamine":
        setSelectedItem(<Ketamine />);
        break;
      case "Patient History Notes":
        selectedItem(<PatientSigns />);
        break;
      case "Physical Examination":
        setSelectedItem(<PhysicalExamination />);
        break;
      case "Mental Status Exam":
        setSelectedItem(<PatientSymptoms />);
        break;
      case "Past Medical History":
        setSelectedItem(<PastMedicalHistory />);
        break;
      case "Diagnosis Formulation":
        setSelectedItem(<Diagnosis />);
        break;
      case "Aetiology":
        setSelectedItem(<FourPsForm />);
        break;
      case "Medication":
        setSelectedItem(<Medication />);
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
