import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInpatientVitalsSlice } from "../actions/nurse-actions/getInpatientVitalsSlice";

const useFetchVitalsHook = () => {
    const dispatch = useDispatch();

    // Fetch data from Redux store
    const { loadingInpatientVitals, inpatientVitals } = useSelector((state) => state.getInpatientVitals);
  
  
    // Fetch allergies list if not already loaded
    useEffect(() => {
        dispatch(getInpatientVitalsSlice());
    }, [dispatch]);
  
    // Return the combined list and loading states
    return {
   
      loadingInpatientVitals,
      inpatientVitals,
    };
}

export default useFetchVitalsHook