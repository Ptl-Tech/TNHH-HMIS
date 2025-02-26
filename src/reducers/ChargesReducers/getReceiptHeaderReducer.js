import {
  REQUEST_RECEIPT_HEADER,
  REQUEST_RECEIPT_HEADER_SUCCESS,
  REQUEST_RECEIPT_HEADER_FAIL,
  REQUEST_RECEIPT_HEADER_RESET,
} from "../../actions/Charges-Actions/getReceiptHeader";

export const getReceiptHeaderReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case REQUEST_RECEIPT_HEADER:
      return { loading: true, data: [] };
    case REQUEST_RECEIPT_HEADER_SUCCESS:
      return { loading: false, data: action.payload };
    case REQUEST_RECEIPT_HEADER_FAIL:
      return { loading: false, error: action.payload, data: [] };
    case REQUEST_RECEIPT_HEADER_RESET:
      return { loading: false, data: [], error: null }; // ✅ Reset data & error
    default:
      return state;
  }
};
