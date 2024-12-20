import { Card, Typography } from "antd";
import PropTypes from "prop-types";
import CountUp from "react-countup";
import { useNavigate } from "react-router-dom";

const DashboardCard = ({ card }) => {
  const navigate = useNavigate();
  return (
    <div className="dashboard-card">
      <Card
        style={{
          padding: "10px 16px",
          backgroundColor: card?.backgroundColor,
          color: card?.color,
          cursor: "pointer",
        }}
        onClick={() => navigate(card?.link)}
      >
        <div
          style={{
            display: "flex",
            alignItems: "top",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Typography.Title level={5} style={{ color: card?.color }}>
              {card?.title}
            </Typography.Title>
            <Typography.Text
              style={{ fontSize: "20px", fontWeight: 600, color: card?.color }}
            >
              <CountUp start={0} end={card?.value} duration={1} />
            </Typography.Text>
          </div>

          <div style={{ fontSize: "28px", fontWeight: 600 }}>{card?.icon}</div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardCard;

// propTypes validation
DashboardCard.propTypes = {
  card: PropTypes.shape({
    title: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    subtitle: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    link: PropTypes.func.isReuired,
  }),
};
