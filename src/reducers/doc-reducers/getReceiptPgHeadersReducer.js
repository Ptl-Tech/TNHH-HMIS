import {
  GET_RECEIPT_HEADERS_REQUEST,
  GET_RECEIPT_HEADERS_SUCCESS,
  GET_RECEIPT_HEADERS_FAIL,
  GET_RECEIPT_HEADERS_RESET,
} from "../../actions/Doc-actions/getReceiptPgHeaders";

export const getReceiptPgHeadersReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case GET_RECEIPT_HEADERS_REQUEST:
      return { loading: true, data: [] };
    case GET_RECEIPT_HEADERS_SUCCESS:
      return { loading: false, data: action.payload };
    case GET_RECEIPT_HEADERS_FAIL:
      return { loading: false, error: action.payload };
    case GET_RECEIPT_HEADERS_RESET:
      return { loading: false };
    default:
      return state;
  }
};
