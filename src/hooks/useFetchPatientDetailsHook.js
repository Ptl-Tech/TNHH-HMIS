import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPatientByNo } from "../actions/patientActions";

const useFetchPatientDetailsHook = (patientNo) => {
  const dispatch = useDispatch();

  console.log('patientNo from the hooks', patientNo);

  const { loading:loadingPatientDetails, patients:patientDetails } = useSelector((state) => state.patientList) || {};

  useEffect(() => {
    dispatch(getPatientByNo(patientNo))
  }, [dispatch, patientNo]);

  return { loadingPatientDetails, patientDetails };
}

export default useFetchPatientDetailsHook