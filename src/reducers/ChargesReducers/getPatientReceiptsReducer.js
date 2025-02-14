import {
    REQUEST_PATIENT_RECEIPT_LINES,
    REQUEST_PATIENT_RECEIPT_LINES_FAIL,
    REQUEST_PATIENT_RECEIPT_LINES_RESET,
    REQUEST_PATIENT_RECEIPT_LINES_SUCCESS,
    REQUEST__PATIENT_RECEIPT_HEADER,
    REQUEST__PATIENT_RECEIPT_HEADER_SUCCESS,
    REQUEST__PATIENT_RECEIPT_HEADER_FAIL,  // Only include it once here.
    REQUEST__PATIENT_RECEIPT_HEADER_RESET,
  } from "../../actions/Charges-Actions/getPatientReceipts";
  

export const getPatientReceiptsReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case REQUEST_PATIENT_RECEIPT_LINES:
      return { loading: true, data: [] };
    case REQUEST_PATIENT_RECEIPT_LINES_SUCCESS:
      return { loading: false, data: action.payload };
    case REQUEST_PATIENT_RECEIPT_LINES_FAIL:
      return { loading: false, error: action.payload, data: [] };
    case REQUEST_PATIENT_RECEIPT_LINES_RESET:
      return { loading: false, data: [], error: null }; // ✅ Reset data & error
    default:
      return state;
  }
};

export const getPatientReceiptsHeadersReducer = (state = { data: [] }, action) => {
    switch (action.type) {
      case REQUEST__PATIENT_RECEIPT_HEADER:
        return { loading: true, data: [] };
      case REQUEST__PATIENT_RECEIPT_HEADER_SUCCESS:
        return { loading: false, data: action.payload };
      case REQUEST__PATIENT_RECEIPT_HEADER_FAIL:
        return { loading: false, error: action.payload, data: [] };
      case REQUEST__PATIENT_RECEIPT_HEADER_RESET:
        return { loading: false, data: [], error: null }; // ✅ Reset data & error
      default:
        return state;
    }
  };
