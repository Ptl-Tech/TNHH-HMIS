import { Button, Divider } from "antd"
import { useState } from "react"
import PhysiotherapyRequest from "./requests/PhysiotherapyRequest"
import RadiologyRequest from "./requests/RadiologyRequest"
import LaboratoryRequest from "./requests/LaboratoryRequest"
import { HeartOutlined, FileMarkdownOutlined, MedicineBoxOutlined } from "@ant-design/icons"
import useAuth from "../../hooks/useAuth"


const Requests = () => {
  const userRole = useAuth();
  const [selectedItem, setSelectedItem] = useState(<LaboratoryRequest />); // Default component
  const [activeItem, setActiveItem] = useState('Laboratory Requests');

  const handleOnClick = (item) => {
    setActiveItem(item.label);
    switch (item.label) {
      case 'Laboratory Requests':
        setSelectedItem(<LaboratoryRequest />);
        break;
      case 'Psychology Requests':
        setSelectedItem(<PhysiotherapyRequest />);
        break;
      case 'Radiology Requests':
        setSelectedItem(<RadiologyRequest />);
        break;
      default:
        setSelectedItem(<LaboratoryRequest />); // Default fallback
    }
  }

  const menuItems = [
    { label: 'Laboratory Requests', icon: <HeartOutlined /> },
    ...(userRole.userData.departmentName === "Doctor" ? [{ label: 'Physiotherapy Requests', icon: <FileMarkdownOutlined /> }] : []),
    { label: 'Radiology Requests', icon: <MedicineBoxOutlined /> },
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
