import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, redirect, useNavigate } from "react-router-dom";

import { Button, Card, Col, message, Modal, Row, Space } from "antd";

import CarePlan from "./CarePlan";
import Requests from "./Requests";
import Discharges from "./Discharges";
import Medication from "./Medication";
import WardTransfer from "./WardTransfer";
import InpatientCardInfo from "./InpatientCardInfo";
import NursingPatientCharges from "./billing/NursingPatientCharges";
import PatientVitalInfo from "../doctorsViews/Doctor-Forms/PatientVitalInfo";
import NurseInnerHeader from "../../partials/nurse-partials/NurseInnerHeader";

// import useAuth from "../../hooks/useAuth";

import {
  postInitiateDischargeSlice,
  POST_INITIATE_DISCHARGE_FAILURE,
  POST_INITIATE_DISCHARGE_SUCCESS,
} from "../../actions/nurse-actions/postInitiateDischargeSlice";
import { getPgAdmissionsAdmittedSlice } from "../../actions/nurse-actions/getPgAdmissionsAdmittedSlice";
import { currentInpatient } from "../../actions/Doc-actions/currentInpatient";
import { getSingleAdmittedSlice } from "../../actions/nurse-actions/getSingleAdmittedSlice";
import { useAbility } from "../../hooks/casl";

const InpatientCard = () => {
  const { confirm } = Modal;

  const ability = useAbility();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { patientDetails } = location.state || {};
  const canCreateWardTransfer = ability.can("create", "wardTransfer");
  const canCreateInitiateDischarge = ability.can("create", "initiateDischarge");

  const [activeTab, setActiveTab] = useState("1");
  const [confirmLoading, setConfirmLoading] = useState(false); // loading state for modal buttons

  const admissionNo = new URLSearchParams(location.search).get("AdmNo");
  const patientNo = new URLSearchParams(location.search).get("PatientNo");

  const { error: singleAdmittedError, data: singleAdmittedData } = useSelector(
    (state) => state.getSingleAdmitted
  );

  /* 
    - The first useEffect gets a single admitted patient's data using the admissionNo in the URL's search params
    - The second useEffect sets the admitted patient's data to the state for global use.
  */

  // First useEffect - getting admitted patient
  useEffect(() => {
    dispatch(getSingleAdmittedSlice(admissionNo));
  }, [admissionNo]);

  // Second useEffect - setting the addmited patient to global state
  useEffect(() => {
    if (singleAdmittedData) dispatch(currentInpatient(singleAdmittedData));
  }, [singleAdmittedError, singleAdmittedData]);

  if (!patientDetails) return redirect("/login");

  const renderTabContent = () => {
    switch (activeTab) {
      case "1":
        return (
          <CarePlan patientNo={patientNo} patientDetails={patientDetails} />
        );
      case "2":
        return <Medication patientDetails={patientDetails} />;
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
          admissionNo,
        })
      );

      if (result.type === POST_INITIATE_DISCHARGE_SUCCESS) {
        message.success(
          result.payload.message ||
            `${patientDetails?.PatientName} discharge initiated successfully!`
        );
        navigate("/Dashboard/Discharge-list");
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
        {canCreateInitiateDischarge && (
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
          <Card>
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
              {canCreateWardTransfer && (
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
          <Card styles={{ body: { padding: 16 } }}>
            <PatientVitalInfo />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default InpatientCard;
