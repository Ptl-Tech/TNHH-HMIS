import React, { useState } from 'react';
import Medication from './Medication';
import Injections from './Injections';
import { FaSyringe, FaTablets } from 'react-icons/fa';
import { Button, Space } from 'antd';

const PatientCarePlan = () => {
  const [selectedComponent, setSelectedComponent] = useState(<Medication />);
  const [selectedLabel, setSelectedLabel] = useState('Patient Prescription');

  const handleOnClick = (label) => {
    setSelectedLabel(label);
    switch (label) {
      case 'Injection Requests':
        setSelectedComponent(<Injections />);
        break;
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
            onClick={() => handleOnClick(item.label)}
            type='primary'
            style={{
            //   backgroundColor: selectedLabel === item.label ? '#0060a3' : '#e5e3e3', // Highlight selected button
            //   color: selectedLabel === item.label ? '#fff' : '#000',
              border: 'none',
              borderRadius: '5px',
              padding: '10px 20px',
            }}
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
