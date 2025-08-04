import { Card, Typography } from "antd";
import {
  HourglassOutlined,
  ClockCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const TriageSummeryCard = ({ currentPath }) => {

  const { triageList } = useSelector((state) => state.getTriageList) || {};

  const openTriageList = triageList.filter((item)=>item.Status==='New')
  const pendingTriageList = triageList.filter((item)=>item.Status==='Pending')
  const closedTriageList = triageList.filter((item)=>item.Status==='Closed')



  const cardData = [
    {
      backgroundColor: "green",
      icon: <HourglassOutlined />,
      title: "Waiting Patients",
      link: "/Dashboard/Triage",
      count: Object.keys(openTriageList).length || 0, // Replace with `waitingPatient?.length` or dynamic data
    },
    {
      backgroundColor: "gray",
      icon: <ClockCircleOutlined />,
      title: "In Triage",
      link: "/Dashboard/PendingTriageList",
      count: Object.keys(pendingTriageList).length || 0,
    },
    {
      backgroundColor: "#0f5689",
      icon: <StopOutlined />,
      title: "Closed",
      link: "/Dashboard/ClosedTriageList",
      count: Object.keys(closedTriageList).length || 0,
    },
  ];

  const activeCard = 
    {
      borderLeft: "2px solid #ac8342",
      backgroundColor: "#faf6e7",
    }

  
  return (
    <div style={{ display: "flex", marginBottom: "10px", gap: "10px" }}>
        {cardData.map((card, index) => {
            const isActive = currentPath === card.link;
          return (
            <Card key={index} style={{ flex: 1, padding: "10px 16px", ...(isActive ? activeCard : {})}}>
            <Link to={card.link} style={{ textDecoration: "none" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  display: "grid",
                  placeItems: "center",
                  backgroundColor: card.backgroundColor,
                  borderRadius: "4px",
                  width: "30px",
                  height: "30px",
                  color: "white",
                }}
              >
                {card.icon}
              </div>
              <div style={{ marginLeft: "20px" }}>
                
                  <Typography.Title level={5} style={{ color: "gray" }}>
                    {card.title}
                  </Typography.Title>
                  <Typography.Text
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    <CountUp start={0} 
                    end={card.count} 
                    duration={1} 
                    />
                  </Typography.Text>
               
              </div>
            </div>
            </Link>
          </Card>
          ) 
        }
      )}
    </div>
  );
};

export default TriageSummeryCard;

//props validation
TriageSummeryCard.propTypes = {
  openTriageList: PropTypes.array.isRequired,
  currentPath: PropTypes.string.isRequired,
};
