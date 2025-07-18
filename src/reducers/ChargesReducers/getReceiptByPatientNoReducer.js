import {
  REQUEST_RECEIPTS_LIST_BY_PATIENT_NO,
  REQUEST_RECEIPTS_LIST_SUCCESS_BY_PATIENT_NO,
  REQUEST_RECEIPT_LIST_FAIL_BY_PATIENT_NO,
  REQUEST_RECEIPTS_LIST_RESET_BY_PATIENT_NO,
} from "../../actions/Charges-Actions/getReceipts";

const initialState = {
  loading: false,
  success: false,
  error: null,
  data: null,
};

export const getReceiptsByPatientNoReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_RECEIPTS_LIST_BY_PATIENT_NO:
      return { ...state, loading: true };
    case REQUEST_RECEIPTS_LIST_SUCCESS_BY_PATIENT_NO:
      return { ...state, loading: false, success: true, data: action.payload };
    case REQUEST_RECEIPT_LIST_FAIL_BY_PATIENT_NO:
      return { ...state, loading: false, error: action.payload };
    case REQUEST_RECEIPTS_LIST_RESET_BY_PATIENT_NO:
      return { ...initialState };
    default:
      return state;
  }
};
