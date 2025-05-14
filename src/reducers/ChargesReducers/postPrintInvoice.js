import {
  PRINT_INVOICE_REQUEST,
  PRINT_INVOICE_SUCCESS,
  PRINT_INVOICE_FAIL,
  PRINT_INVOICE_RESET,
} from "../../actions/Charges-Actions/postprintInvoice";

const initialState = {
  loading: false,
  success: false,
  error: null,
  data: null,
};

export const postPrintInvoiceReducer = (state = initialState, action) => {
  switch (action.type) {
    case PRINT_INVOICE_REQUEST:
      return { ...state, loading: true };
    case PRINT_INVOICE_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case PRINT_INVOICE_FAIL:
      return { ...state, loading: false, error: action.payload };
    case PRINT_INVOICE_RESET:
      return { ...initialState };
    default:
      return state;
  }
};
