import React, { useState } from "react";
import { Button, Divider } from "antd";
import { ReadOutlined, FileTextOutlined } from "@ant-design/icons";

import PatientSigns from "./PatientSigns";
import PatientSyptoms from "./PatientSyptoms";

const DoctorNotes = () => { // Receive observationNo as a prop
  const queryParams = new URLSearchParams(location.search);
  const observationNo = queryParams.get("TreatmentNo");
  const [selectedItem, setSelectedItem] = useState(<PatientSigns observationNo={observationNo} />); // Pass observationNo to PatientSigns

  const handleOnClick = (item) => {
    switch (item) {
      case "signs":
        setSelectedItem(<PatientSigns observationNo={observationNo} />); // Pass observationNo to PatientSigns
        break;
      case "symptoms":
        setSelectedItem(<PatientSyptoms observationNo={observationNo} />);
        break;
      default:
        setSelectedItem(<PatientSigns observationNo={observationNo} />);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {["signs", "symptoms"].map((item) => (
          <Button
            key={item}
            type="primary"
            onClick={() => handleOnClick(item)}
            icon={item === "signs" ? <ReadOutlined /> : <FileTextOutlined />}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)} {/* Capitalize */}
          </Button>
        ))}
      </div>
      <Divider />
      <div className="patient-file-content">{selectedItem}</div>
    </div>
  );
};

export default DoctorNotes;
