import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSingleDischargeRequest } from "../../actions/reception-actions/getSingleDischargeRequest";
import NurseInnerHeader from "../../partials/nurse-partials/NurseInnerHeader";
import LoadingParagraphs from "../../partials/nurse-partials/LoadingParagraphs";
import {
  UserOutlined,
  DisconnectOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { Alert, Button, Card, Col, Row, Typography, message } from "antd";
import { useLocation } from "react-router-dom";
import PatientCharges from "./CashPatients/PatientCharges";
import {
  postPostDischargeSlice,
  POST_DISCHARGE_PATIENT_FAILURE,
  POST_DISCHARGE_PATIENT_SUCCESS,
} from "../../actions/nurse-actions/postPostDischargeSlice";
import {
  postCancelDischargeSlice,
  POST_CANCEL_DISCHARGE_FAILURE,
  POST_CANCEL_DISCHARGE_SUCCESS,
} from "../../actions/nurse-actions/postCancelDischargeSlice";

const DischargePage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const admnissionNo = new URLSearchParams(location.search).get("PatientNo");

  const { loading, success, error, data } = useSelector(
    (state) => state.getSingleDischargeRequest
  );

  useEffect(() => {
    if (admnissionNo) {
      dispatch(getSingleDischargeRequest(admnissionNo));
    }
  }, [dispatch, admnissionNo]);

  const handleDischargePatientAction = async () => {
    try {
      const result = await dispatch(
        postPostDischargeSlice("/Inpatient/PostDischarge", {
          admissionNo: admnissionNo,
        })
      );

      if (result.type === POST_DISCHARGE_PATIENT_SUCCESS) {
        message.success(
          result.payload.message ||
            `${data?.Surname} ${data?.Middle_Name} ${data?.Last_Name} discharged successfully!`
        );

        dispatch(getSingleDischargeRequest(admnissionNo));
        return Promise.resolve(); // Resolve the Promise to close the modal
      } else if (result.type === POST_DISCHARGE_PATIENT_FAILURE) {
        message.error(
          result?.payload?.response?.data?.errors ||
            result?.payload?.message ||
            "An error occurred while discharging the patient, please try again later."
        );
        return Promise.reject(); // Reject the Promise to keep the modal open
      }
    } catch (error) {
      message.error(error.message || "Unexpected error occurred");
      return Promise.reject(); // Reject on unexpected errors
    }
  };
  const handleCancelDischargeAction = async () => {
    try {
      const result = await dispatch(
        postCancelDischargeSlice("/Inpatient/CancelDischarge", {
          admissionNo: admnissionNo,
        })
      );

      if (result.type === POST_CANCEL_DISCHARGE_SUCCESS) {
        message.success(
          result.payload.message ||
            `${data?.Surname} ${data?.Middle_Name} ${data?.Last_Name} discharge cancelled successfully!`
        );
        window.history.back();
        return Promise.resolve(); // Resolve the Promise to close the modal
      } else if (result.type === POST_CANCEL_DISCHARGE_FAILURE) {
        message.error(
          result?.payload?.response?.data?.errors ||
            result?.payload?.message ||
            "An error occurred while cancelling discharge, please try again."
        );
        return Promise.reject(); // Reject the Promise to keep the modal open
      }
    } catch (error) {
      message.error(error.message || "Unexpected error occurred");
      return Promise.reject(); // Reject on unexpected errors
    }
  };

  const patientPrimaryInfo = [
    {
      title: "Patient Name",
      description:
        `${data?.Surname} ${data?.Middle_Name} ${data?.Last_Name}` || "N/A",
    },
    { title: "Admission Number", description: data?.Admission_No || "N/A" },
    { title: "ID Number", description: data?.ID_Number || "N/A" },

    {
      title: "Date of Admission",
      description: data?.Date_of_Admission || "N/A",
    },
  ];

  const patientSecondaryInfo = [
    { title: "Ward No", description: data?.Ward_No || "N/A" },
    { title: "Bed No", description: data?.Bed_No || "N/A" },
    { title: "Status", description: data?.Status || "N/A" },
    { title: "Discharge Date", description: data?.Discharge_Date || "N/A" },
  ];

  return (
    <div>
      <Button
        type="default"
        size="small"
        style={{ marginBottom: "10px", flex: "end" }}
        onClick={() => window.history.back()}
        icon={<ArrowLeftOutlined />}
      >
        Go Back
      </Button>
      <div className="d-flex justify-content-between align-items-center">
        <NurseInnerHeader icon={<UserOutlined />} title="Discharge sheet" />
        <div className="d-flex">
          <Button
            type="primary"
            size="small"
            danger
            icon={<DisconnectOutlined />}
            onClick={handleCancelDischargeAction}
          >
            Cancel Discharge
          </Button>
          <Button
            type="primary"
            size="small"
            style={{ marginLeft: "10px" }}
            icon={<UserOutlined />}
            onClick={handleDischargePatientAction}
          >
            Post Discharge Patient
          </Button>
        </div>
      </div>
      {loading ? (
        <LoadingParagraphs paragraphs={3} />
      ) : error ? (
        <Alert message={error} type="error" showIcon />
      ) : success ? (
        <>
          <Row gutter={16} style={{ marginTop: "20px" }}>
            {/* Primary Card */}
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Card
                style={{
                  backgroundColor: "#ffffff",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  padding: "10px 16px",
                  borderTop: "3px solid #0f5689",
                }}
              >
                {patientPrimaryInfo.map((info, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "5px",
                    }}
                  >
                    <Typography.Text strong style={{ paddingTop: "5px" }}>
                      {info.title}
                    </Typography.Text>
                    <Typography.Text>{info.description}</Typography.Text>
                  </div>
                ))}
              </Card>
            </Col>

            {/* Secondary Card */}
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Card
                style={{
                  backgroundColor: "#ffffff",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  padding: "10px 16px",
                  borderTop: "3px solid #0f5689",
                }}
              >
                {patientSecondaryInfo.map((info, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "5px",
                    }}
                  >
                    <Typography.Text strong style={{ paddingTop: "5px" }}>
                      {info.title}
                    </Typography.Text>
                    <Typography.Text>{info.description}</Typography.Text>
                  </div>
                ))}
              </Card>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: "20px" }}>
            <Col span={24}>
              <Card
                style={{
                  backgroundColor: "#ffffff",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  padding: "10px 16px",
                  borderTop: "3px solid #0f5689",
                }}
              >
                <NurseInnerHeader
                  icon={<DisconnectOutlined />}
                  title="Discharge Summary"
                />
                <div>
                  <PatientCharges activeVisitNo={admnissionNo} />
                </div>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <Alert message="No data available" type="info" showIcon />
      )}
    </div>
  );
};

export default DischargePage;
