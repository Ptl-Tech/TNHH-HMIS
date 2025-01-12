import {
  GET_BILLING_LIST_REQUEST,
  GET_BILLING_LIST_SUCCESS,
  GET_BILLING_LIST_FAIL,
  GET_BILLING_LIST_RESET,
} from "../../actions/Charges-Actions/getBillingList";

export const getBillingListReducer = (state = { patients: [] }, action) => {
  switch (action.type) {
    case GET_BILLING_LIST_REQUEST:
      return { loading: true, patients: [] };
    case GET_BILLING_LIST_SUCCESS:
      return { loading: false, patients: action.payload };
    case GET_BILLING_LIST_FAIL:
      return { loading: false, error: action.payload };
    case GET_BILLING_LIST_RESET:
      return { patients: [] };
    default:
      return state;
  }
};
