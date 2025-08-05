import React, { useEffect, useState } from "react";
import useFetchPatientDetailsHook from "../hooks/useFetchPatientDetailsHook";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Card,
  Col,
  message,
  Row,
  Skeleton,
  Tag,
  Typography,
} from "antd";
import { ArrowLeftOutlined, UserOutlined } from "@ant-design/icons";
import CreateVisitDrawer from "./createVisit/CreateVisitDrawer";
import PatientCharges from "./billing/CashPatients/PatientCharges";
import { postTriageVisit } from "../actions/patientActions";
import { useDispatch, useSelector } from "react-redux";
import { getPatientVisitByNo } from "../actions/reception-actions/patient-visit-actions/getPatientVisitByNo";
import { getPatientCharges } from "../actions/Charges-Actions/getPatientCharges";
import LoadingSpin from "../components/LoadingSpin";
import moment from "moment";

const CreateVisitForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const patientNo = new URLSearchParams(location.search).get("PatientNo");

  const [view, setView] = useState(false);
  const [visitData, setVisitData] = useState(null);
  const [activeVisitNo, setActiveVisitNo] = useState(null);
  const [dispatchingtotriage, setDispatchingtotriage] = useState(false);
  // Fetch patient details
  const { loadingPatientDetails, patientDetails, refetchDetails } =
    useFetchPatientDetailsHook(patientNo);

  // Select the visit details from Redux
  const {
    loadingPatientVisitDetails,
    error,
    data: patientVisitDetails,
  } = useSelector((state) => state.getVisitById);
  const { success: postVisitSuccess, error: postVisitError } = useSelector(
    (state) => state.postTriageVisit
  );
  useEffect(() => {
    if (patientDetails) {
      if (patientDetails.Activated) {
        setActiveVisitNo(patientDetails.ActiveVisitNo);
        setVisitData(patientVisitDetails);
      } else {
        setActiveVisitNo(null);
      }
    } else {
      setActiveVisitNo(null);
    }
  }, [patientDetails, dispatch, patientVisitDetails]);

  useEffect(() => {
    if (activeVisitNo) {
      dispatch(getPatientVisitByNo(activeVisitNo));
      dispatch(getPatientCharges(activeVisitNo));
    }
  }, [activeVisitNo, dispatch]);

  useEffect(() => {
    if (dispatchingtotriage) {
      if (postVisitSuccess) {
        message.success("Dispatched to triage successfully.");

        // Add a slight delay before fetching charges
        setTimeout(() => {
          dispatch(getPatientCharges(activeVisitNo));
          setDispatchingtotriage(false);
        }, 800); // 800ms simulated delay (adjust as needed)
      } else if (postVisitError) {
        message.error(`Error dispatching visit to triage: ${postVisitError}`);
        setDispatchingtotriage(false);
      }
    }
  }, [
    postVisitSuccess,
    postVisitError,
    dispatchingtotriage,
    dispatch,
    activeVisitNo,
  ]);

  // Close modal
  const handleClose = () => {
    setView(false);
  };
  const handleDispatchtoTriage = async () => {
    if (!patientDetails?.Activated) {
      return;
    }
    // Logic for dispatching to triage
    if (patientDetails.ActiveVisitNo) {
      setActiveVisitNo(patientDetails.ActiveVisitNo);
      const payload = {
        appointmentNo: activeVisitNo,
      };
      await dispatch(postTriageVisit(payload));
      setDispatchingtotriage(true);
    }
  };

  const handleDirectAdmission = () => {
    navigate(
      `/Dashboard/patient-list/Direct-Admission/?PatientNo=${patientNo}`
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-2">
        <Button
          type="link"
          onClick={() => navigate("/Reception/Patient-list")}
          icon={<ArrowLeftOutlined />}
        >
          Go back
        </Button>
        <Typography.Title level={5}>
          <u>Visit Card</u>
        </Typography.Title>
        <div className="d-flex justify-content-between align-items-center">
          {patientDetails?.Activated && patientDetails?.ActiveVisitNo ? (
            <Button type="primary" onClick={() => setView(true)}>
              Visit Card
            </Button>
          ) : (
            <Button type="primary" onClick={() => setView(true)}>
              Create Visit
            </Button>
          )}
          <Button
            type="default"
            style={{ marginLeft: "10px" }}
            onClick={handleDirectAdmission}
          >
            Request Admission
          </Button>
        </div>
      </div>

      <div className="d-flex flex-column">
        <Card
          className="card"
          style={{
            width: "100%",
            borderTop: "3px solid #0f5689",
            padding: "20px",
          }}
        >
          {loadingPatientDetails || loadingPatientVisitDetails ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : patientDetails ? (
            <Row align="middle" gutter={16}>
              <Col flex="100px">
                <Avatar size={80} src={"profile"} icon={<UserOutlined />} />
              </Col>
              <Col flex="auto">
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, auto)",
                    gap: "12px 20px",
                    fontSize: "14px",
                    fontWeight: "400",
                  }}
                >
                  <span>
                    <b>Patient No:</b> {patientDetails.PatientNo}
                  </span>
                  <span>
                    <b>Name:</b> {patientDetails.SearchName?.toUpperCase()}
                  </span>
                  <span>
                    <b>ID No:</b> {patientDetails.IDNumber}
                  </span>
                  <span>
                    <b>Gender:</b> {patientDetails.Gender}
                  </span>
                  <span>
                    <b>Patient Type:</b> {patientDetails.PatientType}
                  </span>
                  <span>
                    <b>Visit Date:</b>{" "}
                    {visitData?.AppointmentDate
                      ? moment(visitData.AppointmentDate).format("DD/MM/YYYY")
                      : moment().format("DD/MM/YYYY")}
                  </span>
                  <span>
                    <b>Doctor:</b> {visitData?.DoctorsName}
                  </span>
                  <span>
                    <b>Clinic:</b> {visitData?.SpecialClinics}
                  </span>
                  <span>
                    <b>Settlement Mode:</b> {visitData?.PatientType}
                  </span>
                  <span>
                    <b> Status:</b>
                    {visitData?.Status ? (
                      <Tag
                        color="blue"
                        style={{
                          textTransform: "capitalize",
                          fontWeight: "bold",
                          fontSize: "14px",
                          fontFamily: "Arial, sans-serif",
                          marginLeft: "5px",
                        }}
                      >
                        {visitData.Status}
                      </Tag>
                    ) : patientDetails?.Activated ? (
                      <Tag
                        color="green"
                        style={{
                          textTransform: "capitalize",
                          fontWeight: "bold",
                          fontSize: "14px",
                          fontFamily: "Arial, sans-serif",
                          marginLeft: "5px",
                        }}
                      >
                        Active
                      </Tag>
                    ) : (
                      <Tag
                        color="red"
                        style={{
                          textTransform: "capitalize",
                          fontWeight: "bold",
                          fontSize: "14px",
                          fontFamily: "Arial, sans-serif",
                          marginLeft: "5px",
                        }}
                      >
                        Inactive
                      </Tag>
                    )}
                  </span>
                </div>
              </Col>
            </Row>
          ) : (
            <p style={{ textAlign: "center", fontSize: "16px", color: "#888" }}>
              No patient details found. Register a new patient.
            </p>
          )}
        </Card>

        <Card
          style={{
            marginTop: "20px",
            padding: "8px",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
            border: "1px solid #ddd",
          }}
        >
          <div className="row mt-3">
            <div className="col-12">
              <PatientCharges activeVisitNo={activeVisitNo || ""} />
            </div>
          </div>
        </Card>
      </div>

      <CreateVisitDrawer
        visible={view}
        onClose={handleClose}
        //  onUpdateVisit={handleViewDetailsUpdate}
      />

      <LoadingSpin loading={dispatchingtotriage} />
    </div>
  );
};

export default CreateVisitForm;
