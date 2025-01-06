import {
  GET_CHARGES_SETUP_REQUEST,
  GET_CHARGES_SETUP_SUCCESS,
  GET_CHARGES_SETUP_FAIL,
  GET_CHARGES_SETUP_RESET,
} from "../../actions/Charges-Actions/ChargesSetup";

export const getChargesSetupReducer = (state = { charges: [] }, action) => {
  switch (action.type) {
    case GET_CHARGES_SETUP_REQUEST:
      return { loading: true, charges: [] };
    case GET_CHARGES_SETUP_SUCCESS:
      return { loading: false, charges: action.payload };
    case GET_CHARGES_SETUP_FAIL:
      return { loading: false, error: action.payload };
    case GET_CHARGES_SETUP_RESET:
      return { charges: [] };
    default:
      return state;
  }
};
