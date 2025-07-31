import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { Layout, Menu, Button, theme } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";

import Signout from "../Auth/Signout";
import DynamicBreadcrumb from "./DynamicBreadcrumb";

// routes
import { useAbility } from "../hooks/casl";
import { labRoutes } from "../Routes/LabRoutes";
import { nurseRoutes } from "../Routes/NurseRoutes";
import { doctorRoutes } from "../Routes/DoctorRoutes";
import { securityRoutes } from "../Routes/SecurityRoutes";
import { pharmacyRoutes } from "../Routes/PharmacyRoutes";
import { receptionRoutes } from "../Routes/ReceptionRoutes";
import { radiologyRoutes } from "../Routes/RadiologyRoutes";
import { psychologyRoutes } from "../Routes/PsychologyRoutes";

import logo from "../assets/images/logo.png";
import smallLogo from "../assets/images/smallLogo.png";

const { Header, Content, Footer, Sider } = Layout;

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ability = useAbility();

  const [openKeys, setOpenKeys] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState(location.pathname);

  const generateMenuItems = () => {
    const routeMap = [
      { permission: "labNavigation", routes: labRoutes },
      { permission: "nurseNavigation", routes: nurseRoutes },
      { permission: "doctorNavigation", routes: doctorRoutes },
      { permission: "securityNavigation", routes: securityRoutes },
      { permission: "pharmacyNavigation", routes: pharmacyRoutes },
      { permission: "receptionNavigation", routes: receptionRoutes },
      { permission: "radiologyNavigation", routes: radiologyRoutes },
      { permission: "psychologyNavigation", routes: psychologyRoutes },
    ];

    const found = routeMap.find(({ permission }) =>
      ability.can("Read", permission)
    );
    return found?.routes || [];
  };

  // Handle open submenu logic
  const onOpenChange = (keys) => {
    setOpenKeys(keys.length === 0 ? [] : [keys[keys.length - 1]]);
  };

  // Handle menu item click
  const handleMenuClick = ({ key }) => {
    navigate(key);
    setSelectedKey(key); // Update the selected key when menu item is clicked
  };

  useEffect(() => {
    // Update the selected key when the route changes
    setSelectedKey(location.pathname);
  }, [location]);

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  
  return (
    <Layout>
      <Header className="headerstyle" style={{ zIndex: "999" }}>
        <div className="d-flex justify-content-center pt-2">
          <div className="demo-logo-vertical">
            {collapsed ? (
              <img
                src={smallLogo}
                height={70}
                className="mb-3 pt-1"
                alt="Logo"
              />
            ) : (
              <img src={logo} height={70} className="mb-3 pt-1" alt="Logo" />
            )}
          </div>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "22px",
              width: 64,
              height: 64,
              color: "#fff",
            }}
          />
        </div>
        <Signout />
      </Header>

      <Layout hasSider>
        <Sider
          className={`sideStyle ${collapsed ? "collapsed" : ""}`}
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="lg"
        >
          <Menu
            theme="light"
            mode="inline"
            openKeys={openKeys}
            onClick={handleMenuClick}
            onOpenChange={onOpenChange}
            selectedKeys={[selectedKey]}
            style={{
              color: "#fff",
              height: "100vh",
              paddingBottom: "90px",
              backgroundColor: "#0f5689 !important",
            }}
            items={generateMenuItems()} // Pass items here
          />
        </Sider>
        <Layout className="site-layout">
          <DynamicBreadcrumb collapsed={collapsed} />
          <Content
            className="contentStyle"
            style={{
              padding: 12,
              borderRadius: 8,
              minHeight: "77vh",
              transition: "all 0.2s",
              background: colorBgContainer,
              marginLeft: collapsed ? 80 : 230,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
      <Footer
        style={{
          textAlign: "center",
          color: "#67336d",
        }}
      >
        HMIS @ {new Date().getFullYear()} By Chiromo Hospital Group
      </Footer>
    </Layout>
  );
};

export default MainLayout;
