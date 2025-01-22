import {
    AppstoreOutlined,
    UserOutlined,
    FileTextOutlined,
    CalendarOutlined,
    TeamOutlined,
    UserSwitchOutlined,
    FileAddOutlined,
    HistoryOutlined,
    PicCenterOutlined,
    RadiusUprightOutlined,
    ImportOutlined,
    MedicineBoxOutlined,
    ExperimentOutlined,
    RadarChartOutlined,
    SolutionOutlined,
    InteractionOutlined,
    RetweetOutlined,
    LayoutOutlined,
} from "@ant-design/icons";
import { FaUserGroup } from "react-icons/fa6";
import { BiCoinStack } from "react-icons/bi";
import { FaUserFriends } from "react-icons/fa";

const DemoRoutes = [
    {
        key: "/Demo",
        icon: <AppstoreOutlined style={{ color: "#fff" }} />,
        label: "Dashboard",
    },
    {
        type: "divider",
    },
    {
        key: "SecurityGroup",
        label: (
            <span style={{ color: "#ac8342", fontWeight: "medium" }}>
                Security
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
    {
        type: "divider",
    },
    {
        key: "ReceptionGroup",
        label: (
            <span style={{ color: "#ac8342", fontWeight: "medium" }}>
                Reception
            </span>
        ),
        type: "group",
        children: [
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
                        label: "OutPatient List",
                        icon: <FileTextOutlined style={{ color: "#fff" }} />,
                    },
                    {
                        key: "/reception/converted-patients",
                        label: "Converted Patients",
                        icon: <UserOutlined style={{ color: "#fff" }} />,
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
                        label: " New Appointments",
                        icon: <CalendarOutlined style={{ color: "#fff" }} />,
                    },
                    {
                        key: "/reception/appointments/Dispatched",
                        label: "Dispatched List",
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
        ],
    },
    {
        type: "divider",
    },
    {
        key: "NurseGroup",
        label: (
            <span style={{ color: "#ac8342", fontWeight: "medium" }}>
                Nurse Module
            </span>
        ),
        type: "group",
        children: [
            {
                key: "/Nurse",
                icon: <AppstoreOutlined style={{ color: "#fff" }} />,
                label: "Dashboard",
            },
            {
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
                icon: <SolutionOutlined style={{ color: "#fff" }} />,
                label: "Admissions",
                children: [
                    {
                        key: "Admissions",
                        label: "Admissions",
                        icon: <SolutionOutlined style={{ color: "#fff" }} />,
                    },
                    {
                        key: "Admission-requests",
                        label: "Admission Requests",
                        icon: <InteractionOutlined style={{ color: "#fff" }} />,
                    },
                    {
                        key: "Admit-patient",
                        label: "Admit Patient",
                        icon: <ImportOutlined style={{ color: "#fff" }} />,
                    },
                ],
            },
            {
                icon: <PicCenterOutlined style={{ color: "#fff" }} />,
                label: "Inpatients",
                children: [
                    {
                        key: "Inpatient",
                        label: "Inpatient-list",
                        icon: <PicCenterOutlined style={{ color: "#fff" }} />,
                    },
                ],
            },
            {
                icon: <LayoutOutlined style={{ color: "#fff" }} />,
                label: "Ward Management",
                children: [
                    {
                        key: "Ward-management",
                        label: "Manage Wards",
                        icon: <LayoutOutlined style={{ color: "#fff" }} />,
                    },
                ],
            },
            {
                icon: <RetweetOutlined style={{ color: "#fff" }} />,
                label: "Discharges",
                children: [
                    {
                        key: "Discharge-requests",
                        label: "Discharge Requests",
                        icon: <RetweetOutlined style={{ color: "#fff" }} />,
                    },
                    {
                        key: "Discharge-list",
                        label: "Discharge Patient",
                        icon: <HistoryOutlined style={{ color: "#fff" }} />,
                    },
                ],
            },
            {
                icon: <RadiusUprightOutlined style={{ color: "#fff" }} />,
                label: "Past Doctor Visits",
                children: [
                    {
                        key: "Past-doctor-visit",
                        label: "Past Doctor Visit List",
                        icon: <RadiusUprightOutlined style={{ color: "#fff" }} />,
                    },
                ],
            },
        ],
    },
    {
        type: "divider",
    },
    {
        key: "DoctorsGroup",
        label: (
            <span style={{ color: "#ac8342", fontWeight: "medium" }}>
                Doctors Module
            </span>
        ),
        type: "group",
        children: [
            {
                key: "/Doctor",
                icon: <AppstoreOutlined style={{ color: "#fff" }} />,
                label: "Dashboard",
            },
            {
                key: "patient-list",
                icon: <FaUserFriends style={{ color: "#fff" }} />,
                label: "Patients",
                children: [
                    {
                        key: "/Doctor/Consultation-List",
                        label: "OutPatients",
                        icon: <TeamOutlined style={{ color: "#fff" }} />,
                    },
                    {
                        key: "/Doctor/Inpatient",
                        label: "In-Patient List",
                        icon: <UserSwitchOutlined style={{ color: "#fff" }} />,
                    },
                    {
                        key: "/Doctor/Admissions",
                        label: "Admissions",
                        icon: <FileAddOutlined style={{ color: "#fff" }} />,
                    },
                    {
                        key: "/Doctor/Past-doctor-visit",
                        label: "Past Doctor Visits",
                        icon: <HistoryOutlined style={{ color: "#fff" }} />,
                    },
                ],
            },
            {
                key: "/doctor/discharge",
                icon: <MedicineBoxOutlined style={{ color: "#fff" }} />,
                label: "Discharge List",
                children: [
                    {
                        key: "/Doctor/Discharge-requests",
                        label: "Discharge Requests",
                        icon: <CalendarOutlined style={{ color: "#fff" }} />,
                    },
                    {
                        key: "/Doctor/Discharge-list",
                        label: "Discharges List",
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
                        key: "/Doctor/Radiology-Patients",
                        label: "Radiology List OutPatient",
                        icon: <CalendarOutlined style={{ color: "#fff" }} />,
                    },
                ],
            },
            {
                key: "/doctor/lab",
                icon: <ExperimentOutlined style={{ color: "#fff" }} />,
                label: "Lab",
                children: [
                    {
                        key: "/Doctor/Lab-Patients",
                        label: "Lab List OutPatient",
                        icon: <CalendarOutlined style={{ color: "#fff" }} />,
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
                key: "/doctor/pharmacy",
                icon: <MedicineBoxOutlined style={{ color: "#fff" }} />,
                label: "Pharmacy",
                children: [
                    {
                        key: "/Doctor/Pharmacy-OutPatient",
                        label: "Pharmacy List OutPatient",
                        icon: <CalendarOutlined style={{ color: "#fff" }} />,
                    },
                    {
                        key: "/Doctor/Pharmacy-Inpatient",
                        label: "Pharmacy List InPatient",
                        icon: <CalendarOutlined style={{ color: "#fff" }} />,
                    },

                    {
                        key: "/Doctor/Pharmacy-Returns",
                        label: "Pharmacy List Returns",
                        icon: <CalendarOutlined style={{ color: "#fff" }} />,
                    },
                    {
                        key: "/Doctor/Pharmacy-History",
                        label: "Pharmacy History",
                        icon: <HistoryOutlined style={{ color: "#fff" }} />,
                    }
                ],
            },
        ],
    }
];

export default DemoRoutes;