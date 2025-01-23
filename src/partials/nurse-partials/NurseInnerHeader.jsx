import { Space, Typography } from "antd"
import PropTypes from "prop-types"

const NurseInnerHeader = ({ filterInPatients, icon, title }) => {
  return (
    <>
        <Space
        style={{
          color: "#0f5689",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          paddingBottom: "20px",
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
            
        {
            filterInPatients && (
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
                    <span
                        style={{ color: "black", fontSize: "14px", fontWeight: "bold" }}
                    >
                        Total Inpatients
                    </span>
                    <span
                        style={{
                        backgroundColor: "#0f5689",
                        borderRadius: "50%",
                        width: "25px",
                        height: "25px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "white",
                        }}
                >
                        {filterInPatients.length || 0}
                    </span>
                </Space>
            )
        }
      </Space>
    </>
  )
}

export default NurseInnerHeader

// props validation
NurseInnerHeader.propTypes = {
  filterInPatients: PropTypes.array,
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired
};