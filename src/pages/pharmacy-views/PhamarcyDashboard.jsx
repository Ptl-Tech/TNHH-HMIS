import { useEffect } from "react";
import { 
  HourglassOutlined,
  SafetyOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "../../hooks/useAuth";
import moment from "moment"; 
import DashboardCard from "../nurse-view/DashboardCard";
import DashboardStatistics from "../nurse-view/DashboardStatistics"; 
import { getNewPharmacyRequests } from "../../actions/pharmacy-actions/getNewPharmacyRequest";

const PharmacyDashboard = () => {
  const dispatch = useDispatch();
  const userDetails = useAuth();  
  
    const {data: outPRequests } = useSelector(
      (state) => state.getNewPharmacyList
    );
  
  useEffect(() => {
      dispatch(getNewPharmacyRequests());
  }, [dispatch]);

  const cardData = [
    {
      title: "OP Waiting List",
      value: outPRequests?.length,
      subtitle: "Increase in 30 days",
      icon: <HourglassOutlined />,
      color: "#fff",
      backgroundColor: "#0f5689",
      link: "/Doctor/Pharmacy-OutPatient",
    },
    {
      title: "Inpatients List",
      value: 0,
      subtitle: "Increase in 30 days",
      icon: <UserAddOutlined />,
      color: "#000",
      backgroundColor: "#b0afaf",
      link: "/Doctor/Pharmacy-Inpatient",
    },{
      title: "Returns",
      value: 0,  
      subtitle: "Active Consultations",
      icon: <SafetyOutlined />,
      color: "#000",
      backgroundColor: "#ac8342",
      link: "/Doctor/Pharmacy-Returns",
    },
  ];

  // Helper function to count registrations by date
  const countRegistrationsByDate = (patients) =>
    patients.reduce((acc, patient) => {
      const date = patient.PharmacyDate;
      if (date !== "0001-01-01") {
        acc[date] = (acc[date] || 0) + 1;
      }
      return acc;
    }, {});

  // Registration counts for chart data
  const outPatientCountsByDate = countRegistrationsByDate(outPRequests);
  const inPatientCountsByDate = countRegistrationsByDate([]);

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

export default PharmacyDashboard;
