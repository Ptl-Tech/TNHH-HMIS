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
} from "@ant-design/icons";
import { Layout, Menu, Button, Breadcrumb, theme } from "antd";
import { FaUserGroup } from "react-icons/fa6";
import logo from "../assets/images/logo.png";
import smallLogo from "../assets/images/smallLogo.png";
import Signout from "../Auth/Signout";

const { Header, Content, Footer, Sider } = Layout;

const ReceptionLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState(location.pathname);

  // Define the menu items
  const items = [
    {
      key: "/reception",
      icon: <AppstoreOutlined style={{ color: "#fff" }} />,
      label: "Dashboard",

    },
    {
      key: "/reception/visitors-list",
      icon: <UserOutlined style={{ color: "#fff" }} />,
      label: "Visitors",
      // children: [
      //   {
      //     key: "/reception/visitors/list",
      //     label: "Visitors",
      //     icon: <UserOutlined style={{ color: "#fff" }} />,
      //   },
      // ],
    },
    {
      key: "/reception/patient-list",
      icon: <FaUserGroup style={{ color: "#fff" }} />,
      label: "Patient List",
      children: [
        {
          key: "/reception/Patient-list",
          label: "Active OutPatient ",
          icon: <FileTextOutlined style={{ color: "#fff" }} />,
        },
        // {
        //   key: "/reception/InPatient-list",
        //   label: "Active InPatient ",
        //   icon: <FileTextOutlined style={{ color: "#fff" }} />,
        // },
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
   
  ];

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
          >
            {items.map((item) =>
              item.children ? (
                <Menu.SubMenu
                  key={item.key}
                  icon={item.icon}
                  title={item.label}
                  className="menu-item"
                >
                  {item.children.map((child) => (
                    <Menu.Item key={child.key} className="menu-subitem">
                      {child.label}
                    </Menu.Item>
                  ))}
                </Menu.SubMenu>
              ) : (
                <Menu.Item key={item.key} icon={item.icon} className="menu-item">
                  {item.label}
                </Menu.Item>
              )
            )}
          </Menu>
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

export default ReceptionLayout;
