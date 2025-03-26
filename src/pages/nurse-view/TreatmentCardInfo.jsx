import { Card, Tag, Typography } from "antd";
import moment from "moment";
import { useLocation } from "react-router-dom";

const TreatmentCardInfo = () => {
  const location = useLocation();
  const patientDetails = location.state?.patientDetails;
  const invalidDate = "0001-01-01";

  return (
    <div
      style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}
    >
      <Card
        className="card"
        style={{
          width: "100%",
          backgroundColor: "#e5e3e3",
          border: "none",
          borderTop: "3px solid #0f5689",
          padding: "10px 16px",
        }}
      >
        <div
          className="inpatient-details-container-1"
          style={{ marginBottom: "20px" }}
        >
          <Typography.Text
            className="patient-id"
            style={{ fontWeight: "bold", color: "#0f5689" }}
          >
            Patient Name : {patientDetails?.SearchName || "N/A"}
          </Typography.Text>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className="patient-hospital-number-container">
            <h5
              style={{ fontWeight: "bold", color: "#0f5689", fontSize: "12px" }}
            >
              Patient Number
            </h5>
            <Typography.Text key={patientDetails?.TreatmentDate}>
              {patientDetails?.PatientNo || "N/A"}
            </Typography.Text>
          </div>

          <div className="patient-hospital-number-container">
            <h5
              style={{ fontWeight: "bold", color: "#0f5689", fontSize: "12px" }}
            >
              Patient Type
            </h5>
            <Typography.Text key={patientDetails?.TreatmentDate}>
              {patientDetails?.LinkType
                ? patientDetails.TreatmentType.toLowerCase().replace(
                    /^\w/,
                    (c) => c.toUpperCase()
                  )
                : "N/A"}
            </Typography.Text>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "10px",
          }}
        >
          <div className="patient-hospital-number-container">
            <h5
              style={{ fontWeight: "bold", color: "#0f5689", fontSize: "12px" }}
            >
              Treatment Number
            </h5>
            <Typography.Text key={patientDetails?.TreatmentDate}>
              {patientDetails?.TreatmentNo|| "N/A"}
            </Typography.Text>
          </div>
          <div className="patient-hospital-number-container">
            <h5
              style={{ fontWeight: "bold", color: "#0f5689", fontSize: "12px" }}
            >
              Clinic
            </h5>
            <Typography.Text key={patientDetails?.TreatmentDate}>
              {patientDetails?.Clinic
                ? patientDetails.Clinic.toLowerCase().replace(/^\w/, (c) =>
                    c.toUpperCase()
                  )
                : "N/A"}
            </Typography.Text>
          </div>
        </div>
      </Card>
      <Card
        className="card"
        style={{
          width: "100%",
          border: "none",
          borderTop: "3px solid #0f5689",
          padding: "10px 16px",
          boxShadow: "10px 10px 10px 10px #e6e6e6",
        }}
      >
        <div
          className="inpatient-details-container-1"
          style={{ marginBottom: "20px" }}
        >
          <Typography.Text
            className="patient-id"
            style={{ fontWeight: "bold", color: "#0f5689" }}
          >
            Admitted by Doctor : {patientDetails?.DoctorsName || "N/A"}
          </Typography.Text>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className="patient-hospital-number-container">
            <h5
              style={{ fontWeight: "bold", color: "#0f5689", fontSize: "12px" }}
            >
              Treatment Date
            </h5>
            <Typography.Text key={patientDetails?.TreatmentDate}>
              {moment(patientDetails?.TreatmentDate).isValid() &&
              patientDetails?.TreatmentDate !== invalidDate
                ? moment(patientDetails?.TreatmentDate).format(
                    "dddd, MMMM Do, YYYY"
                  )
                : "N/A"}
            </Typography.Text>
          </div>

          <div style={{ marginTop: "10px" }}>
            <h5
              style={{ fontWeight: "bold", color: "#0f5689", fontSize: "12px" }}
            >
              Treatment Time
            </h5>
            <Typography.Text key={patientDetails?.TreatmentTime}>
              {moment(
                patientDetails?.TreatmentTime,
                "HH:mm:ss.SSS",
                true
              ).isValid()
                ? moment(patientDetails?.TreatmentTime, "HH:mm:ss.SSS").format(
                    "HH:mm:ss A"
                  )
                : "N/A"}
            </Typography.Text>
          </div>
        </div>

        <div className="inpatient-details-container-2">
          <div className="patient-hospital-number-container">
            <h5
              style={{ fontWeight: "bold", color: "#0f5689", fontSize: "12px" }}
            >
              Treatment Status
            </h5>
            <Tag color={patientDetails?.Status === "Completed" ? "green" : "red"}>{patientDetails?.Status}</Tag>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TreatmentCardInfo;
