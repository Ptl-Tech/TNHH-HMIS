import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPatientVisitByNo } from "../actions/reception-actions/patient-visit-actions/getPatientVisitByNo";

const useFetchPatientVisitDetailsHook = (appmntId) => {
  const dispatch = useDispatch();

  // Select the visit details from Redux
  const { loading, error, data: patientVisitDetails } = 
    useSelector((state) => state.getVisitById) || {};

  useEffect(() => {
    if (!appmntId) return; // Avoid unnecessary API calls

    // Only fetch if the data isn't already in Redux
    if (!patientVisitDetails || patientVisitDetails?.AppointmentNo !== appmntId) {
      dispatch(getPatientVisitByNo(appmntId));
    }
  }, [dispatch, appmntId, patientVisitDetails]);

  return { loading, error, patientVisitDetails };
};

export default useFetchPatientVisitDetailsHook;
