import {
  POST_GENERATE_INVOICE_FAIL,
  POST_GENERATE_INVOICE_REQUEST,
  POST_GENERATE_INVOICE_RESET,
  POST_GENERATE_INVOICE_SUCCESS,
} from "../../actions/Charges-Actions/postGenerateInvoice";

const initialState = {
  loading: false,
  success: false,
  error: null,
  data: null,
};

export const postGenerateInvoiceReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_GENERATE_INVOICE_REQUEST:
      return { ...state, loading: true };
    case POST_GENERATE_INVOICE_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case POST_GENERATE_INVOICE_FAIL:
      return { ...state, loading: false, error: action.payload };
    case POST_GENERATE_INVOICE_RESET:
      return { ...initialState }; // Resets all fields to default
    default:
      return state;
  }
};
