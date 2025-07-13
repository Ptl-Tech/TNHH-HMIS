import React from "react";
import { Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  POST_PHARMACY_APPOINTMENT_SUCCESS,
  POST_PHARMACY_APPOINTMENT_FAIL,
  postPharmacyAppointment,
} from "../../../actions/reception-actions/dispatchPharmacyAppointment";
import { POST_LAB_APPOINTMENT_FAIL, POST_LAB_APPOINTMENT_SUCCESS, postLabAppointment } from "../../../actions/reception-actions/dispatchLabAppointment";
import { postTriageVisit } from "../../../actions/patientActions";
import { POST_TRIAGE_VISIT_FAIL, POST_TRIAGE_VISIT_SUCCESS } from "../../../constants/patientConstants";

export const DispatchToPharmacy = ({ patientNo }) => {
  const dispatch = useDispatch();

  const { loading: loadingPostPharmacyAppointment } = useSelector(
    (state) => state.postPharmacyAppointment || {}
  );

  const handleDispatch = async () => {
    try {
      const response = await dispatch(postPharmacyAppointment({}, patientNo));

      if (response.type === POST_PHARMACY_APPOINTMENT_SUCCESS) {
        message.success("Patient dispatched to pharmacy successfully!");
      } else if (response.type === POST_PHARMACY_APPOINTMENT_FAIL) {
        message.error(
          response.payload || "Failed to dispatch patient to pharmacy"
        );
      }
    } catch (error) {
      message.error(
             error.payload.message || "Unexpected error during dispatch to pharmacy"
           );
    }
  };

  return (
    <Button
      type="primary"
      loading={loadingPostPharmacyAppointment}
      onClick={handleDispatch}
    >
      Dispatch to Pharmacy
    </Button>
  );
};

export const DispatchToLab = ({ patientNo }) => {
  const dispatch = useDispatch();

  const { loading: loadingPostLabAppointment
   } = useSelector(
    (state) => state.postLabAppointment || {}
  );

  const handleDispatch = async () => {
    try {
      const response = await dispatch(postLabAppointment({}, patientNo));

      if (response.type === POST_LAB_APPOINTMENT_SUCCESS) {
      message.success(`Patient has been dispatched to Laboratory successfully!. Assigned Lab Number: ${response.payload.LABORATORYNO}`, 5);

      } else if (response.type === POST_LAB_APPOINTMENT_FAIL) {
        message.error(
          response.payload || "Failed to dispatch patient to laboratory"
        );
      }
    } catch (error) {
      message.error(
             error.payload.message || "Unexpected error during dispatch to laboratory"
           );
    }
  };

  return (
    <Button
      type="primary"
      loading={loadingPostLabAppointment}
      onClick={handleDispatch}
    >
      Dispatch to Laboratory
    </Button>
  );
};


export const DispatchToTriage = ({ activeVisitNo }) => {
  const dispatch = useDispatch();

  const { loading: postVisitLoading, success, error, data  } = useSelector(
      (state) => state.postTriageVisit
    );

  const handleDispatch = async () => {
    try {
         const payload={
        appointmentNo:activeVisitNo,
      }
      const response = await dispatch(postTriageVisit(payload));

      if (response.type === POST_TRIAGE_VISIT_SUCCESS) {
      message.success(`Patient has been dispatched to 
        Triage successfully!. Assigned Observation Number: ${response.payload.data.observationNo}`, 5);

      } else if (response.type === POST_TRIAGE_VISIT_FAIL) {
        message.error(
          response.payload || "Failed to dispatch patient to laboratory"
        );
      }
    } catch (error) {
      message.error(
             error.payload.message || "Unexpected error during dispatch to laboratory"
           );
    }
  };

  return (
    <Button
      type="primary"
      loading={postVisitLoading}
      onClick={handleDispatch}
    >
      Dispatch to Triage
    </Button>
  );
};
