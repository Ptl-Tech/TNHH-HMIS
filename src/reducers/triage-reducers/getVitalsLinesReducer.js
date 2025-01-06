import {
    GET_PATIENT_VITALS_LINES_REQUEST,
    GET_VITAL_LINES_FAILURE,
    GET_VITAL_LINES_REQUEST,
    GET_VITAL_LINES_SUCCESS,
    GET_PATIENT_VITALS_LINES_SUCCESS,
    GET_PATIENT_VITALS_LINES_FAILURE,
    GET_PATIENT_VITALS_LINES_RESET,
} from "../../actions/triage-actions/getVitalsLinesSlice";

const initialState = {
    loadingVitalsLines: false,
    vitalsLines: [],
    error: '',
};

export const getVitalsLinesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_VITAL_LINES_REQUEST:
            return { ...state, loadingVitalsLines: true };
        case GET_VITAL_LINES_SUCCESS:
            return { ...state, loadingVitalsLines: false, vitalsLines: action.payload };
        case GET_VITAL_LINES_FAILURE:
            return { ...state, loadingVitalsLines: false, vitalsLines: action.payload };
        default:
            return state;
    }
};

export const getPatientVitalsLinesReducer = (state = { vitals: [] }, action) => {
  switch (action.type) {
    case GET_PATIENT_VITALS_LINES_REQUEST:
      return { loading: true, vitals: [] };
    case GET_PATIENT_VITALS_LINES_SUCCESS:
      return { loading: false, vitals: action.payload };
    case GET_PATIENT_VITALS_LINES_FAILURE:
      return { loading: false, error: action.payload };
    case GET_PATIENT_VITALS_LINES_RESET:
      return { vitals: [] };
    default:
      return state;
  }
}
