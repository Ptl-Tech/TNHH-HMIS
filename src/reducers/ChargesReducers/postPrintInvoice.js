import {
  PRINT_INVOICE_REQUEST,
  PRINT_INVOICE_SUCCESS,
  PRINT_INVOICE_FAIL,
  PRINT_INVOICE_RESET,
} from "../../actions/Charges-Actions/postprintInvoice";

export const postPrintInvoiceReducer = (
  state = { loading: false },
  action
) => {
  switch (action.type) {
    case PRINT_INVOICE_REQUEST:
      return { ...state, loading: true };
    case PRINT_INVOICE_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case PRINT_INVOICE_FAIL:
      return { ...state, loading: false, error: action.payload };
    case PRINT_INVOICE_RESET:
      return { loading: false };
    default:
      return state;
  }
};
