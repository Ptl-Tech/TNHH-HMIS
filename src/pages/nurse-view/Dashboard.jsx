
import { useEffect } from "react";
import DashboardCard from "./DashboardCard";
import DashboardStatistics from "./DashboardStatistics";
import { UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import { getTriageList } from "../../actions/triage-actions/getTriageListSlice";
import useAuth from "../../hooks/useAuth";
const Dashboard = () => {

  const dispatch = useDispatch();

  const userDetails = useAuth();  // Use the custom hook to get user info

  useEffect(() => {
    dispatch(getTriageList());
  }, [dispatch]);

  const {triageList} = useSelector((state) => state.getTriageList) || {};
  const openTriageList = triageList.filter((item)=>item.Status==='New') || {};
  const closedTriageList = triageList.filter((item)=>item.Status==='Closed') || {};
  const pendingTriageList = triageList.filter((item)=>item.Status==='Pending')

  // Sample data for the cards
  const cardData = [
    {
      title: "Triage Waiting Patients",
      value: openTriageList.length,
      subtitle: "Increase in 30 days",
      icon: <UserOutlined />
    },
    {
      title: "Patients in Triage",
      value: pendingTriageList.length,
      subtitle: "Increase in 30 days",
      icon: <UserOutlined />
    },
    {
      title: "Out patients",
      value: closedTriageList.length,
      subtitle: "Increase in 30 days",
      icon: <UserOutlined />
    },
    {
      title: "In patients",
      value: 250,
      subtitle: "Increase in 30 days",
      icon: <UserOutlined />
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

        <DashboardStatistics userDetails={userDetails}/> 
    </div>
  );
};

export default Dashboard;
