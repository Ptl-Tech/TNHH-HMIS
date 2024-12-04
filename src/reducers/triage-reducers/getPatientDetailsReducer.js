
import {
  GET_PATIENT_DETAILS_REQUEST,
  GET_PATIENT_DETAILS_SUCCESS,
  GET_PATIENT_DETAILS_FAILURE,
} from "../../actions/triage-actions/getPatientDetailsSlice";

const initialState = {
  loadingPatientDetails: false,
  patientDetails: [],
  error: null,
};

export const getPatientDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PATIENT_DETAILS_REQUEST:
      return { loadingPatientDetails: true };
    case GET_PATIENT_DETAILS_SUCCESS:
      return { loadingPatientDetails: false, patientDetails: action.payload };
    case GET_PATIENT_DETAILS_FAILURE:
      return { loadingPatientDetails: false, error: action.payload };
    default:
      return state;
  }
};