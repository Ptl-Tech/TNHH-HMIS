import {
  POST_REVERSE_CHARGES_FAIL,
  POST_REVERSE_CHARGES_REQUEST,
  POST_REVERSE_CHARGES_RESET,
  POST_REVERSE_CHARGES_SUCCESS,
} from "../../actions/Charges-Actions/postReverseCharges";

export const postReverseChargeReducer = (
  state = { loading: false },
  action
) => {
  switch (action.type) {
    case POST_REVERSE_CHARGES_REQUEST:
      return { ...state, loading: true };
    case POST_REVERSE_CHARGES_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case POST_REVERSE_CHARGES_FAIL:
      return { ...state, loading: false, error: action.payload };
    case POST_REVERSE_CHARGES_RESET:
      return { loading: false };
    default:
      return state;
  }
};
