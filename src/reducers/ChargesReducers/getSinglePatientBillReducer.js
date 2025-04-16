import {
  GET_SINGLE_PATIENT_BILL_REQUEST,
  GET_SINGLE_PATIENT_BILL_SUCCESS,
  GET_SINGLE_PATIENT_BILL_FAIL,
  GET_SINGLE_PATIENT_BILL_RESET,
} from "../../actions/Charges-Actions/getSinglePatientBill";

const initialState = {
  loading: false,
  success: false,
  error: false,
  data: {},
};

export const getSinglePatientBillReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SINGLE_PATIENT_BILL_REQUEST:
      return { ...state, loading: true, success: false, error: null };
    case GET_SINGLE_PATIENT_BILL_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case GET_SINGLE_PATIENT_BILL_FAIL:
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload,
      };
    case GET_SINGLE_PATIENT_BILL_RESET:
      return initialState;
    default:
      return state;
  }
};
