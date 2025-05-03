import {
  POST_INITIATE_PATIENT_DISCHARGE,
  POST_INITIATE_PATIENT_DISCHARGE_SUCCESS,
  POST_INITIATE_PATIENT_DISCHARGE_FAIL,
  POST_INITIATE_PATIENT_DISCHARGE_RESET,
  POST_INPATIENT_DISCHARGE,
  POST_INPATIENT_DISCHARGE_SUCCESS,
  POST_INPATIENT_DISCHARGE_FAIL,
  POST_INPATIENT_DISCHARGE_RESET,
  POST_PATIENT_SICK_OFF,
  POST_PATIENT_SICK_OFF_SUCCESS,
  POST_PATIENT_SICK_OFF_FAIL,
  POST_PATIENT_SICK_OFF_RESET,
  GET_PATIENT_SICK_OFF,
  GET_PATIENT_SICK_OFF_SUCCESS,
  GET_PATIENT_SICK_OFF_FAIL,
  GET_PATIENT_SICK_OFF_RESET,
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

export const postSickOffReducer = (
  state = { loading: false },
  action
) => {
  switch (action.type) {
    case POST_PATIENT_SICK_OFF:
      return { ...state, loading: true };
    case POST_PATIENT_SICK_OFF_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case POST_PATIENT_SICK_OFF_FAIL:
      return { ...state, loading: false, error: action.payload };
    case POST_PATIENT_SICK_OFF_RESET:
      return { loading: false };
    default:
      return state;
  }
};

export const getSickOffReducer = (
  state = { loading: false },
  action
) => {
  switch (action.type) {
    case GET_PATIENT_SICK_OFF:
      return { ...state, loading: true };
    case GET_PATIENT_SICK_OFF_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case GET_PATIENT_SICK_OFF_FAIL:
      return { ...state, loading: false, error: action.payload };
    case GET_PATIENT_SICK_OFF_RESET:
      return { loading: false };
    default:
      return state;
  }
};