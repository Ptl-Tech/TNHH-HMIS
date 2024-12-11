import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AppstoreOutlined,
  UserOutlined,
  FileTextOutlined,
  CalendarOutlined,
  TeamOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserSwitchOutlined,
  FileAddOutlined,
  HistoryOutlined,
  ClockCircleOutlined,
  PicCenterOutlined,
  RadiusUprightOutlined,
  ImportOutlined
} from "@ant-design/icons";
import { Layout, Menu, Button, Breadcrumb, theme } from "antd";
import { FaUserGroup } from "react-icons/fa6";
import logo from "../assets/images/logo.png";
import smallLogo from "../assets/images/smallLogo.png";
import Signout from "../Auth/Signout";
import { BiCoinStack } from "react-icons/bi";

const { Header, Content, Footer, Sider } = Layout;

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState(location.pathname);
  const [menuItems, setMenuItems] = useState([]);


  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const department = userInfo?.userData?.departmentName;

    const receptionRoutes = [
      {
        key: "/reception",
        icon: <AppstoreOutlined style={{ color: "#fff" }} />,
        label: "Dashboard",
      },
      {
        key: "/reception/visitors-list",
        icon: <UserOutlined style={{ color: "#fff" }} />,
        label: "Visitors",
      },
      {
        key: "/reception/patient-list",
        icon: <FaUserGroup style={{ color: "#fff" }} />,
        label: "Patient List",
        children: [
          {
            key: "/reception/Patient-list",
            label: "Active OutPatient",
            icon: <FileTextOutlined style={{ color: "#fff" }} />,
          },
        ],
      },
      {
        key: "/reception/appointments",
        icon: <CalendarOutlined style={{ color: "#fff" }} />,
        label: "Appointments",
        children: [
          {
            key: "/reception/appointments/list",
            label: "Appointments",
            icon: <CalendarOutlined style={{ color: "#fff" }} />,
          },
        ],
      },
      {
        key: "/reception/billing",
        icon: <BiCoinStack style={{ color: "#fff" }} />,
        label: "Billing",
        children: [
          {
            key: "/reception/cash-List",
            label: "Cash Patients",
            icon: <CalendarOutlined style={{ color: "#fff" }} />,
          },
          {
            key: "/reception/insurance-List",
            label: "Insurance Patients",
            icon: <CalendarOutlined style={{ color: "#fff" }} />,
          },
        ],
      },
    ];

    const nurseRoutes = [
      {
        key: "/Nurse",
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
            icon: <PicCenterOutlined style={{ color: "#fff" }} />,
          },
          {
            key: "Past-doctor-visit",
            label: "Past Doctor Visits",
            icon: <RadiusUprightOutlined style={{ color: "#fff" }} />,
          },
        ],
      }
    ];

    // Define the menu items
    const doctorRoutes = [
      {
        key: "/Doctor",
        icon: <AppstoreOutlined style={{ color: "#fff" }} />,
        label: "Dashboard",
      },
      {
        type: "divider",
      },
      {
        key: "RegistrationGroup",
        label: <span style={{ color: "#ac8342", fontWeight: "bold" }}>Registration</span>,
        type: "group",
        children: [
          {
            key: "Outpatient-list",
            label: "Patients",
            icon: <TeamOutlined style={{ color: "#fff" }} />,
          },
          {
            key: "Inpatient-list",
            label: "Active Inpatient List",
            icon: <UserSwitchOutlined style={{ color: "#fff" }} />,
          },
          {
            key: "Patient-admissions",
            label: "Patient Admission",
            icon: <FileAddOutlined style={{ color: "#fff" }} />,
          },
        ],
      },
      {
        type: "divider",
      },
      {
        key: "TriageGroup",
        label: <span style={{ color: "#ac8342", fontWeight: "bold" }}>Triage</span>,
        type: "group",
        children: [
          {
            key: "triage",
            label: "Triage List",
            icon: <FileTextOutlined style={{ color: "#fff" }} />,
          },
          {
            key: "past-doctor-visit",
            label: "Past Doctor Visit",
            icon: <HistoryOutlined style={{ color: "#fff" }} />,
          },
        ],
      },
      {
        type: "divider",
      },
      {
        key: "AppointmentsGroup",
        label: <span style={{ color: "#ac8342", fontWeight: "bold" }}>Appointments</span>,
        type: "group",
        children: [
          {
            key: "Appointments-list",
            label: "Appointments",
            icon: <CalendarOutlined style={{ color: "#fff" }} />,
          },
          {
            key: "Upcoming-appointments",
            label: "Upcoming Appointments",
            icon: <ClockCircleOutlined style={{ color: "#fff" }} />,
          },
        ],
      },
    ];
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
        label: <span style={{ color: "#ac8342", fontWeight: "medium" }}>Registration</span>,
        type: "group",
        children: [
          {
            key: "visitors-list",
            label: "Visitor List",
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
      setMenuItems(doctorRoutes);
    } else if(department === "Security"){
      setMenuItems(securityRoutes);
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
      <Header className="headerstyle">
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
              backgroundColor: "transparent",
              height: "100vh",
              paddingBottom: "90px",
              color: "#fff",
            }}
            items={menuItems} // Pass items here
          />

        </Sider>

        <Layout className="site-layout">
          <Breadcrumb
            style={{
              marginLeft: collapsed ? 80 : 230,
              transition: "all 0.2s",
              padding: 12,
              color: "#67336d",
            }}
          >
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            {/* Dynamic breadcrumb based on URL */}
            <Breadcrumb.Item>{location.pathname.split("/").pop()}</Breadcrumb.Item>
          </Breadcrumb>

          <Content
            className="contentStyle"
            style={{
              marginLeft: collapsed ? 80 : 230,
              transition: "all 0.2s",
              padding: 12,
              minHeight: 680,
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
        HMIS @ {new Date().getFullYear()} Created by potestastechnologies
      </Footer>
    </Layout>
  );
};

export default MainLayout;
