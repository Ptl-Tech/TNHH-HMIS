import React from "react";
import { Card, Typography } from "antd";
import { HourglassOutlined, ClockCircleOutlined, StopOutlined, CheckSquareOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const AdmissionsSummaryCard = ({ currentPath = "/" }) => {
  const { patients: treatmentList = [] } =
    useSelector((state) => state.docTreatmentList) || {};
    const { loading: getVerifiedAdmissionLoading, admissions } = useSelector((state) => state.getVerifiedAdmissionList);
    const { loading: getAdmissionLoading, admissions:admittedPatients } = useSelector(
        (state) => state.getAdmissionList
      );

      const { loading: getPendingAdmissionsLoading, data:pendingAdmissions } = useSelector(
        (state) => state.getPendingAdmissions
      );
    
  const cardData = [
    {
      backgroundColor: "#0f5689",
      icon: <HourglassOutlined />,
      title: "Admission Requests",
      link: "/Doctor/Admissions",
      count: pendingAdmissions.length,
    },
    {
      backgroundColor: "green",
      icon: <CheckSquareOutlined />,
      title: "Approved Admissions",
      link: "/Doctor/Approved-Admissions",
      count: admissions.length,
    },
    {
      backgroundColor: "grey",
      icon: <StopOutlined />,
      title: "Admitted Patients",
      link: "/Doctor/Admitted-Patients",
      count: admittedPatients.length,
    },
  ];

  const activeCardStyle = {
    borderLeft: "2px solid #ac8342",
    backgroundColor: "#faf6e7",
  };

  return (
    <div style={{ display: "flex", marginBottom: "10px", gap: "10px" }}>
      {cardData.map((card, index) => (
        <Card
          key={index}
          style={{
            flex: 1,
            padding: "10px 16px",
            ...(currentPath === card.link ? activeCardStyle : {}),
          }}
        >
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
                <Typography.Text style={{ fontSize: "12px", fontWeight: "bold" }}>
                  <CountUp start={0} end={card.count} duration={1} />
                </Typography.Text>
              </div>
            </div>
          </Link>
        </Card>
      ))}
    </div>
  );
};

AdmissionsSummaryCard.propTypes = {
  currentPath: PropTypes.string.isRequired,

};

export default AdmissionsSummaryCard;
