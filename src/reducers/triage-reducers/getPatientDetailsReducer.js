
import {
  GET_PATIENT_DETAILS_REQUEST,
  GET_PATIENT_DETAILS_SUCCESS,
  GET_PATIENT_DETAILS_FAILURE,
} from "../../actions/triage-actions/getPatientDetailsSlice";

const initialState = {
  loading: false,
  patientDetails: [],
  error: null,
};

export const getPatientDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PATIENT_DETAILS_REQUEST:
      return { loading: true };
    case GET_PATIENT_DETAILS_SUCCESS:
      return { loading: false, patientDetails: action.payload };
    case GET_PATIENT_DETAILS_FAILURE:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};