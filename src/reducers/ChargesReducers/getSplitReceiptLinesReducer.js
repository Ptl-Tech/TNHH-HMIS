import {
  REQUEST_SPLIT_LINES,
  REQUEST_SPLIT_LINES_FAIL,
  REQUEST_SPLIT_LINES_RESET,
  REQUEST_SPLIT_LINES_SUCCESS,
} from "../../actions/Charges-Actions/getSplitReceiptLines";

export const getSplitReceiptLinesReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case REQUEST_SPLIT_LINES:
      return { loading: true, data: [] };
    case REQUEST_SPLIT_LINES_SUCCESS:
      return { loading: false, data: action.payload };
    case REQUEST_SPLIT_LINES_FAIL:
      return { loading: false, error: action.payload };
    case REQUEST_SPLIT_LINES_RESET:
      return { loading: false };
    default:
      return state;
  }
};
