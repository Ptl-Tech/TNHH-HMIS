import {
  POST_INITIATE_PATIENT_DISCHARGE,
  POST_INITIATE_PATIENT_DISCHARGE_SUCCESS,
  POST_INITIATE_PATIENT_DISCHARGE_FAIL,
  POST_INITIATE_PATIENT_DISCHARGE_RESET,
  POST_INPATIENT_DISCHARGE,
  POST_INPATIENT_DISCHARGE_SUCCESS,
  POST_INPATIENT_DISCHARGE_FAIL,
  POST_INPATIENT_DISCHARGE_RESET,
} from "../../../actions/Doc-actions/Admission/postInitiateDischarge";

export const postInitiateInpatientDischargeReducer = (
  state = { loading: false },
  action
) => {
  switch (action.type) {
    case POST_INITIATE_PATIENT_DISCHARGE:
      return { ...state, loading: true };
    case POST_INITIATE_PATIENT_DISCHARGE_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case POST_INITIATE_PATIENT_DISCHARGE_FAIL:
      return { ...state, loading: false, error: action.payload };
    case POST_INITIATE_PATIENT_DISCHARGE_RESET:
      return { loading: false };
    default:
      return state;
  }
};

export const postInpatientDischargeReducer = (
  state = { loading: false },
  action
) => {
  switch (action.type) {
    case POST_INPATIENT_DISCHARGE:
      return { ...state, loading: true };
    case POST_INPATIENT_DISCHARGE_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case POST_INPATIENT_DISCHARGE_FAIL:
      return { ...state, loading: false, error: action.payload };
    case POST_INPATIENT_DISCHARGE_RESET:
      return { loading: false };
    default:
      return state;
  }
};
