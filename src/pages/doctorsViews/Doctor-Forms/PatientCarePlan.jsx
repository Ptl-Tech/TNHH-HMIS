import React, { useState } from 'react';
import Medication from './Medication';
import Injections from './Injections';
import { FaSyringe, FaTablets } from 'react-icons/fa';
import { Button, Space } from 'antd';

const PatientCarePlan = () => {
  const [activeItem, setActiveItem] = useState('Patient Prescription');
  const [selectedComponent, setSelectedComponent] = useState(<Medication />);
  const [selectedLabel, setSelectedLabel] = useState('Patient Prescription');
  

  const handleOnClick = (item) => {
    setActiveItem(item.label);
    setSelectedLabel(item.label);
    switch (item.label) {
      case 'Patient Prescription':
      default:
        setSelectedComponent(<Medication />);
        break;
    }
  };

  const buttonItems = [
    // { label: 'Injection Requests', icon: <FaSyringe /> },
    { label: 'Patient Prescription', icon: <FaTablets /> },
  ];

  return (
    <div>
      <Space
        direction="horizontal"
        style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap' }}
      >
        {buttonItems.map((item, index) => (
                  <Button
                    key={index}
                    style={{ backgroundColor: "#0f5689", color: "#ffffff", border: "none", padding: "18px 20px" }}
                    className={activeItem === item.label ? "active-button" : ""}
                    onClick={() => handleOnClick(item)}
                  >
                    {item.icon}
                    {item.label}
                  </Button>
                ))}
      </Space>
      <div>{selectedComponent}</div>
    </div>
  );
};

export default PatientCarePlan;
