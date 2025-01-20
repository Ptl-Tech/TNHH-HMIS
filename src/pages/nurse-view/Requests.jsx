import { Button, Divider } from "antd"
import { useState } from "react"
// import PhysiotherapyRequest from "./requests/PhysiotherapyRequest"
import { HeartOutlined, FileMarkdownOutlined, MedicineBoxOutlined } from "@ant-design/icons"
import useAuth from "../../hooks/useAuth"
import LabResults from "../doctorsViews/Doctor-Forms/LabResults"
import Imaging from "../doctorsViews/Doctor-Forms/Imaging"
import Ketamine from "../doctorsViews/Doctor-Forms/Ketamine"
import ECTScan from "./nurse-care-plan/ECTScan"
import ImagingRequests from "../doctorsViews/Doctor-Forms/Implants"


const Requests = () => {
  const userRole = useAuth();
  const [selectedItem, setSelectedItem] = useState(<LabResults />); // Default component
  const [activeItem, setActiveItem] = useState('Laboratory Requests');

  const handleOnClick = (item) => {
    setActiveItem(item.label);
    switch (item.label) {
      case 'Laboratory Requests':
        setSelectedItem(<LabResults />);
        break;
      case 'Psychology Requests':
        setSelectedItem(<Imaging />);
        break;
      case 'Radiology Requests':
        setSelectedItem(<Imaging />);
        break;
      case 'Ketamine Requests':
        setSelectedItem(< Ketamine/>);
        break;
      case 'ECT Requests':
        setSelectedItem(<ECTScan />);
        break;
      case 'Implant Requests':
        setSelectedItem(<ImagingRequests/>);
        break;
      default:
        setSelectedItem(<LabResults />); // Default fallback
    }
  }

  const menuItems = [
    { label: 'Laboratory Requests', icon: <HeartOutlined /> },
    { label: 'Radiology Requests', icon: <MedicineBoxOutlined /> },
    { label: 'ECT Requests', icon: <FileMarkdownOutlined /> },
    { label: 'Ketamine Requests', icon: <FileMarkdownOutlined /> },
    { label: 'Implant Requests', icon: <FileMarkdownOutlined /> },
  ];

  return (
    <>
      <div style={{ display: 'flex', flex: 1, gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
      {menuItems.map((item, index) => (
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
      </div>

      <Divider />
      <div className="patient-file-content">
        {selectedItem}
      </div>
    </>
  );
}

export default Requests;
