import { Card, Typography } from "antd";
import moment from "moment";
import { useLocation } from "react-router-dom";

const TreatmentCardInfo = () => {
  const location = useLocation();
  const patientDetails = location.state?.patientDetails;
  const invalidDate = "0001-01-01";

  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
        <Card
      className="card"
      style={{
        width: "100%",
        backgroundColor: "#e5e3e3",
        border: "none",
        borderTop: "3px solid #0f5689",
      }}
    >
      <div className="inpatient-details-container-1" style={{ marginBottom: "20px" }}>
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
          <Typography.Text key={patientDetails?.Admission_Date}>
            {patientDetails?.PatientNo || "N/A"}
          </Typography.Text>
        </div>

        <div className="patient-hospital-number-container">
          <h5
            style={{ fontWeight: "bold", color: "#0f5689", fontSize: "12px" }}
          >
            Patient Type
          </h5>
          <Typography.Text key={patientDetails?.Admission_Date}>
            {patientDetails?.LinkType
              ? patientDetails.Clinic.toLowerCase().replace(/^\w/, (c) =>
                  c.toUpperCase()
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
            Age and Gender
          </h5>
          <Typography.Text key={patientDetails?.Admission_Date}>
            {patientDetails?.Patient_No || "N/A"}
          </Typography.Text>
        </div>
        <div className="patient-hospital-number-container">
          <h5
            style={{ fontWeight: "bold", color: "#0f5689", fontSize: "12px" }}
          >
            Clinic
          </h5>
          <Typography.Text key={patientDetails?.Admission_Date}>
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
    }}
    >
      
      <div className="inpatient-details-container-1" style={{ marginBottom: "20px" }}>
        <Typography.Text
          className="patient-id"
          style={{ fontWeight: "bold", color: "#0f5689" }}
        >
          Admitted by Doctor : {patientDetails?.DoctorsName || "N/A"}
        </Typography.Text>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div className="patient-hospital-number-container">
          <h5
            style={{ fontWeight: "bold", color: "#0f5689", fontSize: "12px" }}
          >
            Date Admitted
          </h5>
          <Typography.Text key={patientDetails?.Admission_Date}>
            {moment(patientDetails?.Admission_Date).isValid() &&
            patientDetails?.Admission_Date !== invalidDate
              ? moment(patientDetails?.Admission_Date).format(
                  "dddd, MMMM Do, YYYY"
                )
              : "N/A"}
          </Typography.Text>
        </div>

        <div style={{ marginTop: "10px" }}>
          <h5
            style={{ fontWeight: "bold", color: "#0f5689", fontSize: "12px" }}
          >
            Date Discharged
          </h5>
          <Typography.Text key={patientDetails?.Expected_Date_of_Discharge}>
            {moment(patientDetails?.Expected_Date_of_Discharge).isValid() &&
            patientDetails?.Expected_Date_of_Discharge !== invalidDate
              ? moment(patientDetails?.Expected_Date_of_Discharge).format(
                  "dddd, MMMM Do, YYYY"
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
            Ward and Room Number
          </h5>
          <Typography.Text key={patientDetails?.Admission_Date}>
            {patientDetails?.Ward || "N/A"}, {patientDetails?.Bed || "N/A"}
          </Typography.Text>
        </div>
      </div>
    </Card>
    </div>
  );
};

export default TreatmentCardInfo;
