import { Space, Typography } from "antd";
import PropTypes from "prop-types";

const NurseInnerHeader = ({ filterInPatients, icon, title }) => {
  return (
    <>
      <Space
        style={{
          color: "#0f5689",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "20px",
          position: "relative",
        }}
      >
        {icon}
        <Typography.Text
          style={{ fontWeight: "bold", color: "#0f5689", fontSize: "16px" }}
        >
          {title}
        </Typography.Text>

        {filterInPatients && (
          <Space
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              right: "3px",
              top: "2px",
            }}
          >
            <div
              style={{
                color: "black",
                fontSize: "14px",
                backgroundColor: "#e6f7ff",
                padding: "3px 10px",
                borderRadius: "5px",
                display: "flex",
                gap: "5px",
                alignItems: "center",
                fontWeight: "bold",
              }}
            >
              <span>Total Inpatients</span>
              <span>{filterInPatients.length}</span>
            </div>
          </Space>
        )}
      </Space>
    </>
  );
};

export default NurseInnerHeader;

// props validation
NurseInnerHeader.propTypes = {
  filterInPatients: PropTypes.array,
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
};
