import {
  REQUEST_INVOICE_LIST,
  REQUEST_INVOICE_LIST_SUCCESS,
  REQUEST_INVOICE_LIST_FAIL,
  REQUEST_INVOICE_LIST_RESET,
} from "../../actions/Charges-Actions/getInvoiceList";

const initialState = {
  loading: false,
  success: false,
  error: null,
  data: null,
};

export const getInvoiceReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_INVOICE_LIST:
      return { ...state, loading: true };
    case REQUEST_INVOICE_LIST_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case REQUEST_INVOICE_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };
    case REQUEST_INVOICE_LIST_RESET:
      return { ...initialState };
    default:
      return state;
  }
};
