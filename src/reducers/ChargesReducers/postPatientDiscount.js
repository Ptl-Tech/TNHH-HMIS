import {
  POST_DISCOUNT_REQUEST,
  POST_DISCOUNT_SUCCESS,
  POST_DISCOUNT_FAIL,
  POST_DISCOUNT_RESET,
} from "../../actions/Charges-Actions/postPatientDiscount";

const initialState = {
  loading: false,
  success: false,
  error: null,
  data: null,
};

export const postDiscountReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_DISCOUNT_REQUEST:
      return { ...state, loading: true };
    case POST_DISCOUNT_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case POST_DISCOUNT_FAIL:
      return { ...state, loading: false, error: action.payload };
    case POST_DISCOUNT_RESET:
      return { ...initialState }; 
    default:
      return state;
  }
};
