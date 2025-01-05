import {
  TREATMENT_LIST_REQUEST,
  TREATMENT_LIST_SUCCESS,
  TREATMENT_LIST_FAIL,
  TREATMENT_LIST_RESET,
  GET_PATIENT_DETAILS_REQUEST,
  GET_PATIENT_DETAILS_SUCCESS,
  GET_PATIENT_DETAILS_FAILURE,
  GET_PATIENT_DETAILS_RESET,
} from "../../actions/Doc-actions/OutPatientAction";

export const treatmentListReducer = (state = { patients: [] }, action) => {
  switch (action.type) {
    case TREATMENT_LIST_REQUEST:
      return { loading: true, patients: [] };
    case TREATMENT_LIST_SUCCESS:
      return { loading: false, patients: action.payload };
    case TREATMENT_LIST_FAIL:
      return { loading: false, error: action.payload };
    case TREATMENT_LIST_RESET:
      return { patients: [] };
    default:
      return state;
  }
};

export const PatientDeetsReducer = (
  state = { patient: {}, loading: false, error: null },
  action
) => {
  switch (action.type) {
    case GET_PATIENT_DETAILS_REQUEST:
      return { ...state, loading: true }; // Keep previous state, just update loading
    case GET_PATIENT_DETAILS_SUCCESS:
      return { loading: false, patient: action.payload }; // Successfully fetched data
    case GET_PATIENT_DETAILS_FAILURE:
      return { loading: false, error: action.payload }; // Handle failure
    case GET_PATIENT_DETAILS_RESET:
      return { patient: {}, loading: false, error: null }; // Reset state
    default:
      return state; // Ensure default return
  }
};
