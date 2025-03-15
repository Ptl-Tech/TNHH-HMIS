import {
  POST_DISCOUNT_REQUEST,
  POST_DISCOUNT_SUCCESS,
  POST_DISCOUNT_FAIL,
  POST_DISCOUNT_RESET,
} from "../../actions/Charges-Actions/postPatientDiscount";

export const postDiscountReducer = (state = { loading: false }, action) => {
  switch (action.type) {
    case POST_DISCOUNT_REQUEST:
      return { ...state, loading: true };
    case POST_DISCOUNT_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case POST_DISCOUNT_FAIL:
      return { ...state, loading: false, error: action.payload };
    case POST_DISCOUNT_RESET:
      return { loading: false };
    default:
      return state;
  }
};
