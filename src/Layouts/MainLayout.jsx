import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
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
  RadiusUprightOutlined,
  ImportOutlined,
  MedicineBoxOutlined,
  ExperimentOutlined,
  RadarChartOutlined,
  SolutionOutlined,
  RetweetOutlined,
  LayoutOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
import logo from '../assets/images/logo.png';
import smallLogo from '../assets/images/smallLogo.png';
import Signout from '../Auth/Signout';
import { FaUserFriends } from 'react-icons/fa';
import DynamicBreadcrumb from './DynamicBreadcrumb';
import useAuth from '../hooks/useAuth';

// routes
import { labRoutes } from '../Routes/LabRoutes';
import { receptionRoutes } from '../Routes/ReceptionRoutes';

const { Header, Content, Footer, Sider } = Layout;

const MainLayout = () => {
  const role = useAuth().userData.departmentName;
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState(location.pathname);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const department = userInfo?.userData?.departmentName;

    const nurseRoutes = [
      {
        key: '/Nurse',
        icon: <AppstoreOutlined style={{ color: '#fff' }} />,
        label: 'Dashboard',
      },
      {
        icon: <FileTextOutlined style={{ color: '#fff' }} />,
        label: 'Triage',
        children: [
          {
            key: 'Triage',
            label: 'Triage List',
            icon: <FileTextOutlined style={{ color: '#fff' }} />,
          },
        ],
      },
      {
        icon: <UsergroupAddOutlined style={{ color: '#fff' }} />,
        label: 'Patients',
        children: [
          {
            key: 'patient-list',
            label: 'Patient Registration',
            icon: <UserAddOutlined style={{ color: '#fff' }} />,
          },
          {
            key: 'Consultation-List',
            label: 'Outpatients List',
            icon: <UserAddOutlined style={{ color: '#fff' }} />,
          },
          {
            key: 'Inpatient',
            label: 'Inpatients List',
            icon: <UserAddOutlined style={{ color: '#fff' }} />,
          },
        ],
      },
      {
        icon: <SolutionOutlined style={{ color: '#fff' }} />,
        label: 'Admissions',
        children: [
          {
            key: 'Admit-patient',
            label: 'Admit Patient',
            icon: <ImportOutlined style={{ color: '#fff' }} />,
          },
        ],
      },
      {
        icon: <LayoutOutlined style={{ color: '#fff' }} />,
        label: 'Ward Management',
        children: [
          {
            key: 'Ward-management',
            label: 'Manage Wards',
            icon: <LayoutOutlined style={{ color: '#fff' }} />,
          },
        ],
      },
      {
        icon: <RetweetOutlined style={{ color: '#fff' }} />,
        label: 'Discharges',
        children: [
          {
            key: 'Discharge-list',
            label: 'Discharge Patient',
            icon: <HistoryOutlined style={{ color: '#fff' }} />,
          },
        ],
      },
      {
        icon: <RadiusUprightOutlined style={{ color: '#fff' }} />,
        label: 'Past Doctor Visits',
        children: [
          {
            key: 'Past-doctor-visit',
            label: 'Past Doctor Visit List',
            icon: <RadiusUprightOutlined style={{ color: '#fff' }} />,
          },
        ],
      },
    ];

    // Define the menu items
    const doctorRoutes = [
      {
        key: '/Doctor',
        icon: <AppstoreOutlined style={{ color: '#fff' }} />,
        label: 'Dashboard',
      },

      {
        key: 'patient-list',
        icon: <FaUserFriends style={{ color: '#fff' }} />,
        label: 'Patients',
        children: [
          {
            key: '/Doctor/Consultation-List',
            label: 'OutPatients',
            icon: <TeamOutlined style={{ color: '#fff' }} />,
          },
          ...(role === 'Doctor'
            ? [
                {
                  key: '/Doctor/Inpatient',
                  label: 'In-Patient List',
                  icon: <UserSwitchOutlined style={{ color: '#fff' }} />,
                },
                {
                  key: '/Doctor/Admissions',
                  label: 'Admissions',
                  icon: <FileAddOutlined style={{ color: '#fff' }} />,
                },
              ]
            : []),
          {
            key: '/Doctor/Past-doctor-visit',
            label: 'Past Doctor Visits',
            icon: <HistoryOutlined style={{ color: '#fff' }} />,
          },
        ],
      },

      // {
      //   key: "/doctors/appointments",
      //   icon: <CalendarOutlined style={{ color: "#fff" }} />,
      //   label: "Appointments",
      //   children: [
      //     {
      //       key: "/reception/appointments/list",
      //       label: "Appointments",
      //       icon: <CalendarOutlined style={{ color: "#fff" }} />,
      //     },
      //     {
      //       key: "upcoming-appointments",
      //       label: "Upcoming Appointments",
      //       icon: <ClockCircleOutlined style={{ color: "#fff" }} />,
      //     },
      //   ],
      // },
      {
        key: '/doctor/discharge',
        icon: <MedicineBoxOutlined style={{ color: '#fff' }} />,
        label: 'Discharge List',
        children: [
          {
            key: '/Doctor/Discharge-requests',
            label: 'Discharge Requests',
            icon: <CalendarOutlined style={{ color: '#fff' }} />,
          },
          {
            key: '/Doctor/Discharge-list',
            label: 'Discharges List',
            icon: <CalendarOutlined style={{ color: '#fff' }} />,
          },
        ],
      },
      ...(role === 'Doctor'
        ? [
            {
              key: '/doctor/radiology',
              icon: <RadarChartOutlined style={{ color: '#fff' }} />,
              label: 'Radiology',
              children: [
                {
                  key: '/Doctor/Radiology-Patients',
                  label: 'Radiology List OutPatient',
                  icon: <CalendarOutlined style={{ color: '#fff' }} />,
                },
                // {
                //   key: "radiology-inpatient",
                //   label: "Radiology List InPatient",
                //   icon: <CalendarOutlined style={{ color: "#fff" }} />,
                // },
                // {
                //   key: "radiology-walkin",
                //   label: "Walk-in Radiology",
                //   icon: <CalendarOutlined style={{ color: "#fff" }} />,
                // },
                // {
                //   key: "radiology-history",
                //   label: "Radiology History",
                //   icon: <HistoryOutlined style={{ color: "#fff" }} />,
                // },
              ],
            },

            {
              key: '/doctor/lab',
              icon: <ExperimentOutlined style={{ color: '#fff' }} />,
              label: 'Lab',
              children: [
                {
                  key: '/Doctor/Lab-Patients',
                  label: 'Laoratory OutPatient',
                  icon: <CalendarOutlined style={{ color: '#fff' }} />,
                },
                // {
                //   key: "lab-inpatient",
                //   label: "Lab List InPatient",
                //   icon: <CalendarOutlined style={{ color: "#fff" }} />,
                // },
                // {
                //   key: "lab-history",
                //   label: "Lab History",
                //   icon: <HistoryOutlined style={{ color: "#fff" }} />,
                // },
              ],
            },
            {
              key: '/doctor/pharmacy',
              icon: <MedicineBoxOutlined style={{ color: '#fff' }} />,
              label: 'Pharmacy',
              children: [
                {
                  key: '/Doctor/Pharmacy-Dashboard',
                  label: 'Dashboard',
                  icon: <AppstoreOutlined style={{ color: '#fff' }} />,
                },
                {
                  key: '/Doctor/Pharmacy-OutPatient',
                  label: 'Pharmacy List OutPatient',
                  icon: <CalendarOutlined style={{ color: '#fff' }} />,
                },
                {
                  key: '/Doctor/Pharmacy-Inpatient',
                  label: 'Pharmacy List InPatient',
                  icon: <CalendarOutlined style={{ color: '#fff' }} />,
                },

                {
                  key: '/Doctor/Pharmacy-Returns',
                  label: 'Pharmacy List Returns',
                  icon: <CalendarOutlined style={{ color: '#fff' }} />,
                },
                {
                  key: '/Doctor/Pharmacy-History',
                  label: 'Pharmacy History',
                  icon: <HistoryOutlined style={{ color: '#fff' }} />,
                },
              ],
            },
          ]
        : []),
    ];

    const psychologyRoutes = [
      {
        key: '/Psychology',
        icon: <AppstoreOutlined style={{ color: '#fff' }} />,
        label: 'Dashboard',
      },

      {
        key: 'patient-list',
        icon: <FaUserFriends style={{ color: '#fff' }} />,
        label: 'Patients',
        children: [
          {
            key: '/Psychology/Consultation-List',
            label: 'OutPatients',
            icon: <TeamOutlined style={{ color: '#fff' }} />,
          },
          ...(role === 'Psychology'
            ? [
                {
                  key: '/Psychology/Inpatient',
                  label: 'In-Patient List',
                  icon: <UserSwitchOutlined style={{ color: '#fff' }} />,
                },
                // {
                //   key: "/Psychology/Admissions",
                //   label: "Admissions",
                //   icon: <FileAddOutlined style={{ color: "#fff" }} />,
                // },
              ]
            : []),
          {
            key: '/Psychology/Past-doctor-visit',
            label: 'Past Doctor Visits',
            icon: <HistoryOutlined style={{ color: '#fff' }} />,
          },
        ],
      },

      // {
      //   key: "/doctors/appointments",
      //   icon: <CalendarOutlined style={{ color: "#fff" }} />,
      //   label: "Appointments",
      //   children: [
      //     {
      //       key: "/reception/appointments/list",
      //       label: "Appointments",
      //       icon: <CalendarOutlined style={{ color: "#fff" }} />,
      //     },
      //     {
      //       key: "upcoming-appointments",
      //       label: "Upcoming Appointments",
      //       icon: <ClockCircleOutlined style={{ color: "#fff" }} />,
      //     },
      //   ],
      // },
      // {
      //   key: "/psychology/discharge",
      //   icon: <MedicineBoxOutlined style={{ color: "#fff" }} />,
      //   label: "Discharge List",
      //   children: [
      //     {
      //       key: "/Psychology/Discharge-requests",
      //       label: "Discharge Requests",
      //       icon: <CalendarOutlined style={{ color: "#fff" }} />,
      //     },
      //     {
      //       key: "/Psychology/Discharge-list",
      //       label: "Discharges List",
      //       icon: <CalendarOutlined style={{ color: "#fff" }} />,
      //     },
      //   ],
      // },
      ...(role === 'Doctor'
        ? [
            {
              key: '/doctor/radiology',
              icon: <RadarChartOutlined style={{ color: '#fff' }} />,
              label: 'Radiology',
              children: [
                {
                  key: '/Psychology/Radiology-Patients',
                  label: 'Radiology List OutPatient',
                  icon: <CalendarOutlined style={{ color: '#fff' }} />,
                },
                // {
                //   key: "radiology-inpatient",
                //   label: "Radiology List InPatient",
                //   icon: <CalendarOutlined style={{ color: "#fff" }} />,
                // },
                // {
                //   key: "radiology-walkin",
                //   label: "Walk-in Radiology",
                //   icon: <CalendarOutlined style={{ color: "#fff" }} />,
                // },
                // {
                //   key: "radiology-history",
                //   label: "Radiology History",
                //   icon: <HistoryOutlined style={{ color: "#fff" }} />,
                // },
              ],
            },

            {
              key: '/doctor/lab',
              icon: <ExperimentOutlined style={{ color: '#fff' }} />,
              label: 'Lab',
              children: [
                {
                  key: '/Psychology/Lab-Patients',
                  label: 'Labortory OutPatient',
                  icon: <CalendarOutlined style={{ color: '#fff' }} />,
                },
                // {
                //   key: "lab-inpatient",
                //   label: "Lab List InPatient",
                //   icon: <CalendarOutlined style={{ color: "#fff" }} />,
                // },
                // {
                //   key: "lab-history",
                //   label: "Lab History",
                //   icon: <HistoryOutlined style={{ color: "#fff" }} />,
                // },
              ],
            },
            {
              key: '/doctor/pharmacy',
              icon: <MedicineBoxOutlined style={{ color: '#fff' }} />,
              label: 'Pharmacy',
              children: [
                {
                  key: '/Psychology/Pharmacy-OutPatient',
                  label: 'Pharmacy List OutPatient',
                  icon: <CalendarOutlined style={{ color: '#fff' }} />,
                },
                {
                  key: '/Psychology/Pharmacy-Inpatient',
                  label: 'Pharmacy List InPatient',
                  icon: <CalendarOutlined style={{ color: '#fff' }} />,
                },

                {
                  key: '/Psychology/Pharmacy-Returns',
                  label: 'Pharmacy List Returns',
                  icon: <CalendarOutlined style={{ color: '#fff' }} />,
                },
                {
                  key: '/Psychology/Pharmacy-History',
                  label: 'Pharmacy History',
                  icon: <HistoryOutlined style={{ color: '#fff' }} />,
                },
              ],
            },
          ]
        : []),
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
        key: '/Radiology',
        icon: <AppstoreOutlined style={{ color: '#fff' }} />,
        label: 'Radiology',
      },
      {
        type: 'divider',
      },
      {
        key: 'RadiologyGroup',
        label: (
          <span style={{ color: '#ac8342', fontWeight: 'medium' }}>
            Radiology
          </span>
        ),
        type: 'group',
        children: [
          {
            key: '/Radiology/Radiology-Patients',
            label: 'Radiology Requests',
            icon: <UserOutlined style={{ color: '#fff' }} />,
          },
        ],
      },
    ];

    const pharmacyRoutes = [
      {
        key: '/Pharmacy',
        icon: <AppstoreOutlined style={{ color: '#fff' }} />,
        label: 'Dashboard',
      },
      {
        key: '/Pharmacy/Pharmacy-OutPatient',
        label: 'Pharmacy OutPatients',
        icon: <TeamOutlined style={{ color: '#fff' }} />,
      },
      {
        key: '/Pharmacy/Pharmacy-Inpatient',
        label: 'Pharmacy In-Patient List',
        icon: <UserSwitchOutlined style={{ color: '#fff' }} />,
      },
    ];

    // Set the menu items based on the user's department
    if (department === 'Reception') {
      setMenuItems(receptionRoutes);
    } else if (department === 'Nurse') {
      setMenuItems(nurseRoutes);
    } else if (department === 'Doctor') {
      setMenuItems(doctorRoutes);
    } else if (department === 'Laboratory') {
      setMenuItems(labRoutes);
    } else if (department === 'Security') {
      setMenuItems(securityRoutes);
    } else if (department === 'Psychology') {
      setMenuItems(psychologyRoutes);
    } else if (department === 'Radiology') {
      setMenuItems(radiologyRoutes);
    } else if (department === 'Pharmacy') {
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
              <img
                src={logo}
                height={70}
                className="mb-3 pt-1"
                alt="Logo"
              />
            )}
          </div>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '22px',
              width: 64,
              height: 64,
              color: '#fff',
            }}
          />
        </div>
        <Signout />
      </Header>

      <Layout hasSider>
        <Sider
          className={`sideStyle ${collapsed ? 'collapsed' : ''}`}
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
              backgroundColor: '#0f5689 !important',
              height: '100vh',
              paddingBottom: '90px',
              color: '#fff',
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
              transition: 'all 0.2s',
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
          textAlign: 'center',
          color: '#67336d',
        }}
      >
        HMIS @ {new Date().getFullYear()} By Chiromo Hospital Group
      </Footer>
    </Layout>
  );
};

export default MainLayout;
