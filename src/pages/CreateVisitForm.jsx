import React, { useEffect, useState } from "react";
import useFetchPatientDetailsHook from "../hooks/useFetchPatientDetailsHook";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Card,
  Col,
  Dropdown,
  Menu,
  message,
  Row,
  Skeleton,
  Table,
  Tag,
  Typography,
} from "antd";
import {
  ArrowLeftOutlined,
  UserOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import CreateVisitDrawer from "./createVisit/CreateVisitDrawer";
import useFetchPatientVisitDetailsHook from "../hooks/useFetchPatientVisitDetailsHook";
import PatientCharges from "./billing/CashPatients/PatientCharges";
import { postTriageVisit } from "../actions/patientActions";
import { useDispatch, useSelector } from "react-redux";

const CreateVisitForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const patientNo = new URLSearchParams(location.search).get("PatientNo");
  
  const [view, setView] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const [visitData, setVisitData] = useState(null);
  const [activeVisitNo, setActiveVisitNo] = useState(null);
  // Fetch patient details
  const { loadingPatientDetails, patientDetails } =
    useFetchPatientDetailsHook(patientNo);
  console.log(patientDetails);
  // Fetch visit details only when activeVisitNo is set
  const { loadingPatientVisitDetails, patientVisitDetails } =
    useFetchPatientVisitDetailsHook(activeVisitNo);

 const { loading: postVisitLoading, success: postVisitSuccess, data : postVisitdata } = useSelector(
    (state) => state.postTriageVisit
  );

  // Set active visit number when patient details update
  useEffect(() => {
    if (patientDetails?.ActiveVisitNo) {
      setActiveVisitNo(patientDetails.ActiveVisitNo);
    }
  }, [patientDetails]);

  // Merge patient and visit details, ensuring fresh data
  useEffect(() => {
    if (patientDetails) {
      setPatientData(patientDetails); // Ensure patientData is always set
    }

    if (patientDetails?.Activated && patientDetails?.ActiveVisitNo) {
      setVisitData({
        ...patientDetails,
        ...patientVisitDetails,
      });
    } else {
      setVisitData(null); // Reset visit data if no active visit
    }
  }, [patientNo, patientDetails, patientVisitDetails]);

  // Handle visit update
  const handleViewDetailsUpdate = (newVisitNo) => {
    setActiveVisitNo(newVisitNo);
  };

 

  //if we have a visit number, fetch the visit details and patient details again
  useEffect(() => {
    if (activeVisitNo) {
      setVisitData(patientVisitDetails);
    } else {
      setVisitData(null);
      setPatientData(null);
    }
  }, [activeVisitNo, patientVisitDetails]);

  // Close modal
  const handleClose = () => {
    setView(false);
  };
  const handleDispatchtoTriage=() => {
    if(!activeVisitNo){
      return
    };
    // Logic for dispatching to triage
    if (activeVisitNo) {
      const payload={
        appointmentNo:activeVisitNo,
      }
      dispatch(postTriageVisit(payload));
      if(postVisitSuccess){
       message.success(`Visit ${postVisitdata} dispatched to triage successfully`);
      }
    }
  
  };

  const handleDirectAdmission=()=>{
    navigate(`/reception/patient-list/Direct-Admission/?PatientNo=${patientNo}`);
  }

  // Actions menu
  const menu = (
    <Menu onClick={({ key }) => key === "visit_action" && setView(true)}>
      <Menu.Item key="visit_action">
        {activeVisitNo ? "View Visit Details" : "Create Visit"}
      </Menu.Item>
      <Menu.Item key="triage_action" onClick={handleDispatchtoTriage}>Dispatch to Triage</Menu.Item>

      <Menu.Item key="request_admission" onClick={handleDirectAdmission}>Request Admission</Menu.Item>

    </Menu>
  );

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
          onClick={() => navigate(-1)}
          icon={<ArrowLeftOutlined />}
        >
          Go back
        </Button>
        <Dropdown overlay={menu} trigger={["click"]}>
          <Button type="primary" icon={<MoreOutlined />}>
            <span className="ant-dropdown-link fw-bold">Actions</span>
          </Button>
        </Dropdown>
      </div>

      <div className="d-flex flex-column">
        <Card
          style={{
            width: "100%",
            maxWidth: "1200px",
            padding: "20px",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
            border: "2px solid #0f5689",
          }}
        >
          {loadingPatientDetails || loadingPatientVisitDetails ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : patientData ? (
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
                    <b>Patient No:</b> {patientData.PatientNo}
                  </span>
                  <span>
                    <b>Name:</b> {patientData.SearchName}
                  </span>
                  <span>
                    <b>ID No:</b> {patientData.IDNumber}
                  </span>
                  {/* <span>
                    <b>Status:</b>
                    <Tag
                      color={
                        visitData?.Status
                          ? visitData.Status === "New"
                            ? "blue"
                            : visitData.Status === "Request Made"
                            ? "orange"
                            : visitData.Status === "Dispatched"
                            ? "yellow"
                            : "default"
                          : patientData?.Activated
                          ? "green"
                          : "red"
                      }
                    >
                      {visitData?.Status ||
                        (patientData?.Activated ? "Active" : "Inactive")}
                    </Tag>
                  </span> */}

                  <span>
                    <b>Gender:</b> {patientData.Gender}
                  </span>
                  <span>
                    <b>Patient Type:</b> {patientData.PatientType}
                  </span>
                  <span>
                    <b>Visit Date:</b> {visitData?.AppointmentDate}
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
                    ) : patientData?.Activated ? (
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
        visitData={visitData}
        onUpdateVisit={handleViewDetailsUpdate}
      />
    </div>
  );
};

export default CreateVisitForm;
