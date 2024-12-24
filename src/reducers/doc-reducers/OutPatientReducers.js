import { OUTPATIENT_LIST_FAIL, OUTPATIENT_LIST_REQUEST, OUTPATIENT_LIST_RESET, OUTPATIENT_LIST_SUCCESS } from "../../constants/doc-constants/outPatient";

export const treatmentListReducer = (state = { patients: [] }, action) => {
    switch (action.type) {
      case OUTPATIENT_LIST_REQUEST:
        return { loading: true, patients: [] };
      case OUTPATIENT_LIST_SUCCESS:
        return { loading: false, patients: action.payload };
      case OUTPATIENT_LIST_FAIL:
        return { loading: false, error: action.payload };
      case OUTPATIENT_LIST_RESET:
        return { patients: [] };
      default:
        return state;
    }
  }


  export const PatientDeetsReducer = (state = { patient: {}, loading: false, error: null }, action) => {
    switch (action.type) {
      case OUTPATIENT_LIST_REQUEST:
        return { ...state, loading: true };  // Keep previous state, just update loading
      case OUTPATIENT_LIST_SUCCESS:
        return { loading: false, patient: action.payload };  // Successfully fetched data
      case OUTPATIENT_LIST_FAIL:
        return { loading: false, error: action.payload };  // Handle failure
      case OUTPATIENT_LIST_RESET:
        return { patient: {}, loading: false, error: null };  // Reset state
      default:
        return state;  // Ensure default return
    }
  };
  