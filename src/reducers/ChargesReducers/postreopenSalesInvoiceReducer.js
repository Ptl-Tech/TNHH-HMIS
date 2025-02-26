import {
  REOPEN_SALES_INVOICE_FAIL,
  REOPEN_SALES_INVOICE_REQUEST,
  REOPEN_SALES_INVOICE_RESET,
  REOPEN_SALES_INVOICE_SUCCESS,
} from "../../actions/Charges-Actions/postReopenInvoice";

export const reopensalesInvoiceReducer = (
  state = { loading: false },
  action
) => {
  switch (action.type) {
    case REOPEN_SALES_INVOICE_REQUEST:
      return { ...state, loading: true };
    case REOPEN_SALES_INVOICE_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case REOPEN_SALES_INVOICE_FAIL:
      return { ...state, loading: false, error: action.payload };
    case REOPEN_SALES_INVOICE_RESET:
      return { loading: false };
    default:
      return state;
  }
};
