import {
  REQUEST_RECEIPTS_LIST,
  REQUEST_RECEIPTS_LIST_SUCCESS,
  REQUEST_RECEIPT_LIST_FAIL,
  REQUEST_RECEIPTS_LIST_RESET,
} from "../../actions/Charges-Actions/getReceipts";

const initialState = {
  loading: false,
  success: false,
  error: null,
  data: null,
};

export const getReceiptsReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_RECEIPTS_LIST:
      return { ...state, loading: true };
    case REQUEST_RECEIPTS_LIST_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case REQUEST_RECEIPT_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };
    case REQUEST_RECEIPTS_LIST_RESET:
      return { ...initialState };
    default:
      return state;
  }
};
