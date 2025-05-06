import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPatientByNo } from "../actions/patientActions";
import { use } from "react";

const useFetchPatientDetailsHook = (patientNo) => {
  const dispatch = useDispatch();
  
//refetch patient details 
const fetchDetails=()=>{
  if (!patientNo) return; 
  dispatch(getPatientByNo(patientNo));
};

useEffect(() => {
  if (!patientNo) return;
  fetchDetails();
}, [dispatch, patientNo]);

  const { loading: loadingPatientDetails, patients: patientDetails } = 
    useSelector((state) => state.patientList) || {};

  useEffect(() => {
    if (!patientNo) return; 
    dispatch(getPatientByNo(patientNo));
  }, [dispatch, patientNo]);

  return { loadingPatientDetails, patientDetails, refetchDetails:fetchDetails };
};

export default useFetchPatientDetailsHook;
