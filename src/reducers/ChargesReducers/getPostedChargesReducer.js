import {
  REQUEST_POSTED_CHARGES,
  REQUEST_POSTED_CHARGES_SUCCESS,
  REQUEST_POSTED_CHARGES_FAIL,
  REQUEST_POSTED_CHARGES_RESET,
} from "../../actions/Charges-Actions/getPostedReceipts";

export const getpostedChargesReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case REQUEST_POSTED_CHARGES:
      return { loading: true, data: [] };
    case REQUEST_POSTED_CHARGES_SUCCESS:
      return { loading: false, data: action.payload };
    case REQUEST_POSTED_CHARGES_FAIL:
      return { loading: false, error: action.payload };
    case REQUEST_POSTED_CHARGES_RESET:
      return { loading: false };
    default:
      return state;
  }
};
