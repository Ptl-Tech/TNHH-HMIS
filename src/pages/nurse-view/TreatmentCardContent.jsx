import { Button } from "antd";
import { useLocation } from "react-router-dom";
import useFetchPastDoctorVisitsHook from "../../hooks/useFetchPastDoctorVisitsHook";
import useSetTableCheckBoxHook from "../../hooks/useSetTableCheckBoxHook";
import {
  VerticalAlignTopOutlined,
  DeliveredProcedureOutlined,
  ExperimentOutlined,
  SnippetsOutlined,
  FileAddOutlined,
  DisconnectOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import VitalsTable from "./tables/triage-tables/VitalsTable";
import { useDispatch, useSelector } from "react-redux";
import { getVitalsLinesSlice } from "../../actions/triage-actions/getVitalsLinesSlice";
import EncounterListTable from "./tables/nurse-tables/EncounterListTable";
import Diagnosis from "../doctorsViews/Doctor-Forms/Diagnosis";
import Medication from "../doctorsViews/Doctor-Forms/Medication";
import LabResults from "../doctorsViews/Doctor-Forms/LabResults";
import Imaging from "../doctorsViews/Doctor-Forms/Imaging";
import ECTScan from "./nurse-care-plan/ECTScan";

const TreatmentCardContent = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const patientDetails = location.state?.patientDetails;
  const { combinedListWithDoctors } = useFetchPastDoctorVisitsHook();
  const {
    selectedRowKey,
    rowSelection,
    selectedRow,
  } = useSetTableCheckBoxHook();

  const { loadingVitalsLines, vitalsLines } = useSelector(
    (state) => state.getVitalsLines
  );

  useEffect(() => {
    dispatch(getVitalsLinesSlice(selectedRow[0]?.ObservationNo));
  }, [dispatch, selectedRow]);

  const filteredList = combinedListWithDoctors.filter(
    (item) => item.PatientNo === patientDetails?.PatientNo
  );

  const [selectedItem, setSelectedItem] = useState("Triage");
  console.log("selected item", selectedItem);
  const [activeItem, setActiveItem] = useState("Triage");

  const menuItems = [
    { label: "Triage", icon: <SnippetsOutlined /> },
    { label: "Diagnosis", icon: <FileAddOutlined /> },
    { label: "Prescription", icon: <DisconnectOutlined /> },
    { label: "Laboratory", icon: <ExperimentOutlined /> },
    { label: "Radiology", icon: <DeliveredProcedureOutlined /> },
    { label: "ECT", icon: <VerticalAlignTopOutlined /> },
  ];

  const handleOnClick = (item) => {
    console.log("item", item.label);
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

  return (
    <div>
      <EncounterListTable
        filteredList={filteredList}
        rowSelection={rowSelection}
      />
      <div
        style={{
          display: "flex",
          flex: 1,
          gap: "10px",
          flexWrap: "wrap",
          paddingTop: "30px",
        }}
      >
        {menuItems.map((item, index) => (
          <Button
            disabled={!selectedRowKey}
            key={index}
            className={activeItem === item.label ? "active-button" : ""}
            onClick={() => handleOnClick(item)}
          >
            {item.icon}
            {item.label}
          </Button>
        ))}
      </div>

      <div className="patient-file-content">
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

export default TreatmentCardContent;
