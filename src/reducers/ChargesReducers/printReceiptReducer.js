import { PRINT_RECEIPT_FAIL, PRINT_RECEIPT_REQUEST, PRINT_RECEIPT_RESET, PRINT_RECEIPT_SUCCESS } from "../../actions/Charges-Actions/printReceipt";


export const printReceiptReducer = (
  state = { loading: false },
  action
) => {
  switch (action.type) {
    case PRINT_RECEIPT_REQUEST:
      return { ...state, loading: true };
    case PRINT_RECEIPT_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case PRINT_RECEIPT_FAIL:
      return { ...state, loading: false, error: action.payload };
    case PRINT_RECEIPT_RESET:
      return { loading: false };
    default:
      return state;
  }
};
