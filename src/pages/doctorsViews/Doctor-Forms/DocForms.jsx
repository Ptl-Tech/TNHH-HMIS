import React, { useState } from "react";
import SuicidalForm from "../../nurse-view/nurse-forms/SuicidalForm";
import MentalStateExaminationForm from "../../nurse-view/nurse-forms/MentalStateExaminationForm";
import {
  HeartOutlined,
  SolutionOutlined,
} from "@ant-design/icons"; // Import iconsimport { Button } from "antd";
import { Button } from "antd";
import DoctorReviewRequest from "./DoctorReviewRequests";
const DocForms = () => {
  const handleOnClick = (item) => {
    switch (item) {
      case "Suicidal Form":
        setSelectedItem(<SuicidalForm />);
        break;
      case "Mental State Examination Form":
        setSelectedItem(<MentalStateExaminationForm />);
        break;
        case "Doctor Review Requests":
        setSelectedItem(<DoctorReviewRequest />);
        break;
      default:
        setSelectedItem(<SuicidalForm />);
    }
  };

  const [selectedItem, setSelectedItem] = useState(<SuicidalForm />);
  const buttonItems = [
    {
      label: "Suicidal Form",
    icon: <HeartOutlined />
    },
    {
      label: "Mental State Examination Form",
    icon: <SolutionOutlined />
    },
    {
      label: "Doctor Review Requests",
    icon: <SolutionOutlined />
    },
  ]
  return (
    <>
    <div style={{ display: "flex", flex: 1, gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
      {buttonItems.map((item, index) => (
        <Button
          key={index}
          type="primary"
          onClick={() => handleOnClick(item.label)}
        >
          {item.icon}
          {item.label}
        </Button>
      ))}
    </div>
    {selectedItem}
    
    </>
  )
};

export default DocForms;
