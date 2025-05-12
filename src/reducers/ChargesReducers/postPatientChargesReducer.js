import {
  POST_CHARGES_REQUEST,
  POST_CHARGES_SUCCESS,
  POST_CHARGES_FAIL,
  POST_CHARGES_RESET,
} from "../../actions/Charges-Actions/postCharges";

// Properly initialized full state
const initialState = {
  loading: false,
  success: false,
  error: null,
  data: null,
};

export const postPatientChargesReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_CHARGES_REQUEST:
      return { ...state, loading: true };

    case POST_CHARGES_SUCCESS:
      console.log("Charges posted successfully:", action.payload.status);
      return {
        ...state,
        loading: false,
        success: true,
        data: action.payload,
      };

    case POST_CHARGES_FAIL:
      return { ...state, loading: false, error: action.payload };

    case POST_CHARGES_RESET:
      return { ...initialState }; // Reset all state fields

    default:
      return state;
  }
};
