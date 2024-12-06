import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { useNavigate } from "react-router-dom";
import {
  AppstoreOutlined,
  CalendarOutlined,
  FileTextOutlined,
  ImportOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";

const sideMenuItems = [
  {
    key: "Dashboard",
    icon: <AppstoreOutlined style={{ color: "#fff" }} />,
    label: "Dashboard",
  },
  {
    key: "Triage",
    icon: <FileTextOutlined style={{ color: "#fff" }} />,
    label: "Triage",
    children: [
      {
        key: "Triage",
        label: "Triage List",
        icon: <FileTextOutlined style={{ color: "#fff" }} />,
      },
    ],
  },
  {
    key: "Nurse",
    icon: <TeamOutlined style={{ color: "#fff" }} />,
    label: "Nurse",
    children: [
      {
        key: "Admit-patient",
        label: "Admit Patient",
        icon: <ImportOutlined style={{ color: "#fff" }} />,
      },
      {
        key: "Ward-management",
        label: "Ward Management",
        icon: <FileTextOutlined style={{ color: "#fff" }} />,
      },
      {
        key: "Inpatient",
        label: "Inpatient",
        icon: <FileTextOutlined style={{ color: "#fff" }} />,
      },
    ],
  }
 
];


const rootSubmenuKeys = ["Nurse", "Triage"];

const NurseSideMenu = ({ collapsed, setCollapsed, openKeys, setOpenKeys }) => {
  const navigate = useNavigate();

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
      setCollapsed(true);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  return (
    <Sider
      className={`sideStyle ${collapsed ? "collapsed" : ""}`}
      trigger={null}
      collapsible
      collapsed={collapsed}
      breakpoint="lg"
      style={{
        overflow: "hidden",
        height: "100vh",
        position: "fixed",
      }}
    >
      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={["/Dashboard"]}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        onClick={({ key }) => {
          navigate(key);
        }}
        style={{
          paddingTop: "20px",
          fontSize: "16px",
          color: "#e6e7e8",
        }}
        items={sideMenuItems}
      />
    </Sider>
  );
};

export default NurseSideMenu;

// PropType validation
NurseSideMenu.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  setCollapsed: PropTypes.func.isRequired,
  openKeys: PropTypes.array.isRequired,
  setOpenKeys: PropTypes.func.isRequired,
};
