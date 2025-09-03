import {
  PRINT_INTERIM_INVOICE_REQUEST,
  PRINT_INTERIM_INVOICE_SUCCESS,
  PRINT_INTERIM_INVOICE_FAIL,
  PRINT_INTERIM_INVOICE_RESET,
  PRINT_SHA_INVOICE_REQUEST,
  PRINT_SHA_INVOICE_SUCCESS,
  PRINT_SHA_INVOICE_FAIL,
  PRINT_SHA_INVOICE_RESET,
} from "../../actions/Charges-Actions/printInterimInvoice";

export const postInterimInvoiceReducer = (
  state = { loading: false },
  action
) => {
  switch (action.type) {
    case PRINT_INTERIM_INVOICE_REQUEST:
      return { ...state, loading: true };
    case PRINT_INTERIM_INVOICE_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case PRINT_INTERIM_INVOICE_FAIL:
      return { ...state, loading: false, error: action.payload };
    case PRINT_INTERIM_INVOICE_RESET:
      return { loading: false };
    default:
      return state;
  }
};


export const postSHAInvoiceReducer = (
  state = { loading: false },
  action
) => {
  switch (action.type) {
    case PRINT_SHA_INVOICE_REQUEST:
      return { ...state, loading: true };
    case PRINT_SHA_INVOICE_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case PRINT_SHA_INVOICE_FAIL:
      return { ...state, loading: false, error: action.payload };
    case PRINT_SHA_INVOICE_RESET:
      return { loading: false };
    default:
      return state;
  }
};
