import {
  REQUEST_RECEIPT_PAGE,
  REQUEST_RECEIPT_PAGE_SUCCESS,
  REQUEST_RECEIPT_PAGE_FAIL,
  REQUEST_RECEIPT_PAGE_RESET,
} from "../../actions/Charges-Actions/getReceiptPage";


export const getReceiptPageReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case REQUEST_RECEIPT_PAGE:
      return { loading: true, data: [] };
    case REQUEST_RECEIPT_PAGE_SUCCESS:
      return { loading: false, data: action.payload };
    case REQUEST_RECEIPT_PAGE_FAIL:
      return { loading: false, error: action.payload, data: [] };
    case REQUEST_RECEIPT_PAGE_RESET:
      return { loading: false, data: [], error: null }; // ✅ Reset data & error
    default:
      return state;
  }
};
