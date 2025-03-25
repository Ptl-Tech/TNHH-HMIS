import { useEffect, useMemo, useState } from "react";
import {
  UserOutlined,
  HourglassOutlined,
  SafetyOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { listPatients } from "../actions/patientActions";
import { getVisitorsList } from "../actions/visitorsActions";
import DashboardCard from "../pages/nurse-view/DashboardCard";
import DashboardStatistics from "../pages/nurse-view/DashboardStatistics";
import useAuth from "../hooks/useAuth";
import { getPgAdmissionsPendingVerificationSlice } from "../actions/nurse-actions/getPgAdmissionsPendingVerificationSlice";

const ReceptionDashboard = () => {
  const dispatch = useDispatch();
  const userDetails = useAuth();
  const today = moment().format("YYYY-MM-DD");

  const { visitors } = useSelector((state) => state.visitorsList);
  const { loading, patients } = useSelector((state) => state.patientList);
  const { loadingPendingAdmissionVerification, pendingAdmissionVerification } =
    useSelector((state) => state.getPgAdmissionsPendingVerification);

  useEffect(() => {
    dispatch(listPatients());
    dispatch(getVisitorsList());
    dispatch(getPgAdmissionsPendingVerificationSlice());
  }, [dispatch]);

  // Compute counts for dashboard cards
  const currentVisitorsCount =
    visitors?.filter(
      (visitor) =>
        moment(visitor.CreatedDate).format("YYYY-MM-DD") === today &&
        visitor.Status === "Entered"
    ).length || 0;

  const activeVisitsCount = Array.isArray(patients)
    ? patients.filter((item) => item?.Activated && !item.Inpatient).length
    : 0;
  const inPatientCount = pendingAdmissionVerification?.length || 0;
  const walkInPatientsCount = Array.isArray(patients)
    ? patients.filter((item) => item.Walkin && item.Activated).length
    : 0;

  // Dashboard Cards Data
  const cardData = [
    {
      title: "Current Visitors List",
      value: currentVisitorsCount,
      subtitle: "Today’s Entries",
      icon: <HourglassOutlined />,
      color: "#fff",
      backgroundColor: "#0f5689",
      link: "/reception/visitors-list",
    },
    {
      title: "Active Visits List",
      value: activeVisitsCount,
      subtitle: "Active Consultations",
      icon: <SafetyOutlined />,
      color: "#000",
      backgroundColor: "#ac8342",
      link: "/reception/appointments/Dispatched",
    },
    {
      title: "Walk-In Consultations",
      value: walkInPatientsCount,
      subtitle: "Walk-In Consultations",
      icon: <UserOutlined />,
      color: "#000",
      backgroundColor: "#5c85d6",
      link: "/reception/Walkin-patient-list",
    },
    {
      title: "Admission Requests",
      value: inPatientCount,
      subtitle: "Currently Admitted",
      icon: <UserAddOutlined />,
      color: "#000",
      backgroundColor: "#b0afaf",
      link: "/reception/admission-requests",
    },
  ];

  // Generate Chart Data for Last 30 Days
  const chartData = useMemo(() => {
    const last30Days = Array.from({ length: 30 }, (_, i) =>
      moment().subtract(i, "days").format("YYYY-MM-DD")
    ).reverse();

    return last30Days.map((date) => ({
      date,
      visitors: Math.floor(Math.random() * 20) + 5, // Random values between 5-25
      activeVisits: Math.floor(Math.random() * 15) + 3, // Random values between 3-18
      walkIns: Math.floor(Math.random() * 10) + 2, // Random values between 2-12
      inpatients: Math.floor(Math.random() * 5) + 1, // Random values between 1-6
    }));
  }, []);

  return (
    <div style={{ padding: "10px 10px" }}>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {cardData.map((card, index) => (
          <DashboardCard card={card} key={index} />
        ))}
      </div>
      <DashboardStatistics userDetails={userDetails} chartData={chartData} />
    </div>
  );
};

export default ReceptionDashboard;