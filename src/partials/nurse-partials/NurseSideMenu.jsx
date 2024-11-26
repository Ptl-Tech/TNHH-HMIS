import { Menu} from 'antd';
import Sider from 'antd/es/layout/Sider';
import { useNavigate } from 'react-router-dom';
import {
    UserOutlined,
    TeamOutlined,
    FileTextOutlined,
    HistoryOutlined,
    CalendarOutlined,
    AppstoreOutlined,
    ImportOutlined
  } from "@ant-design/icons";
import PropTypes from 'prop-types';


const sideMenuItems = [
    {
      key: "Dashboard",
      icon: <AppstoreOutlined style={{ color: "#fff"}} />,
      label: "Dashboard",
    },

    {
      key: "Appointments-list",
      icon: <CalendarOutlined style={{ color: "#fff" }} />,
      label: "Appointments",
    },

    {
      key: "Impatient",
      icon: <ImportOutlined style={{ color: "#fff" }} />,
      label: "Impatient",
    },

    {
        key: "Patient-Registration",
        icon: <UserOutlined style={{ color: "#fff" }} />,
        label: "Patient Registration",
    },

    {
        key: "New-Patients",
        icon: <TeamOutlined style={{ color: "#fff" }} />,
        label: "Patient List",
    },

    {
        key: "Triage",
        icon: <FileTextOutlined style={{ color: "#fff" }} />,
        label: "Triage List",
    },

    {
        key: "past-doctor-visit",
        icon: <HistoryOutlined style={{ color: "#fff" }} />,
        label: "Past Doctor Visit",
    },
  ];

  const rootSubmenuKeys = [
    "/Nurse",
    "/Patient-Registration",
    "/Appointments",
    "/Impatient",
    "/nurses",
    "/procurement",
    "/Dental",
    "/Pharmacy",
    "/Radiology",
    "/theatre",
    "/Laboratory",
    "/dialysis",
    "/MCH",
    "/Physio",
  ];

const NurseSideMenu = ({collapsed, setCollapsed, openKeys, setOpenKeys}) => {

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
            items={sideMenuItems} // Pass the items array here
          />
        </Sider>

  )
}

export default NurseSideMenu

//propType validation
NurseSideMenu.propTypes = {
    collapsed: PropTypes.bool.isRequired,
    setCollapsed: PropTypes.func.isRequired,
    openKeys: PropTypes.array.isRequired,
    setOpenKeys: PropTypes.func.isRequired,
  };