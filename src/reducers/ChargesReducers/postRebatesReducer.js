import {
  POST_REBATES_FAIL,
  POST_REBATES_REQUEST,
  POST_REBATES_RESET,
  POST_REBATES_SUCCESS,
} from "../../actions/Charges-Actions/postRebates";

const initialState = {
  loading: false,
  success: false,
  error: null,
  data: null,
};

export const postRebatesReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_REBATES_REQUEST:
      return { ...state, loading: true };
    case POST_REBATES_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case POST_REBATES_FAIL:
      return { ...state, loading: false, error: action.payload };
    case POST_REBATES_RESET:
      return { ...initialState }; 
    default:
      return state;
  }
};
