import { useEffect } from "react";
import {
  UserOutlined,
  HourglassOutlined,
  SafetyOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "../../hooks/useAuth";
import moment from "moment";
import { getOutPatientTreatmentList } from "../../actions/Doc-actions/OutPatientAction";
import DashboardCard from "../nurse-view/DashboardCard";
import DashboardStatistics from "../nurse-view/DashboardStatistics";
import { getTriageWaitingList } from "../../actions/triage-actions/getTriageWaitingListSlice";

const DoctorDashboard = () => {
  const role = useAuth().userData.departmentName
  const dispatch = useDispatch();
  const userDetails = useAuth(); // Use the custom hook to get user info
  const { patients: treatmentList } =
    useSelector((state) => state.docTreatmentList) || {};
  const { triageWaitingList: patients } = useSelector(
    (state) => state.getTriageWaitingList
  );

  // Fetch data when the component loads
  useEffect(() => {
    dispatch(getTriageWaitingList());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getOutPatientTreatmentList());
  }, [dispatch]);

  const openDoctorVisitList = treatmentList?.filter((item) => {
    if (role === "Doctor") {
      return item.Status === "New" && item.Clinic === "PSYCHIATRIST";
    } else if (role === "Psychology") {
      return item.Status === "New" && item.Clinic === "PSYCHOLOGIST";
    }
    return item.Status === "New";
  });

  const activeVisitCount = treatmentList?.filter((item) => {
    if (role === "Doctor") {
      return item.Status === "Active" && item.Clinic === "PSYCHIATRIST";
    }else if (role === "Psychology") {
      return item.Status === "Active" && item.Clinic === "PSYCHOLOGIST";
    }
    return item.Status === "Active";
  });

  const closedVisitCount = treatmentList?.filter((item) => {
    if (role === "Doctor") {
      return item.Status === "Completed" && item.Clinic === "PSYCHIATRIST";
    }else if (role === "Psychology") {
      return item.Status === "Completed" && item.Clinic === "PSYCHOLOGIST";
    }
    return item.Status === "Completed";
  });
  

  // Filters for inpatients and outpatients
  const filterInPatients =
    patients?.filter((item) => item.Inpatient === true) || [];
  const filterOutPatients =
    patients?.filter((item) => item.Inpatient === false) || [];

  // Updated card data for the dashboard
  const cardData = [
    {
      title: "OP Waiting List",
      value: openDoctorVisitList?.length,
      subtitle: "Increase in 30 days",
      icon: <HourglassOutlined />,
      color: "#fff",
      backgroundColor: "#0f5689",
      link: role === "Doctor" ? "/Doctor/Consultation-List" : "/Psychology/Consultation-List",
    },
    {
      title: "Consultation Room",
      value: activeVisitCount?.length, // Use optimized count
      subtitle: "Active Consultations",
      icon: <SafetyOutlined />,
      color: "#000",
      backgroundColor: "#ac8342",
      link: role === "Doctor" ? "/Doctor/PendingConsultationList" : "/Psychology/PendingConsultationList",
    },
    {
      title: "Closed Consultations",
      value: closedVisitCount?.length, // New card for closed visits
      subtitle: "Completed Consultations",
      icon: <UserOutlined />,
      color: "#000",
      backgroundColor: "#5c85d6",
      link: role === "Doctor" ? "/Doctor/ClosedConsultationList" : "/Psychology/ClosedConsultationList",
    },
    {
      title: "Inpatients List",
      value: filterInPatients?.length,
      subtitle: "Increase in 30 days",
      icon: <UserAddOutlined />,
      color: "#000",
      backgroundColor: "#b0afaf",
      link: role === "Doctor" ? "/Doctor/Inpatient" : "/Psychology/Inpatient",
    },
  ];
  

  // Helper function to count registrations by date
  const countRegistrationsByDate = (patients) =>
    patients.reduce((acc, patient) => {
      const date = patient.DateRegistered;
      if (date !== "0001-01-01") {
        acc[date] = (acc[date] || 0) + 1;
      }
      return acc;
    }, {});

  // Registration counts for chart data
  const outPatientCountsByDate = countRegistrationsByDate(filterOutPatients);
  const inPatientCountsByDate = countRegistrationsByDate(filterInPatients);

  // Generate chart data for the last 30 days
  const last30Days = Array.from({ length: 30 }, (_, i) =>
    moment().subtract(i, "days").format("YYYY-MM-DD")
  );
  const chartData = last30Days.reverse().flatMap((date) => [
    { date, type: "Outpatient", count: outPatientCountsByDate[date] || 0 },
    { date, type: "Inpatient", count: inPatientCountsByDate[date] || 0 },
  ]);

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

export default DoctorDashboard;
