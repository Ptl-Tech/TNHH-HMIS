import {
  POST_CHARGES_REQUEST,
  POST_CHARGES_SUCCESS,
  POST_CHARGES_FAIL,
  POST_CHARGES_RESET,
} from "../../actions/Charges-Actions/postCharges";

export const postPatientChargesReducer = (
  state = { loading: false },
  action
) => {
  switch (action.type) {
    case POST_CHARGES_REQUEST:
      return { ...state, loading: true };
    case POST_CHARGES_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case POST_CHARGES_FAIL:
      return { ...state, loading: false, error: action.payload };
    case POST_CHARGES_RESET:
      return { loading: false };
    default:
      return state;
  }
};
