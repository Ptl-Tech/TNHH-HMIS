import {
  REQUEST_RECEIPT_LINES_RESET,
  REQUEST_RECEIPT_LINES,
  REQUEST_RECEIPT_LINES_SUCCESS,
  REQUEST_RECEIPT_LINES_FAIL,
} from "../../actions/Charges-Actions/getReceiptLines";

export const getReceiptLinesReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case REQUEST_RECEIPT_LINES:
      return { loading: true, data: [] };
    case REQUEST_RECEIPT_LINES_SUCCESS:
      return { loading: false, data: action.payload };
    case REQUEST_RECEIPT_LINES_FAIL:
      return { loading: false, error: action.payload };
    case REQUEST_RECEIPT_LINES_RESET:
      return { loading: false };
    default:
      return state;
  }
};
