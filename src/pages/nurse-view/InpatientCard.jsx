import { Button, Card, Col, message, Modal, Row, Space } from "antd";
import { useLocation, redirect, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"; // import dispatch hook
import { useState } from "react";
import NurseInnerHeader from "../../partials/nurse-partials/NurseInnerHeader";
import InpatientCardInfo from "./InpatientCardInfo";
import PatientVitalInfo from "../doctorsViews/Doctor-Forms/PatientVitalInfo";
import CarePlan from "./CarePlan";
import Medication from "./Medication";
import Requests from "./Requests";
import Discharges from "./Discharges";
import WardTransfer from "./WardTransfer";
import NursingPatientCharges from "./billing/NursingPatientCharges";
import useAuth from "../../hooks/useAuth";
import {
  POST_INITIATE_DISCHARGE_FAILURE,
  POST_INITIATE_DISCHARGE_SUCCESS,
  postInitiateDischargeSlice,
} from "../../actions/nurse-actions/postInitiateDischargeSlice";

const InpatientCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useAuth().userData.departmentName;
  const location = useLocation();
  const { patientDetails } = location.state || {};
  const [activeTab, setActiveTab] = useState("1");
  const [confirmLoading, setConfirmLoading] = useState(false); // loading state for modal buttons
  const patientNo = new URLSearchParams(location.search).get("PatientNo");
  const treatmentNo = new URLSearchParams(location.search).get("AdmNo");
  const { confirm } = Modal;

  if (!patientDetails) {
    return redirect("/login");
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "1":
        return (
          <CarePlan
            patientNo={patientNo}
            patientDetails={patientDetails}
            role={role}
          />
        );
      case "2":
        return <Medication role={role} />;
      case "3":
        return <Requests />;
      case "4":
        return <Discharges />;
      case "5":
        return <WardTransfer />;
      case "6":
        return <NursingPatientCharges />;
      default:
        return null;
    }
  };
  const handleInitiateDischarge = () => {
    confirm({
      title: "Confirm Initiate Discharge",
      content: `Are you sure you want to initiate discharge for ${patientDetails?.PatientName}?`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      okButtonProps: { loading: confirmLoading },
      onOk() {
        setConfirmLoading(true);
        return handleInitiateDischargeAction()
          .then(() => {
            setConfirmLoading(false);
          })
          .catch(() => {
            setConfirmLoading(false);
          });
      },
    });
  };

  const handleInitiateDischargeAction = async () => {
    try {
      const result = await dispatch(
        postInitiateDischargeSlice("/Inpatient/InitiateDischarge", {
          admissionNo: treatmentNo,
        })
      );

      if (result.type === POST_INITIATE_DISCHARGE_SUCCESS) {
        message.success(
          result.payload.message ||
            `${patientDetails?.PatientName} discharge initiated successfully!`
        );
        navigate("/Nurse/Discharge-list");
        return Promise.resolve();
      } else if (result.type === POST_INITIATE_DISCHARGE_FAILURE) {
        message.error(
          result.payload.message ||
            "An error occurred while initiating patient discharge, please try again."
        );
        return Promise.reject();
      }
    } catch (error) {
      message.error(error.message || "Unexpected error occurred");
      return Promise.reject();
    }
  };
  return (
    <div style={{ margin: "20px 10px" }}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <NurseInnerHeader title="Patient Card" />
        {role !== "Psychology" && (
          <Button
            type="primary"
            icon={<i className="fas fa-ellipsis-v"></i>}
            style={{ backgroundColor: "#0f5689", color: "#ffffff" }}
            onClick={handleInitiateDischarge}
          >
            Proceed to Initiate Discharge
          </Button>
        )}
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={16}>
          <InpatientCardInfo patientDetail={patientDetails} />
        </Col>

        <Col xs={24} md={8}>
          <Card bodyStyle={{ padding: 16 }}>
            <h5
              style={{
                textAlign: "center",
                marginBottom: 16,
                color: "#0f5689",
              }}
            >
              Nursing Tools
            </h5>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button
                block
                type={activeTab === "1" ? "primary" : "default"}
                onClick={() => setActiveTab("1")}
              >
                Daily Review
              </Button>
              <Button
                block
                type={activeTab === "2" ? "primary" : "default"}
                onClick={() => setActiveTab("2")}
              >
                Medication
              </Button>
              <Button
                block
                type={activeTab === "3" ? "primary" : "default"}
                onClick={() => setActiveTab("3")}
              >
                Procedures
              </Button>
              <Button
                block
                type={activeTab === "4" ? "primary" : "default"}
                onClick={() => setActiveTab("4")}
              >
                Discharge
              </Button>
              {role === "Nurse" && (
                <>
                  <Button
                    block
                    type={activeTab === "5" ? "primary" : "default"}
                    onClick={() => setActiveTab("5")}
                  >
                    Ward Transfer
                  </Button>
                </>
              )}
              <Button
                block
                type={activeTab === "6" ? "primary" : "default"}
                onClick={() => setActiveTab("6")}
              >
                Patient Charges
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} md={16}>
          {renderTabContent()}
        </Col>
        <Col
          xs={24}
          md={8}
          style={{
            position: "sticky",
            top: 70,
            alignSelf: "flex-start",
            zIndex: 1,
          }}
        >
          <Card bodyStyle={{ padding: 16 }}>
            <PatientVitalInfo role={role} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default InpatientCard;
