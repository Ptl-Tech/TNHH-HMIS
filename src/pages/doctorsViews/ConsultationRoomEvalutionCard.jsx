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
import Injections from "../nurse-view/forms/triage-forms/Injections";
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

const ConsultationRoomEvalutionCard = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  // Parse the query parameters using URLSearchParams
  const queryParams = new URLSearchParams(location.search);
  const patientNo = queryParams.get("Patient_id");
  const observationNo = queryParams.get("TreatmentNo");
  const userDetails = useAuth();
  const staffNo = userDetails?.userData?.firstName;

  useEffect(() => {
    dispatch(getPatientDetails(patientNo));
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

  const handleDispatchAction = (observationNumber) => {
    dispatch(getVitalsLinesSlice(observationNumber)).then((data) => {
      if (Object.keys(data).length > 0) {
        dispatch(
          postDispatchToDoctorSlice({
            observationNo: observationNumber,
            staffNo,
          })
        ).then((data) => {
          if (Object.keys(data).length > 0) {
            message.success("Patient dispatched to doctor successfully");
          } else {
            message.error("An error occurred, please try again");
          }
        });
      } else {
        message.error("Please add vitals before dispatching to doctor");
      }
    });
  };

  const tabs = [
    {
      key: "1",
      label: "Allergy and Medication",
      content: <AllergyAndMedication />,
    },
    { key: "2", label: "Injections", content: <Injections /> },
    { key: "3", label: "Observation Room", content: <Dressing /> },
    { key: "4", label: "Vitals", content: <FormVitals /> },
    { key: "5", label: "Doctor Notes", content: <DoctorNotes /> },
    { key: "6", label: "Lab Results", content: <LabResults /> },
    { key: "7", label: "Radiology", content: <Imaging /> },
    { key: "8", label: "Diagnosis", content: <Diagnosis /> },
    { key: "9", label: "Medication", content: <Medication /> },
    {
      key: "10",
      label: "Outpatient Procedures",
      content: <OutPatientProcedures />,
    },
    { key: "11", label: "Theatre", content: <Theatre /> },
    { key: "12", label: "Admit Patient", content: <AdmitPatientForm /> },
    { key: "13", label: "Dispatch to Pyschology", content: <TCA_Appointment /> },
    { key: "14", label: "Referrals", content: <Referrals /> },
  ];

  return (
    <div style={{ margin: "16px 10px" }}>
      <Space className="inpatient-header">
        <DiffOutlined />
        <Typography.Text className="inpatient-header-text">
          Doctor Evaluation Form
        </Typography.Text>
      </Space>
      <Row gutter={8} className="inpatient-card-container">
        <Col xs={24} md={24} lg={16} xl={16}>
          <Card style={{ padding: "10px 16px" }}>
            <Row gutter={8}>
              <Tabs
                defaultActiveKey="1"
                tabPosition="top"
                style={{
                  overflowX: "auto", // Enables horizontal scrolling for the tabs
                  whiteSpace: "nowrap", // Prevents tabs from wrapping
                }}
                items={tabs.map((tab) => ({
                  label: tab.label,
                  key: tab.key,
                  children: tab.content,
                }))}
                tabBarStyle={{
                  maxWidth: "100%", // Ensures tabs fit within the visible area
                }}
              />
            </Row>
          </Card>
        </Col>
        <Col xs={24} md={24} lg={8} xl={8}>
          {loadingPatientDetails ? (
            <SkeletonLoading />
          ) : (
            <Card
              style={{
                padding: "10px 16px",
           //     marginTop: "10px",
                background: "#F9F9F9",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "start",
                  gap: "12px",
                }}
              >
                <Avatar icon={<UserOutlined />} size={48} />
                <div style={{ marginTop: "10px" }}>
                  <Typography.Title
                    level={5}
                    style={{ color: "black", fontSize: "13px" }}
                  >
                    {patientName}
                  </Typography.Title>
                  <Typography.Text style={{ fontSize: "13px", color: "gray" }}>
                    DOB: {patientDetails?.DateOfBirth}
                  </Typography.Text>
                </div>
              </div>
              <Divider />
              <Button
                type="primary"
                onClick={() => handleDispatchAction(observationNo)}
                style={{ width: "100%", marginBottom: "10px" }}
              >
                Dispatch patient to the Doctor
              </Button>
            </Card>
          )}

          {loadingPatientDetails ? (
            <LoadingParagraphs />
          ) : (
            <Card
            style={{
              padding: "10px 16px",
              marginTop: "10px",
              background: "#F9F9F9",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
            >
              <Typography.Title
                level={5}
                style={{
                  color: "#0F5689",
                  fontSize: "16px",
                  marginBottom: "12px",
                }}
              >
                Additional Information
              </Typography.Title>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                }}
              >
                <Typography.Title
                  level={5}
                  style={{ fontSize: "14px", color: "black" }}
                >
                  PatientNumber
                </Typography.Title>

                <Typography.Text
                  style={{
                    fontSize: "12px",
                    color: "gray",
                    fontWeight: "bold",
                  }}
                >
                  {patientDetails?.PatientNo}
                </Typography.Text>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                }}
              >
                <Typography.Title
                  level={5}
                  style={{ fontSize: "14px", color: "black" }}
                >
                  Treatment No
                </Typography.Title>
                <Typography.Text
                   style={{
                    fontSize: "14px",
                    color: "#333",
                    fontWeight: "bold",
                  }}
                >
                  {observationNo}
                </Typography.Text>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                }}
              >
                <Typography.Title
                  level={5}
                  style={{
                    fontSize: "14px",
                    color: "#333",
                    fontWeight: "bold",
                  }}                >
                  Age
                </Typography.Title>
                <Typography.Text
                  style={{
                    fontSize: "14px",
                    color: "#333",
                    fontWeight: "bold",
                  }}
                >
                  {`${patientDetails?.AgeinYears} Years`}
                </Typography.Text>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                }}
              >
                <Typography.Title
                  level={5}
                  style={{ fontSize: "14px", color: "black" }}
                >
                  Gender
                </Typography.Title>
                <Typography.Text
                  style={{
                    fontSize: "12px",
                    color: "gray",
                    fontWeight: "bold",
                  }}
                >
                  {patientDetails?.Gender}
                </Typography.Text>
              </div>
            </Card>
          )}
          {loadingPatientDetails ? (
            <LoadingParagraphs />
          ) : (
            <Card
            style={{
              padding: "10px 16px",
              marginTop: "10px",
              background: "#F9F9F9",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
            >
              <Typography.Title
                level={5}
                style={{
                  color: "#0f5689",
                  fontSize: "14px",
                  margin: "10px 0 10px 0",
                }}
              >
                Settlement Information
              </Typography.Title>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                }}
              >
                <Typography.Title
                  level={5}
                  style={{ fontSize: "14px", color: "black" }}
                >
                  Settlement Type
                </Typography.Title>

                <Typography.Text
                  style={{
                    fontSize: "12px",
                    color: "gray",
                    fontWeight: "bold",
                  }}
                >
                  {patientDetails?.PatientType}
                </Typography.Text>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                }}
              >
                <Typography.Title
                  level={5}
                  style={{ fontSize: "14px", color: "black" }}
                >
                  Insurance
                </Typography.Title>
                <Typography.Text
                  style={{
                    fontSize: "12px",
                    color: "gray",
                    fontWeight: "bold",
                  }}
                >
                  {patientDetails?.SchemeName || "N/A"}
                </Typography.Text>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                }}
              >
                <Typography.Title
                  level={5}
                  style={{ fontSize: "14px", color: "black" }}
                >
                  Patient Bill Balance:
                </Typography.Title>
                <Typography.Text
                  style={{
                    fontSize: "12px",
                    color: "gray",
                    fontWeight: "bold",
                  }}
                >
                  {` KSH. ${patientDetails?.TotalBilled} `}
                </Typography.Text>
              </div>
              {/* <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                }}
              >
                <Typography.Title
                  level={5}
                  style={{ fontSize: "14px", color: "black" }}
                >
                  Gender
                </Typography.Title>
                <Typography.Text
                  style={{
                    fontSize: "12px",
                    color: "gray",
                    fontWeight: "bold",
                  }}
                >
                  {patientDetails?.Gender}
                </Typography.Text>
              </div> */}
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ConsultationRoomEvalutionCard;
