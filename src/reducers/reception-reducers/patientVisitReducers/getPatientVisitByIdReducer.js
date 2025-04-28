import {
  GET_PATIENT_VISIT_BY_NO_REQUEST,
  GET_PATIENT_VISIT_BY_NO_SUCCESS,
  GET_PATIENT_VISIT_BY_NO_FAIL,
  GET_PATIENT_VISIT_BY_NO_RESET,
} from "../../../actions/reception-actions/patient-visit-actions/getPatientVisitByNo";

const initialState = {
  loading: false,
  success: false,
  error: false,
  data: null,
};

export const getPatientVisitByIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PATIENT_VISIT_BY_NO_REQUEST:
      return { ...state, loading: true, success: false, error: null };
    case GET_PATIENT_VISIT_BY_NO_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case GET_PATIENT_VISIT_BY_NO_FAIL:
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload,
      };
    case GET_PATIENT_VISIT_BY_NO_RESET:
      return initialState;
    default:
      return state;
  }
};
