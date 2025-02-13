import {
  DELETE_CHARGES_REQUEST,
  DELETE_CHARGES_SUCCESS,
  DELETE_CHARGES_FAIL,
} from "../../actions/Charges-Actions/deleteCharges";

export const deletePatientChargesReducer = (
  state = { loading: false },
  action
) => {
  switch (action.type) {
    case DELETE_CHARGES_REQUEST:
      return { ...state, loading: true };
    case DELETE_CHARGES_SUCCESS:
      console.log("Charges posted successfully:", action.payload.status);
      return { ...state, loading: false, success: true, data: action.payload };

      return { ...state, loading: false, error: action.payload };
    case DELETE_CHARGES_FAIL:
      return { loading: false };
    default:
      return state;
  }
};
