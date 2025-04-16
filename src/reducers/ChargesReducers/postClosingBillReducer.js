import {
  POST_CLOSE_PATIENT_BILL_FAIL,
  POST_CLOSE_PATIENT_BILL_REQUEST,
  POST_CLOSE_PATIENT_BILL_RESET,
  POST_CLOSE_PATIENT_BILL_SUCCESS,
} from "../../actions/Charges-Actions/postCloseBill";

export const postClosingBillReducer = (state = { loading: false }, action) => {
  switch (action.type) {
    case POST_CLOSE_PATIENT_BILL_REQUEST:
      return { ...state, loading: true };
    case POST_CLOSE_PATIENT_BILL_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case POST_CLOSE_PATIENT_BILL_FAIL:
      return { ...state, loading: false, error: action.payload };
    case POST_CLOSE_PATIENT_BILL_RESET:
      return { loading: false };
    default:
      return state;
  }
};
