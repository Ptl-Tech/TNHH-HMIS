import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  UserOutlined,
  CheckSquareOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellFilled,
  TeamOutlined,
  UserSwitchOutlined,
  FileTextOutlined,
  HistoryOutlined,
  FileAddOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import { Layout, Menu, theme, Button, Avatar, Badge, Breadcrumb } from "antd";
import { FaUserDoctor, FaEyeDropper, FaRadiation } from "react-icons/fa6";
import { GiSoapExperiment } from "react-icons/gi";
import { TbDental } from "react-icons/tb";
import { LuBaby } from "react-icons/lu";
import logo from "../assets/images/logo.png";
import smallLogo from "../assets/images/smallLogo.png";

import Signout from "../Auth/Signout";

const { Header, Content, Footer, Sider } = Layout;

const NurseLayout = () => {
  const location = useLocation();

  // Extract the current route name from the location pathname
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState(["/"]);
  const rootSubmenuKeys = [
    "/Nurse",
    "/Patient-Registration",
    "/appointements",
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

  const items = [
    {
      key: "/Nurse",
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
          key: "Patient-Registration",
          label: "Patient Registration",
          icon: <UserOutlined style={{ color: "#fff" }} />,
        },
        {
          key: "New-Patients",
          label: "Patient List",
          icon: <TeamOutlined style={{ color: "#fff" }} />,
        }      ],
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
        
      ],
    },
  ];
  
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

  const navigate = useNavigate();
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
            defaultSelectedKeys={["/Nurse"]}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            onClick={({ key }) => {
              navigate(key);
            }}
            style={{
              backgroundColor: "#ffffff",
              height: "100vh",
              paddingBottom: "90px",
              color: "#67336d",
            }}
            items={items} // Pass the items array here
          />
        </Sider>
       <Layout className="site-layout">
       <div className="site-layout">
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
            {pathSegments.map((segment, index) => (
              <Breadcrumb.Item key={index}>
                {segment.charAt(0).toUpperCase() + segment.slice(1)}
              </Breadcrumb.Item>
            ))}{""}
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
        </div>
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

export default NurseLayout;
