import {
  POST_RECEIPT_SPLIT_LINE_FAIL,
  POST_RECEIPT_SPLIT_LINE_REQUEST,
  POST_RECEIPT_SPLIT_LINE_RESET,
  POST_RECEIPT_SPLIT_LINE_SUCCESS,
} from "../../actions/Charges-Actions/postReceiptSplitLine";


export const postReceiptSplitLineReducer = (
  state = { loading: false },
  action
) => {
  switch (action.type) {
    case POST_RECEIPT_SPLIT_LINE_REQUEST:
      return { ...state, loading: true };
    case POST_RECEIPT_SPLIT_LINE_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case POST_RECEIPT_SPLIT_LINE_FAIL:
      return { ...state, loading: false, error: action.payload };
    case POST_RECEIPT_SPLIT_LINE_RESET:
      return { loading: false };
    default:
      return state;
  }
};
