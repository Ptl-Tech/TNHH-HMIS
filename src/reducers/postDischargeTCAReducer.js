import {
  POST_DISCHARGE_TCA_FAIL,
  POST_DISCHARGE_TCA_REQUEST,
  POST_DISCHARGE_TCA_RESET,
  POST_DISCHARGE_TCA_SUCCESS,
} from "../actions/Doc-actions/postDischargeTCA";

const initialState = {
  data: null,
  error: null,
  loading: false,
};

export const postDischargeTCAReducer = (state = initialState, action) => {
  var returnValue;

  switch (action.type) {
    case POST_DISCHARGE_TCA_REQUEST:
      returnValue = { ...state, loading: true };
      break;
    case POST_DISCHARGE_TCA_FAIL:
      returnValue = { ...state, loading: false, error: action.payload };
      break;
    case POST_DISCHARGE_TCA_SUCCESS:
      returnValue = { ...state, loading: false, data: action.payload };
      break;
    case POST_DISCHARGE_TCA_RESET:
      returnValue = initialState;
      break;
    default:
      returnValue = state;
      break;
  }

  return returnValue;
};
