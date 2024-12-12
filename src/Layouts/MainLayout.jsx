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
  MedicineBoxOutlined,
  ExperimentOutlined,
  RadarChartOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, Breadcrumb, theme } from "antd";
import { FaUserGroup } from "react-icons/fa6";
import logo from "../assets/images/logo.png";
import smallLogo from "../assets/images/smallLogo.png";
import Signout from "../Auth/Signout";
import { BiCoinStack } from "react-icons/bi";
import { FaUserFriends } from "react-icons/fa";

const { Header, Content, Footer, Sider } = Layout;

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState(location.pathname);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
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

    const doctorRoutes = [
      // {
      //   key: "/Doctor",
      //   icon: <AppstoreOutlined style={{ color: "#fff" }} />,
      //   label: "Dashboard",
      // },
      {
        key: "patient-list",
        icon: <FaUserFriends style={{ color: "#fff" }} />,
        label: "Patients",
        children: [
          {
            key: "outpatient-list",
            label: "OutPatients",
            icon: <TeamOutlined style={{ color: "#fff" }} />,
          },
          {
            key: "inpatient-list",
            label: "In-Patient List",
            icon: <UserSwitchOutlined style={{ color: "#fff" }} />,
          },
          {
            key: "patient-admission-list",
            label: "Patient Admission List",
            icon: <FileAddOutlined style={{ color: "#fff" }} />,
          },
          {
            key: "past-doctor-visit-list",
            label: "Past Doctor Visits",
            icon: <HistoryOutlined style={{ color: "#fff" }} />,
          },
        ],
      },
      {
        key: "/doctors/appointments",
        icon: <CalendarOutlined style={{ color: "#fff" }} />,
        label: "Appointments",
        children: [
          {
            key: "/reception/appointments/list",
            label: "Appointments",
            icon: <CalendarOutlined style={{ color: "#fff" }} />,
          },
          {
            key: "upcoming-appointments",
            label: "Upcoming Appointments",
            icon: <ClockCircleOutlined style={{ color: "#fff" }} />,
          },
        ],
      },
      {
        key: "/doctor/discharge",
        icon: <MedicineBoxOutlined style={{ color: "#fff" }} />,
        label: "Discharge List",
        children: [
          {
            key: "discharge-requests",
            label: "Discharge Requests",
            icon: <CalendarOutlined style={{ color: "#fff" }} />,
          },
          {
            key: "discharges-list",
            label: "Discharges List",
            icon: <CalendarOutlined style={{ color: "#fff" }} />,
          },
        ],
      },
      {
        key: "/doctor/pharmacy",
        icon: <MedicineBoxOutlined style={{ color: "#fff" }} />,
        label: "Pharmacy",
        children: [
          {
            key: "pharmacy-outpatient",
            label: "Pharmacy List OutPatient",
            icon: <CalendarOutlined style={{ color: "#fff" }} />,
          },
          {
            key: "pharmacy-inpatient",
            label: "Pharmacy List InPatient",
            icon: <CalendarOutlined style={{ color: "#fff" }} />,
          },
          {
            key: "pharmacy-history",
            label: "Pharmacy History",
            icon: <HistoryOutlined style={{ color: "#fff" }} />,
          },
          {
            key: "pharmacy-returns",
            label: "Pharmacy List Returns",
            icon: <CalendarOutlined style={{ color: "#fff" }} />,
          },
        ],
      },
      {
        key: "/doctor/radiology",
        icon: <RadarChartOutlined style={{ color: "#fff" }} />,
        label: "Radiology",
        children: [
          {
            key: "radiology-outpatient",
            label: "Radiology List OutPatient",
            icon: <CalendarOutlined style={{ color: "#fff" }} />,
          },
          {
            key: "radiology-inpatient",
            label: "Radiology List InPatient",
            icon: <CalendarOutlined style={{ color: "#fff" }} />,
          },
          {
            key: "radiology-walkin",
            label: "Walk-in Radiology",
            icon: <CalendarOutlined style={{ color: "#fff" }} />,
          },
          {
            key: "radiology-history",
            label: "Radiology History",
            icon: <HistoryOutlined style={{ color: "#fff" }} />,
          },
        ],
      },
      {
        key: "/doctor/lab",
        icon: <ExperimentOutlined style={{ color: "#fff" }} />,
        label: "Lab",
        children: [
          {
            key: "lab-outpatient",
            label: "Lab List OutPatient",
            icon: <CalendarOutlined style={{ color: "#fff" }} />,
          },
          {
            key: "lab-inpatient",
            label: "Lab List InPatient",
            icon: <CalendarOutlined style={{ color: "#fff" }} />,
          },
          {
            key: "lab-history",
            label: "Lab History",
            icon: <HistoryOutlined style={{ color: "#fff" }} />,
          },
        ],
      },
    ];
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
        children: [
          {
            key: "visitors-list",
            label: "Visitor List",
            icon: <UserOutlined style={{ color: "#fff" }} />,
          },
          // {
          //   key: "New-Patients",
          //   label: "Patient List",
          //   icon: <TeamOutlined style={{ color: "#fff" }} />,
          // }
        ],
      },

      //     {
      //       key: "ActiveListGroup",
      //       label: <span style={{ color: "#ac8342", fontWeight: "medium" }}>Active List</span>,
      //       type: "group",
      //       children: [
      //         {
      //           key: "visitors-list",
      //           label: "Visitors List",
      //           icon: <TeamOutlined style={{ color: "#fff" }} />,
      //         }
      //       ],
      //     },
      //     {
      // key: "HistoryGroup",
      // label: <span style={{ color: "#ac8342", fontWeight: "medium" }}>History</span>,
      // type: "group",
      // children: [
      //   {
      //     key: "History-list",
      //     label: "History",
      //     icon: <HistoryOutlined style={{ color: "#fff" }} />,
      //   }
      // ],
      //     },
    ];

    // Determine menu items based on department
    if (department === "Reception") {
      setMenuItems(receptionRoutes);
    } else if (department === "Doctor") {
      setMenuItems(doctorRoutes);
    } else if (department === "Security") {
      setMenuItems(securityRoutes);
    } else {
      setMenuItems([]); // Fallback for undefined department
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
            <Breadcrumb.Item>
              {location.pathname.split("/").pop()}
            </Breadcrumb.Item>
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
