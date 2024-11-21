import React, { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppstoreOutlined, UserOutlined, CheckSquareOutlined,  MenuFoldOutlined, MenuUnfoldOutlined, BellFilled } from '@ant-design/icons';
import { Layout, Menu, theme, Button, Avatar, Badge, Breadcrumb } from 'antd';
import {  FaUserDoctor,  FaEyeDropper, FaRadiation, } from "react-icons/fa6"
import {  GiSoapExperiment } from 'react-icons/gi'
import {  TbDental } from 'react-icons/tb'
import { LuBaby } from 'react-icons/lu'
import logo from '../assets/images/logo.png'
import Signout from '../Auth/Signout';


const { Header, Content, Footer, Sider } = Layout;

const AdminLayout = () => {
  const location = useLocation();

  // Extract the current route name from the location pathname
  const pathSegments = location.pathname.split("/").filter(Boolean);
    const [collapsed, setCollapsed] = useState(false);
    const [openKeys, setOpenKeys] = useState(['/']);
    const rootSubmenuKeys = [
        '/doc',
        '/appointements',
        '/doctors',
        '/procurement',
        '/Dental',
        '/Pharmacy',
        '/Radiology',
        '/theatre',
        '/Laboratory',
        '/dialysis',
        '/MCH',
        '/Physio',
    ];


    const items = [
        {
            key: '/doc',
            icon: <AppstoreOutlined style={{ color: '#fff' }} />,
            label: 'Dashboard',
        },
        {
            key: '/appointements',
            icon: <CheckSquareOutlined style={{ color: '#fff' }} />,
            label: 'Appointements',
            children: [
                {
                    key: '/add-appointment',
                    label: 'Add Appointment'
                },
                {
                    key: '/Appointment-list',
                    label: 'Appointment List'
                },
                {
                    key: '/Dispatched-List',
                    label: 'Dispatched List'
                },
            ]
        },
        {
            key: '/doctors',
            icon: <FaUserDoctor style={{ color: '#fff' }} />,
            label: 'Doctor',
            children: [
                {
                    key: '/Outpatient-visits',
                    label: 'Outpatient visits'
                },
                {
                    key: '/Inpatient',
                    label: 'Inpatient'
                },
                {
                    key: '/past-doctor-visit',
                    label: 'Past Doctor Visit'
                },
                {
                    key: 'Patient-Amdn',
                    label: 'Patient Admission'
                },
                {
                    key: '/MCH-outpatient',
                    label: 'MCH Outpatient'
                },
                {
                    key: '/theatre-day-case',
                    label: 'Theatre'
                },
                {
                    key: '/procedure-queues',
                    label: 'Procedure Queues'
                },
                {
                    key: '/anaesthetistia',
                    label: 'Anaesthestia'
                },
                {
                    key: '/Surgeon',
                    label: 'Surgeon'
                },
                {
                    key: '/Discharge-req',
                    label: 'Discharge Requests'
                },
                {
                    key: '/Discharge-list',
                    label: 'Discharge List'
                },
                {
                    key: '/pharmacy-list-Outpatient',
                    label: 'Pharmacy List Outpatient'
                },
                {
                    key: '/Pharmacy-list-inpatient',
                    label: 'Pharmacy List Inpatient'
                },
                {
                    key: '/Pharmacy-history',
                    label: 'Pharmacy History'
                },
                {
                    key: '/pharmacy-list-returns',
                    label: 'Pharmacy List Returns'
                },
            ]
        },
        {
            key: '/Dental',
            icon: <TbDental style={{ color: '#fff' }} />,
            label: 'Dental',
            children: [
                {
                    key: '/Dental-outpatient',
                    label: 'Outpatient'
                },
                {
                    key: '/Dental-inpatient',
                    label: 'Inpatient'
                },
            ]
        },
        {
            key: '/Radiology',
            icon: <FaRadiation style={{ color: '#fff' }} />,
            label: 'Radiology',
            children: [
                {
                    key: '/Radiology-list-Outpatient',
                    label: 'Radiology List Outpatient'
                },
                {
                    key: '/Radiology-list-inpatient',
                    label: 'Radiology List Inpatient'
                },
                {
                    key: '/Radiology-history',
                    label: 'Radiology History'
                },
                {
                    key: '/walk-in',
                    label: 'Walk In List'
                },
                // {
                //     key: '/procedure-queues',
                //     label: 'Procedure Queues'
                // },
            ]
        },
        {
            key: '/theatre',
            icon: <FaEyeDropper style={{ color: '#fff' }} />,
            label: 'Theatre',
        },
        {
            key: '/Laboratory',
            icon: <GiSoapExperiment style={{ color: '#fff' }} />,
            label: 'Laboratory',
            children: [
                {
                    key: '/Lab-list-Outpatient',
                    label: 'Laboratory Outpatient List'
                },
                {
                    key: '/Lab-list-inpatient',
                    label: 'Laboratory Inpatient List'
                },
                {
                    key: '/Lab-history',
                    label: 'Laboratory History'
                },
                {
                    key: '/Inpatient',
                    label: 'Current Inpatient'
                },
                {
                    key: '/walk-in',
                    label: 'Walk In List'
                },
                {
                    key: '/treatment-sheet',
                    label: 'Treatment Sheet'
                },
                {
                    key: '/Price-list',
                    label: 'Price List'
                },
            ]
        },
        {
            key: '/dialysis',
            icon: <FaEyeDropper style={{ color: '#fff' }} />,
            label: 'Dialysis',
            children: [
                {
                    key: '/Nurse',
                    label: 'Nurse'
                },
                {
                    key: '/Doctor',
                    label: "Doctor"
                },
                {
                    key: '/Inpatient',
                    label: 'Current Inpatient'
                },
                {
                    key: '/walk-in',
                    label: 'Walk In List'
                },
            ]
        },
        {
            key: '/MCH',
            icon: <LuBaby style={{ color: '#fff' }} />,
            label: 'MCH',
            children: [
                {
                    key: '/MCH-outpatient',
                    label: 'MCH Outpatient'
                },
                {
                    key: '/Mother-list',
                    label: "Mother's List"
                },
                {
                    key: '/Child-list',
                    label: 'Children  List'
                },
                {
                    key: '/MCH',
                    label: 'MCH'
                },
            ]
        },
    ];
    const onOpenChange = (keys) => {
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
        setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            setOpenKeys(keys);
            setCollapsed(true)
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    }

    const navigate = useNavigate();
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
      <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}   breakpoint="lg">
                <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['/']}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          onClick={({ key }) => {
            navigate(key);
          }}
          style={{
            backgroundColor: 'transparent',
            height: '100vh',
            color: '#fff',
            
            paddingBottom: '90px',
           
          }}
        >
                       
                        <div className=" demo-logo-vertical">
                            <img
                                src={logo}
                                height={70}
                                className='mb-3 pt-2'
                              //  style={{ maxWidth: collapsed ? '80px' : '100%', marginTop: '0' }}
                                alt="Logo"
                            />
                        </div>

          {items.map((item) =>
            item.children ? (
              <Menu.SubMenu
                key={item.key}
                icon={item.icon}
                title={item.label}
              >
                {item.children.map((child) => (
                  <Menu.Item key={child.key} className='menu-subitem'>
                    {child.label}
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            ) : (
              <Menu.Item key={item.key} icon={item.icon} className='menu-item'>
                {item.label}
              </Menu.Item>
            )
          )}
        </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header
                    style={{
                        padding: 0,
                        backgroundColor: '#002329',
                    }}
                    className='header'

                >
                <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '22px',
                                width: 64,
                                height: 64,
                                color:'#fff'
                            }}
                        // className='d-sm-none d-md-block'
                        />
                   
                    <Signout />

                </Header>

                <Layout>
                    <Breadcrumb
                        style={{
                          margin: '16px 16px',
                            color: '#67336d',
                            transition: 'all 0.2s',

                        }}
                    >
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
                        {pathSegments.map((segment, index) => (
          <Breadcrumb.Item key={index}>
            {segment.charAt(0).toUpperCase() + segment.slice(1)}
          </Breadcrumb.Item>
        ))}                    </Breadcrumb>
                    <Content className='contentStyle'
                        style={{
                          margin: '2px 16px',
                          padding: 2,
                          minHeight: 680,
                          background: colorBgContainer,
                          borderRadius: 8,
                        }}
                        >
                        <Outlet />
                    </Content>
                </Layout>

                <Footer
                    style={{
                        textAlign: 'center',
                        color: '#67336d'
                    }}
                >
                    HMIS ©2023 Created by MayFair
                </Footer>
            </Layout>
        </Layout>

    )
}

export default AdminLayout;