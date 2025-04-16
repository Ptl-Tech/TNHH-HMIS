import {
  POST_RECEIPT_FAIL,
  POST_RECEIPT_REQUEST,
  POST_RECEIPT_RESET,
  POST_RECEIPT_SUCCESS,
} from "../../actions/Charges-Actions/postReceipt";

export const postReceiptHeaderReducer = (state = { loading: false }, action) => {
  switch (action.type) {
    case POST_RECEIPT_REQUEST:
      return { ...state, loading: true };
    case POST_RECEIPT_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case POST_RECEIPT_FAIL:
      return { ...state, loading: false, error: action.payload };
    case POST_RECEIPT_RESET:
      return { loading: false };
    default:
      return state;
  }
};
