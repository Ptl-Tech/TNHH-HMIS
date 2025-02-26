import { REQUEST_UNPOSTED_CHARGES, REQUEST_UNPOSTED_CHARGES_FAIL, REQUEST_UNPOSTED_CHARGES_RESET, REQUEST_UNPOSTED_CHARGES_SUCCESS } from "../../actions/Charges-Actions/getUnpostedCharges";

export const getUnpostedChargesReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case REQUEST_UNPOSTED_CHARGES:
      return { loading: true, data: [] };
    case REQUEST_UNPOSTED_CHARGES_SUCCESS:
      return { loading: false, data: action.payload };
    case REQUEST_UNPOSTED_CHARGES_FAIL:
      return { loading: false, error: action.payload };
    case REQUEST_UNPOSTED_CHARGES_RESET:
      return { loading: false };
    default:
      return state;
  }
};
