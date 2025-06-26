import {
  REQUEST_SINGLE_LAB_DETAILS,
  REQUEST_SINGLE_LAB_DETAILS_FAIL,
  REQUEST_SINGLE_LAB_DETAILS_RESET,
  REQUEST_SINGLE_LAB_DETAILS_SUCCESS,
} from "../../actions/Doc-actions/getSingleLabRequestDetails";

const initialState = {
  data: null,
  error: null,
  loading: false,
};

export const getSingleLabDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_SINGLE_LAB_DETAILS:
      return { ...state, loading: true };
    case REQUEST_SINGLE_LAB_DETAILS_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case REQUEST_SINGLE_LAB_DETAILS_FAIL:
      return { ...state, loading: false, error: action.payload };
    case REQUEST_SINGLE_LAB_DETAILS_RESET:
      return initialState;
    default:
      return state;
  }
};
