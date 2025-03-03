import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTriageList } from "../actions/triage-actions/getTriageListSlice";
import { getInpatientAllergiesSlice } from "../actions/nurse-actions/getInpatientAllergiesSlice";

const useFetchAllergiesAndMedicationsHook = (refreshTable) => {
    const dispatch = useDispatch();

    // Fetch data from Redux store
    const { loadingAllergies, allergies } = useSelector((state) => state.getInpatientAllergies);
    const { loadingTriageList, triageList } = useSelector((state) => state.getTriageList);
  
    // Format the triage list
    const formattedTriageList = triageList?.map((item) => ({
      PatientNo: item.PatientNo,
      ObservationNo: item.ObservationNo,
    }));
  
    // Combine lists
    const combinedList = allergies?.map((allergy) => {
      const triageItem = formattedTriageList?.find((item) => item.ObservationNo === allergy.ObservationNo);
      return {
        ...allergy,
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
      if (!allergies?.length) {
        dispatch(getInpatientAllergiesSlice());
      }
    }, [dispatch, allergies?.length]);
  
useEffect(() => {
  dispatch(getTriageList());
  dispatch(getInpatientAllergiesSlice());
}, [dispatch, refreshTable]);

    // Return the combined list and loading states
    return {
      combinedList,
      loadingAllergies,
      loadingTriageList,
    };
}

export default useFetchAllergiesAndMedicationsHook