import {
  POST_RECEIPT_HEADER_FAIL,
  POST_RECEIPT_HEADER_REQUEST,
  POST_RECEIPT_HEADER_RESET,
  POST_RECEIPT_HEADER_SUCCESS,
} from "../../actions/Charges-Actions/postReceiptHeader";

export const savePaymentReducer = (
  state = { loading: false },
  action
) => {
  switch (action.type) {
    case POST_RECEIPT_HEADER_REQUEST:
      return { ...state, loading: true };
    case POST_RECEIPT_HEADER_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case POST_RECEIPT_HEADER_FAIL:
      return { ...state, loading: false, error: action.payload };
    case POST_RECEIPT_HEADER_RESET:
      return { loading: false };
    default:
      return state;
  }
};
