import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTriageList } from "../actions/triage-actions/getTriageListSlice";
import { getInpatientVitalsSlice } from "../actions/nurse-actions/getInpatientVitalsSlice";

const useFetchVitalsHook = () => {
    const dispatch = useDispatch();

    // Fetch data from Redux store
    const { loadingInpatientVitals, inpatientVitals } = useSelector((state) => state.getInpatientVitals);
    const { loadingTriageList, triageList } = useSelector((state) => state.getTriageList);
  
    // Format the triage list
    const formattedTriageList = triageList?.map((item) => ({
      PatientNo: item.PatientNo,
      ObservationNo: item.ObservationNo,
    }));
  
    // Combine lists
    const combinedList = inpatientVitals?.map((vitals) => {
      const triageItem = formattedTriageList?.find((item) => item.ObservationNo === vitals.ObservationNo);
      return {
        ...vitals,
        ObservationNo: triageItem?.ObservationNo || null,
        PatientNo: triageItem?.PatientNo || null,
      };
    });
  
    // Fetch triage list if not already loaded
    useEffect(() => {
      if (!triageList?.length) {
        dispatch(getTriageList());
      }
    }, [dispatch, triageList?.length]);
  
    // Fetch allergies list if not already loaded
    useEffect(() => {
      if (!inpatientVitals?.length) {
        dispatch(getInpatientVitalsSlice());
      }
    }, [dispatch, inpatientVitals?.length]);
  
    // Return the combined list and loading states
    return {
      combinedList,
      loadingInpatientVitals,
      loadingTriageList,
      inpatientVitals,
      triageList
    };
}

export default useFetchVitalsHook