import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AppstoreOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme } from "antd";
import logo from "../assets/images/logo.png";
import smallLogo from "../assets/images/smallLogo.png";
import Signout from "../Auth/Signout";
import DynamicBreadcrumb from "./DynamicBreadcrumb";

// routes
import { labRoutes } from "../Routes/LabRoutes";
import { nurseRoutes } from "../Routes/NurseRoutes";
import { doctorRoutes } from "../Routes/DoctorRoutes";
import { pharmacyRoutes } from "../Routes/PharmacyRoutes";
import { receptionRoutes } from "../Routes/ReceptionRoutes";
import { psychologyRoutes } from "../Routes/PsychologyRoutes";

const { Header, Content, Footer, Sider } = Layout;

const MainLayout = () => {
  const role = null;
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState(location.pathname);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const department = userInfo?.userData?.departmentName;

    // Security Routes
    const securityRoutes = [
      {
        key: "/Security",
        icon: <AppstoreOutlined style={{ color: "#fff" }} />,
        label: "Registration",
      },
      {
        type: "divider",
      },
      {
        key: "RegistrationGroup",
        label: (
          <span style={{ color: "#ac8342", fontWeight: "medium" }}>
            Registration
          </span>
        ),
        type: "group",
        children: [
          {
            key: "/Security/visitors-list",
            label: "Visitor List",
            icon: <UserOutlined style={{ color: "#fff" }} />,
          },
        ],
      },
    ];

    const radiologyRoutes = [
      {
        key: "/Radiology",
        icon: <AppstoreOutlined style={{ color: "#fff" }} />,
        label: "Radiology",
      },
      {
        type: "divider",
      },
      {
        key: "RadiologyGroup",
        label: (
          <span style={{ color: "#ac8342", fontWeight: "medium" }}>
            Radiology
          </span>
        ),
        type: "group",
        children: [
          {
            key: "/Radiology/Radiology-Patients",
            label: "Radiology Requests",
            icon: <UserOutlined style={{ color: "#fff" }} />,
          },
        ],
      },
    ];

    // Set the menu items based on the user's department
    if (department === "Reception") {
      setMenuItems(receptionRoutes);
    } else if (department === "Nurse") {
      setMenuItems(nurseRoutes);
    } else if (department === "Doctor") {
      setMenuItems(doctorRoutes(role));
    } else if (department === "Laboratory") {
      setMenuItems(labRoutes);
    } else if (department === "Security") {
      setMenuItems(securityRoutes);
    } else if (department === "Psychology") {
      setMenuItems(psychologyRoutes(role));
    } else if (department === "Radiology") {
      setMenuItems(radiologyRoutes);
    } else if (department === "Pharmacy") {
      setMenuItems(pharmacyRoutes);
    }
  }, []);

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
            selectedKeys={[selectedKey]}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            onClick={handleMenuClick}
            style={{
              backgroundColor: "#0f5689 !important",
              height: "100vh",
              paddingBottom: "90px",
              color: "#fff",
            }}
            items={menuItems} // Pass items here
          />
        </Sider>

        <Layout className="site-layout">
          {/* import the dynamic breadcrumb component here */}

          <DynamicBreadcrumb collapsed={collapsed} />

          <Content
            className="contentStyle"
            style={{
              marginLeft: collapsed ? 80 : 230,
              transition: "all 0.2s",
              padding: 12,
              background: colorBgContainer,
              borderRadius: 8,
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
