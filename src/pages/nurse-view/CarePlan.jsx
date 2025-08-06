import {
  FileOutlined,
  FileMarkdownOutlined,
  BorderlessTableOutlined,
} from "@ant-design/icons";
import { Tabs } from "antd";

import { useAuth } from "../../hooks/auth";

import VisitorsList from "./nurse-forms/VisitorsList";
import CarePlanForm from "./nurse-forms/CarePlanForm";
import SuicidalForm from "./nurse-forms/SuicidalForm";
import DailyProcess from "./nurse-care-plan/DailyProcess";
import NursingNotes from "./nurse-patient-file/NursingNotes";
import DietaryIntakeForm from "./nurse-forms/DietaryIntakeForm";
import JacksonVisualForm from "./nurse-forms/JacksonVisualForm";
import ConsultationroomDetails from "../doctorsViews/Doctor-Forms/ConsultationroomDetails";

const CarePlan = ({ observationNo, patientNo }) => {
  const { user } = useAuth();
  const userRole = user.role;

  const menuItems = [
    {
      key: "Consultation Room File",
      icon: <FileMarkdownOutlined />,
      label: "Consultation Room File",
      children: (
        <ConsultationroomDetails
          patientNo={patientNo}
          observationNo={observationNo}
        />
      ),
    },
    {
      icon: <FileOutlined />,
      key: "Daily Ward Rounds",
      label: "Daily Ward Rounds",
      children: <DailyProcess />,
    },
    {
      key: "CardX",
      label: "CardX",
      children: <NursingNotes />,
      icon: <FileMarkdownOutlined />,
    },
    {
      key: "Care Plan",
      label: "Care Plan",
      children: <CarePlanForm />,
      icon: <BorderlessTableOutlined />,
    },

    {
      key: "Visitor List",
      label: "Visitor List",
      icon: <FileOutlined />,
      children: <VisitorsList />,
    },
    {
      key: "Suicidal Form",
      label: "Suicidal Form",
      icon: <FileOutlined />,
      children: <SuicidalForm />,
    },
    {
      icon: <FileOutlined />,
      key: "Dietary Intake Form",
      label: "Dietary Intake Form",
      children: <DietaryIntakeForm />,
    },
    {
      icon: <FileOutlined />,
      key: "Jackson Visual Form",
      label: "Jackson Visual Form",
      children: <JacksonVisualForm />,
    },
  ];

  return <Tabs type="card" items={menuItems} />;
};

export default CarePlan;
