import {
  GET_DISCHARGE_LIST_REQUEST,
  GET_DISCHARGE_LIST_SUCCESS,
  GET_DISCHARGE_LIST_FAILURE,
  GET_DISCHARGE_LIST_RESET,
  GET_DISCHARGE_REQUEST_LIST,
  GET_DISCHARGE_REQUEST_LIST_SUCCESS,
  GET_DISCHARGE_REQUEST_LIST_FAILURE,
  GET_DISCHARGE_REQUEST_LIST_RESET,
} from "../../../actions/Doc-actions/Admission/getdischargeList";

export const getDischargeListReducer = (state = { loading: false }, action) => {
  switch (action.type) {
    case GET_DISCHARGE_LIST_REQUEST:
      return { ...state, loading: true };
    case GET_DISCHARGE_LIST_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case GET_DISCHARGE_LIST_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case GET_DISCHARGE_LIST_RESET:
      return { loading: false };
    default:
      return state;
  }
};

export const getDischargeRequestListReducer = (
  state = { loading: false },
  action
) => {
  switch (action.type) {
    case GET_DISCHARGE_REQUEST_LIST:
      return { ...state, loading: true };
    case GET_DISCHARGE_REQUEST_LIST_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case GET_DISCHARGE_REQUEST_LIST_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case GET_DISCHARGE_REQUEST_LIST_RESET:
      return { loading: false };
    default:
      return state;
  }
};
