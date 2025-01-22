import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPatientDetails } from "../../actions/triage-actions/getPatientDetailsSlice";
import PatientInfo from "./Doctor-Forms/PatientInfo";
import EvaluationCardContent from "./Doctor-Forms/EvaluationCardContent";
import { useLocation } from "react-router-dom";
import { Space, Typography, Row, Col, Skeleton } from "antd";
import { DiffOutlined } from "@ant-design/icons";
import useAuth from "../../hooks/useAuth";

const ConsultationRoomEvalutionCard = () => {
  const role = useAuth().userData.departmentName;
  const location = useLocation();
  const dispatch = useDispatch();

  // Correct way to get treatmentNo and patientNo from the URL
  const treatmentNo = new URLSearchParams(location.search).get("TreatmentNo");
  const patientNo = new URLSearchParams(location.search).get("PatientNo");
  const { loadingPatientDetails, patientDetails } = useSelector(
    (state) => state.getPatientDetails
  );


  useEffect(() => {
    if (patientNo) {
      dispatch(getPatientDetails(patientNo));
    }
  }, [dispatch, patientNo]);


  if (loadingPatientDetails) return <Skeleton />;

  return (
    <div style={{ margin: "16px 10px" }}>
      <Space className="inpatient-header">
        <DiffOutlined />
        <Typography.Text className="inpatient-header-text">
          {
            role === "Doctor"
              ? "Doctor Evaluation Form"
              : role === "Psychology"
              ? "Psychology Evaluation Form"
              : "Nurse Evaluation Form"
          }
        </Typography.Text>
      </Space>
      <Row gutter={8} className="inpatient-card-container">
      <Col
          xs={24}
          md={24}
          lg={24}
          xl={24}
          className="inpatient-card-left-col"
        >
          {loadingPatientDetails ? (
            <Skeleton />
          ) : (
           <PatientInfo patientNo={patientNo} treatmentNo={treatmentNo} patientDetails={patientDetails} role={role}/>
          )}

         
        </Col>
      <Col
          xs={24}
          md={24}
          lg={24}
          xl={24}
          className="inpatient-card-left-col"
        >
          <EvaluationCardContent treatmentNo={treatmentNo} patientNo={patientNo} patientDetails={patientDetails} role={role}/>
        </Col>
       
      </Row>
    </div>
  );
};

export default ConsultationRoomEvalutionCard;
