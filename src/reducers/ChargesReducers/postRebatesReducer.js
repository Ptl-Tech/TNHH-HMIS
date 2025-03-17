import {
  POST_REBATES_FAIL,
  POST_REBATES_REQUEST,
  POST_REBATES_RESET,
  POST_REBATES_SUCCESS,
} from "../../actions/Charges-Actions/postRebates";

export const postRebatesReducer = (state = { loading: false }, action) => {
  switch (action.type) {
    case POST_REBATES_REQUEST:
      return { ...state, loading: true };
    case POST_REBATES_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case POST_REBATES_FAIL:
      return { ...state, loading: false, error: action.payload };
    case POST_REBATES_RESET:
      return { loading: false };
    default:
      return state;
  }
};
