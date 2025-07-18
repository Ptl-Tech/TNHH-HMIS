import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useFetchPatientDetailsHook from "../../hooks/useFetchPatientDetailsHook";
import { Skeleton, Row, Col, Tag, Card } from "antd";
import moment from "moment";
import { getPatientVisitByNo } from "../../actions/reception-actions/patient-visit-actions/getPatientVisitByNo";

const PatientHeader = ({ activeVisitNo, patientNo, initialVisitData }) => {
  const dispatch = useDispatch();

  const { loadingPatientDetails, patientDetails } =
    useFetchPatientDetailsHook(patientNo);

  const {
    loadingPatientVisitDetails,
    data: patientVisitDetails,
  } = useSelector((state) => state.getVisitById);

  useEffect(() => {
    if (activeVisitNo) {
      dispatch(getPatientVisitByNo(activeVisitNo));
    }
  }, [activeVisitNo, dispatch]);

  // Combine visit data only if we have either initialVisitData or an active visit
  const visitData = activeVisitNo || initialVisitData ? {
    ...patientVisitDetails,
    ...initialVisitData,
  } : {};

  // Combine everything into one unified object for display
  const displayData = {
    ...patientDetails,
    ...visitData,
  };

  return (
    <Card
      className="card"
      style={{
        width: "100%",
        borderTop: "3px solid #0f5689",
        padding: "20px",
      }}
    >
      {loadingPatientDetails ? (
        <Skeleton active paragraph={{ rows: 1 }} title={false} />
      ) : (
        <Row align="middle" gutter={16}>
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
              <span><b>Patient No:</b> {displayData?.PatientNo}</span>
              <span><b>Name:</b> {displayData?.SearchName?.toUpperCase()}</span>
              <span><b>ID No:</b> {displayData?.IDNumber}</span>
              <span><b>Gender:</b> {displayData?.Gender}</span>
              <span><b>Patient Type:</b> {displayData?.PatientType}</span>

              {displayData?.AppointmentDate && (
                <span>
                  <b>Visit Date:</b>{" "}
                  {moment(displayData.AppointmentDate).format("DD/MM/YYYY")}
                </span>
              )}

              {displayData?.DoctorsName && (
                <span><b>Doctor:</b> {displayData.DoctorsName}</span>
              )}

              {displayData?.SpecialClinics && (
                <span><b>Clinic:</b> {displayData.SpecialClinics}</span>
              )}

              {displayData?.PatientType && (
                <span><b>Settlement Mode:</b> {displayData.PatientType}</span>
              )}

              <span>
                <b>Status:</b>{" "}
                {displayData?.Activated ? (
                  <Tag style={tagStyle} color="green">
                    {displayData?.Status || "Active"}
                  </Tag>
                ) : (
                  <Tag style={tagStyle} color="blue">
                    {displayData?.Status !=="Request Made" || "Inactive"}
                  </Tag>
                )}
              </span>

              {displayData?.PatientType !== "Cash" && displayData?.InsuranceName && (
                <span>
                  <b>Insurance Name:</b> {displayData?.InsuranceName}
                </span>
              )}

            </div>
          </Col>
        </Row>
      )}
    </Card>
  );
};

const tagStyle = {
  textTransform: "capitalize",
  fontWeight: "bold",
  fontSize: "14px",
  fontFamily: "Arial, sans-serif",
  marginLeft: "5px",
};

export default PatientHeader;
