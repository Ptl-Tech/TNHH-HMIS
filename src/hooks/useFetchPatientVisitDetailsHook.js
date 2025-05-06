import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPatientVisitByNo } from "../actions/reception-actions/patient-visit-actions/getPatientVisitByNo";
import useFetchPatientDetailsHook from "./useFetchPatientDetailsHook";
import { useLocation } from "react-router-dom";

const useFetchPatientVisitDetailsHook = (appmntId) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const patientNo = new URLSearchParams(location.search).get("PatientNo");
 const { loadingPatientDetails, patientDetails } =
    useFetchPatientDetailsHook(patientNo);

    const [visitNo, setVisitNo] = React.useState(appmntId || null);
    //check if current visit is same as the one with patient details and set visitNo
    React.useEffect(() => {
      if (patientDetails && patientDetails.ActiveVisitNo) {
        setVisitNo(patientDetails.ActiveVisitNo);
      }else {
        setVisitNo(null);
      }
    }, [patientDetails]);

  // Select the visit details from Redux
  const { loading, error, data: patientVisitDetails } = 
    useSelector((state) => state.getVisitById);

  useEffect(() => {
    if (!visitNo) return; // Avoid unnecessary API calls

    dispatch(getPatientVisitByNo(visitNo));   
  }, [dispatch, visitNo]);

  return { loading, error, patientVisitDetails };
};

export default useFetchPatientVisitDetailsHook;
