import { useState } from "react"; 
import moment from 'moment';
import { totalNursesLineGraphConfig, totalDoctorsLineGraphConfig, totalPatientsLineGraphConfig, totalAppointmentsLineGraphConfig } from "../../constants/nurse-constants";
import DashboardCard from "./DashboardCard";
import DashboardStatistics from "./DashboardStatistics";
const Dashboard = () => {
  const [date, setDate] = useState(moment()); // Initialize date with moment

  // Sample data for the simple line chart


  const cardData = [
    {
      title: "Total Doctors",
      value: 120,
      increasePercentage: "+12%",
      subtitle: "Increase in 30 days",
      lineGraphConfig: totalDoctorsLineGraphConfig
    },
    {
      title: "Total Nurses",
      value: 50,
      increasePercentage: "+14%",
      subtitle: "Increase in 30 days",
      lineGraphConfig: totalNursesLineGraphConfig
    },
    {
      title: "Total Patients",
      value: 100,
      increasePercentage: "+12%",
      subtitle: "Increase in 30 days",
      lineGraphConfig: totalPatientsLineGraphConfig
    },
    {
      title: "Appointments",
      value: 250,
      increasePercentage: "+12%",
      subtitle: "Increase in 30 days",
      lineGraphConfig: totalAppointmentsLineGraphConfig
    }
  ]

  return (
    <div style={{ padding: '10px 10px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {
            cardData.map((card, index) =>(
              <DashboardCard card={card} key={index} />
            ))
          }
        </div>

        <DashboardStatistics/> 
    </div>
  );
};

export default Dashboard;
