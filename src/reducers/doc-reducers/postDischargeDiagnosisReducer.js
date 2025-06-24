import {
  POST_DISCHARGE_DIAGNOSIS_FAIL,
  POST_DISCHARGE_DIAGNOSIS_REQUEST,
  POST_DISCHARGE_DIAGNOSIS_RESET,
  POST_DISCHARGE_DIAGNOSIS_SUCCESS,
} from "../../actions/Doc-actions/postDischargeDiagnosis";

const initialState = {
  data: null,
  error: null,
  loading: false,
};

export const postDischargeDiagnosisReducer = (state = initialState, action) => {
  var returnValue;

  switch (action.type) {
    case POST_DISCHARGE_DIAGNOSIS_REQUEST:
      returnValue = { ...state, loading: true };
      break;
    case POST_DISCHARGE_DIAGNOSIS_SUCCESS:
      returnValue = {
        ...state,
        loading: false,
        success: true,
        data: action.payload,
      };
      break;
    case POST_DISCHARGE_DIAGNOSIS_FAIL:
      returnValue = { ...state, loading: false, error: action.payload };
      break;
    case POST_DISCHARGE_DIAGNOSIS_RESET:
      returnValue = initialState;
      break;
    default:
      returnValue = state;
      break;
  }
  return returnValue;
};
