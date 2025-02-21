import {
  POST_SALES_INVOICE_FAIL,
  POST_SALES_INVOICE_REQUEST,
  POST_SALES_INVOICE_RESET,
  POST_SALES_INVOICE_SUCCESS,
} from "../../actions/Charges-Actions/postSalesInvoice";

export const postsalesInvoiceReducer = (state = { loading: false }, action) => {
  switch (action.type) {
    case POST_SALES_INVOICE_REQUEST:
      return { ...state, loading: true };
    case POST_SALES_INVOICE_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case POST_SALES_INVOICE_FAIL:
      return { ...state, loading: false, error: action.payload };
    case POST_SALES_INVOICE_RESET:
      return { loading: false };
    default:
      return state;
  }
};
