import {
  FORWARD_RADIOLOGY_RESULTS_FAIL,
  FORWARD_RADIOLOGY_RESULTS_REQUEST,
  FORWARD_RADIOLOGY_RESULTS_RESET,
  FORWARD_RADIOLOGY_RESULTS_SUCCESS,
  GET_RADIOLOGY_DETAILS_FAIL,
  GET_RADIOLOGY_DETAILS_REQUEST,
  GET_RADIOLOGY_DETAILS_SUCCESS,
  POST_RADIOLOGY_RESULTS_FAIL,
  POST_RADIOLOGY_RESULTS_REQUEST,
  POST_RADIOLOGY_RESULTS_RESET,
  POST_RADIOLOGY_RESULTS_SUCCESS,
} from "../../actions/radiology-actions/radiologyActions";

export const postRadiologyResultsReducer = (
  state = { loading: false },
  action
) => {
  switch (action.type) {
    case POST_RADIOLOGY_RESULTS_REQUEST:
      return { ...state, loading: true };
    case POST_RADIOLOGY_RESULTS_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case POST_RADIOLOGY_RESULTS_FAIL:
      return { ...state, loading: false, error: action.payload };
    case POST_RADIOLOGY_RESULTS_RESET:
      return { loading: false };
    default:
      return state;
  }
};
export const forwardRadiologyResultsReducer = (
  state = { loading: false },
  action
) => {
  switch (action.type) {
    case FORWARD_RADIOLOGY_RESULTS_REQUEST:
      return { ...state, loading: true };
    case FORWARD_RADIOLOGY_RESULTS_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case FORWARD_RADIOLOGY_RESULTS_FAIL:
      return { ...state, loading: false, error: action.payload };
    case FORWARD_RADIOLOGY_RESULTS_RESET:
      return { loading: false };
    default:
      return state;
  }
};

const initialState = {
  loading: false,
  radiologyDetails: null,
  error: null,
};
export const getSingleRadiologyDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_RADIOLOGY_DETAILS_REQUEST:
      return { loading: true };
    case GET_RADIOLOGY_DETAILS_SUCCESS:
      return { loading: false, radiologyDetails: action.payload };
    case GET_RADIOLOGY_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
