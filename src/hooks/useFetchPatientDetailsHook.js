import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPatientDetails } from "../actions/Doc-actions/OutPatientAction";

const useFetchPatientDetailsHook = (patientNo) => {
  const dispatch = useDispatch();

  const { loading, data } = useSelector((state) => state.getPatientDetails) || {};

  useEffect(() => {
    dispatch(getPatientDetails(patientNo))
  }, [dispatch, patientNo]);

  return { loading, data };
}

export default useFetchPatientDetailsHook