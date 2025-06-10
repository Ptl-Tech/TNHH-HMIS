import {
  POST_INITIATE_DISCHARGE_REQUEST,
  POST_INITIATE_DISCHARGE_SUCCESS,
  POST_INITIATE_DISCHARGE_FAILURE,
  POST_DISCHARGE_SUMMARY_REQUEST,
  POST_DISCHARGE_SUMMARY_SUCCESS,
  POST_DISCHARGE_SUMMARY_FAILURE,
  GET_DISCHARGE_SUMMARY_REQUEST,
  GET_DISCHARGE_SUMMARY_SUCCESS,
  GET_DISCHARGE_SUMMARY_FAILURE,
  POST_DISCHARGE_SUMMARY_RESET,
} from "../../actions/nurse-actions/postInitiateDischargeSlice";

const initialState = {
  loadingInitiateDischarge: false,
  postInitiateDischarge: [],
  error: "",
};

const initialStateDischarge = {
  loading: false,
  data: [],
  error: "",
};

export const postInitiateDischargeReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_INITIATE_DISCHARGE_REQUEST:
      return { ...state, loadingInitiateDischarge: true };
    case POST_INITIATE_DISCHARGE_SUCCESS:
      return {
        ...state,
        loadingInitiateDischarge: false,
        postInitiateDischarge: action.payload,
      };
    case POST_INITIATE_DISCHARGE_FAILURE:
      return {
        ...state,
        loadingInitiateDischarge: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const postDischargeSummaryReducer = (
  state = initialStateDischarge,
  action
) => {
  switch (action.type) {
    case POST_DISCHARGE_SUMMARY_REQUEST:
      return { ...state, loading: true };
    case POST_DISCHARGE_SUMMARY_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case POST_DISCHARGE_SUMMARY_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case POST_DISCHARGE_SUMMARY_RESET:
      return initialStateDischarge;
    default:
      return state;
  }
};

export const getQyDischargeSummaryReducer = (
  state = initialStateDischarge,
  action
) => {
  switch (action.type) {
    case GET_DISCHARGE_SUMMARY_REQUEST:
      return { ...state, loading: true };
    case GET_DISCHARGE_SUMMARY_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case GET_DISCHARGE_SUMMARY_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
