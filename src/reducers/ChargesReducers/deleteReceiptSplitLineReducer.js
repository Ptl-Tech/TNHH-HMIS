import { DELETE_RECEIPT_SPLIT_LINE_REQUEST, 
    DELETE_RECEIPT_SPLIT_LINE_SUCCESS, 
    DELETE_RECEIPT_SPLIT_LINE_FAIL, 
    DELETE_RECEIPT_SPLIT_LINE_RESET
 } from "../../actions/Charges-Actions/deleteSplitLine";



export const deleteReceiptSplitLineReducer = (
  state = { loading: false },
  action
) => {
  switch (action.type) {
    case DELETE_RECEIPT_SPLIT_LINE_REQUEST:
      return { ...state, loading: true };
    case DELETE_RECEIPT_SPLIT_LINE_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case DELETE_RECEIPT_SPLIT_LINE_FAIL:
      return { ...state, loading: false, error: action.payload };
    case DELETE_RECEIPT_SPLIT_LINE_RESET:
      return { loading: false };
    default:
      return state;
  }
};
