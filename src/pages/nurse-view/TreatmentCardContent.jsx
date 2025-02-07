import { Button, Card, Divider, Table } from "antd";
import { useLocation } from "react-router-dom";
import useFetchPastDoctorVisitsHook from "../../hooks/useFetchPastDoctorVisitsHook";
import { FilePdfOutlined } from "@ant-design/icons";
import useSetTableCheckBoxHook from "../../hooks/useSetTableCheckBoxHook";
import {
  VerticalAlignTopOutlined,
  DeliveredProcedureOutlined,
  ExperimentOutlined,
  SnippetsOutlined,
  FileAddOutlined,
  DisconnectOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import VitalsTable from "./tables/triage-tables/VitalsTable";

const TreatmentCardContent = () => {
  const location = useLocation();
  const patientDetails = location.state?.patientDetails;
  const { combinedListWithDoctors } = useFetchPastDoctorVisitsHook();
  const {
    isButtonDisabled,
    setIsButtonDisabled,
    selectedRowKey,
    rowSelection,
    selectedRow,
  } = useSetTableCheckBoxHook();

  const filteredList = combinedListWithDoctors.filter(
    (item) => item.PatientNo === patientDetails?.PatientNo
  );

  const [selectedItem, setSelectedItem] = useState(<VitalsTable />);
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
    setActiveItem(item.label);
    switch (item.label) {
      case "Triage":
        setSelectedItem(<VitalsTable />);
        break;
      case "Diagnosis":
        setSelectedItem(<VitalsTable />);
        break;
      case "Prescription":
        setSelectedItem(<VitalsTable />);
        break;
      case "Laboratory":
        setSelectedItem(<VitalsTable />);
        break;
      case "Radiology":
        setSelectedItem(<VitalsTable />);
        break;
      case "ECT":
        setSelectedItem(<VitalsTable />);
        break;
      default:
        setSelectedItem(<VitalsTable />);
    }
  };

  const columns = [
    {
      title: "Encounter Date",
      dataIndex: "TreatmentDate",
      key: "TreatmentDate",
      fixed: "left",
      width: 150,
    },
    {
      title: "Treatment Number",
      dataIndex: "TreatmentNo",
      key: "TreatmentNo",
    },
    {
      title: "Primary Doctor",
      dataIndex: "DoctorsName",
      key: "DoctorsName",
    },
    {
      title: "Patient Type",
      dataIndex: "TreatmentType",
      key: "TreatmentType",
    },
    {
      title: "Print Out",
      dataIndex: "PrintOut",
      key: "PrintOut",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <Button rel="noopener noreferrer" icon={<FilePdfOutlined />}>
          Discharge summary
        </Button>
      ),
    },
  ];
  return (
    <div>
      <Table
        style={{ marginTop: "30px" }}
        rowKey={"TreatmentNo"}
        columns={columns}
        dataSource={filteredList}
        pagination={false}
        rowSelection={rowSelection}
      />

        <div
          style={{ display: "flex", flex: 1, gap: "10px", flexWrap: "wrap", paddingTop: "30px" }}
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
          {selectedItem === "Triage" ? <VitalsTable /> : selectedItem}
        </div>
    </div>
  );
};

export default TreatmentCardContent;
