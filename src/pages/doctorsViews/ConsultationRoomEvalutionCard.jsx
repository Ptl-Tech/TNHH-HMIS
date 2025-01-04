import {
  Card,
  Tabs,
  Row,
  Col,
  Avatar,
  Typography,
  Divider,
  Button,
  message,
  Space,
} from "antd";
import { UserOutlined, DiffOutlined } from "@ant-design/icons";
import AllergyAndMedication from "../nurse-view/forms/triage-forms/AllergyAndMedication";
import Dressing from "../nurse-view/forms/triage-forms/Dressing";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPatientDetails } from "../../actions/triage-actions/getPatientDetailsSlice";
import useAuth from "../../hooks/useAuth";
import { postDispatchToDoctorSlice } from "../../actions/triage-actions/postDispatchToDoctorSlice";
import SkeletonLoading from "../../partials/nurse-partials/Skeleton";
import LoadingParagraphs from "../../partials/nurse-partials/LoadingParagraphs";
import { getVitalsLinesSlice } from "../../actions/triage-actions/getVitalsLinesSlice";
import FormVitals from "../nurse-view/forms/triage-forms/Vitals";
import DoctorNotes from "./Doctor-Forms/DoctorNotes";
import LabResults from "./Doctor-Forms/LabResults";
import Imaging from "./Doctor-Forms/Imaging";
import Diagnosis from "./Doctor-Forms/Diagnosis";
import Medication from "./Doctor-Forms/Medication";
import OutPatientProcedures from "./Doctor-Forms/OutPatientProcedures";
import Theatre from "./Doctor-Forms/Theatre";
import AdmitPatientForm from "./Doctor-Forms/AdmitPatient";
import TCA_Appointment from "./Doctor-Forms/TCA_Appointment";
import Referrals from "./Doctor-Forms/Referrals";
import ObservationRoom from "./Doctor-Forms/ObservationRoom";
import Injections from "./Doctor-Forms/Injections";
import PatientInfo from "./Doctor-Forms/PatientInfo";
import EvaluationCardContent from "./Doctor-Forms/EvaluationCardContent";

const ConsultationRoomEvalutionCard = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { state } = useLocation(); // Access the state passed via navigate
  const { patientNo, observationNo } = state || {}; // Destructure patient data if available
  // Parse the query parameters using URLSearchParams
  const queryParams = new URLSearchParams(location.search);
  const treatmentNo = queryParams.get("TreatmentNo");
  const userDetails = useAuth();
  const staffNo = userDetails?.userData?.firstName;

  useEffect(() => {
    dispatch(getPatientDetails(patientNo));
    console.log(patientNo);
  }, [dispatch, patientNo]);

  const { loadingPatientDetails, patientDetails } = useSelector(
    (state) => state.getPatientDetails
  );

  const patientName =
    patientDetails?.SearchName ||
    [
      patientDetails?.Surname,
      patientDetails?.FirstName,
      patientDetails?.MiddleName,
    ]
      .filter(Boolean) // Remove null, undefined, or empty strings
      .join(" "); // Join with a space


  return (
    <div style={{ margin: "16px 10px" }}>
      <Space className="inpatient-header">
        <DiffOutlined />
        <Typography.Text className="inpatient-header-text">
          Doctor Evaluation Form
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
            <SkeletonLoading />
          ) : (
           <PatientInfo patientNo={patientNo} treatmentNo={treatmentNo} />
          )}

         
        </Col>
      <Col
          xs={24}
          md={24}
          lg={24}
          xl={24}
          className="inpatient-card-left-col"
        >
          <EvaluationCardContent treatmentNo={treatmentNo} observationNo={observationNo} patientNo={patientNo} {...patientDetails} />
        </Col>
       
      </Row>
    </div>
  );
};

export default ConsultationRoomEvalutionCard;
