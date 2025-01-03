import React, { useState } from 'react';
import { HeartOutlined, SolutionOutlined, MedicineBoxOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import LabResults from './LabResults';
import Imaging from './Imaging';
import { Button, Space } from 'antd';
import { IoBedOutline } from 'react-icons/io5';
import AdmitPatientForm from './AdmitPatient';
import Referrals from './Referrals';

const PatientRequests = () => {
  const handleOnClick = (item) => {
    switch (item) {
      case 'Laboratory Requests':
        setSelectedItem(<LabResults />);
        break;
      case 'Radiology Requests':
        setSelectedItem(<Imaging />);
        break;
      case 'Admission Requests':
        setSelectedItem(<AdmitPatientForm />);
        break;
        case 'Patient Referals':
        setSelectedItem(<Referrals />);
        break;
      default:
        setSelectedItem(<LabResults />);
    }
  };

  const [selectedItem, setSelectedItem] = useState(<LabResults />);
  const buttonItems = [
    {
      label: 'Laboratory Requests',
      icon: <HeartOutlined />,
    },
    // {
    //   label: 'Physiotherapy Requests',
    //   icon: <SolutionOutlined />,
    // },
    {
      label: 'Radiology Requests',
      icon: <MedicineBoxOutlined />,
    },
    {
      label: 'Admission Requests',
      icon: <IoBedOutline />,
    },
    {
      label: 'Patient Referals',
      icon: <UsergroupAddOutlined />,
    },
  ];

  return (
    <div>
      <Space
        direction="horizontal"
        size="middle"
        style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap' }}
      >
        {buttonItems.map((item, index) => (
          <Button
            key={index}
            onClick={() => handleOnClick(item.label)}
            type="primary"
            style={{
            //   backgroundColor: selectedItem === item.label ? '#1890ff' : '',
            //   color: selectedItem === item.label ? '#fff' : '',
            //   border: selectedItem === item.label ? '1px solid #1890ff' : '',
              padding: '10px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {item.icon} {item.label}
          </Button>
        ))}
      </Space>
      <div>{selectedItem}</div>
    </div>
  );
};

export default PatientRequests;
