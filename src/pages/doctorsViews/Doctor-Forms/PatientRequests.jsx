import { useState } from 'react';
import { HeartOutlined, NodeIndexOutlined, MedicineBoxOutlined, ScanOutlined, ManOutlined } from '@ant-design/icons';
import LabResults from './LabResults';
import Imaging from './Imaging';
import { Button, Space } from 'antd';
import ECTScan from '../../nurse-view/nurse-care-plan/ECTScan';
import Ketamine from './Ketamine';
import ImagingRequests from './ImagingRequests';
import Implants from './Implants';

const PatientRequests = () => {
  const [activeItem, setActiveItem] = useState('Laboratory Requests');
  const handleOnClick = (item) => {
    setActiveItem(item.label);
    switch (item.label) {
      case 'Laboratory Requests':
        setSelectedItem(<LabResults />);
        break;
      case 'Radiology Requests':
        setSelectedItem(<Imaging />);
        break;
    case 'ECT':
        setSelectedItem(<ECTScan />);
        break;
    case 'Ketamine':
        setSelectedItem(<Ketamine />);
        break;
    case 'Imaging':
       setSelectedItem(<ImagingRequests />);
        break;
    case 'Implants':
      setSelectedItem(<Implants />)
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
      label: 'ECT',
      icon: <ScanOutlined />,
    },
    {
      label: 'Ketamine',
      icon: <NodeIndexOutlined />,
    },
    // {
    //   label: 'Imaging',
    //   icon: <ContainerOutlined />,
    // },
    {
      label: 'Implants',
      icon: <ManOutlined />,
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
            style={{ backgroundColor: "#b96000", color: "#ffffff", border: "none", padding: "18px 20px" }}
            className={activeItem === item.label ? "active-button" : ""}
            onClick={() => handleOnClick(item)}
          >
            {item.icon}
            {item.label}
          </Button>
        ))}
      </Space>
      <div>{selectedItem}</div>
    </div>
  );
};

export default PatientRequests;
