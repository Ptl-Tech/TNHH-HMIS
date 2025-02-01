import {
  REQUEST_CHARGES_LINES,
  REQUEST_CHARGES_LINES_FAIL,
  REQUEST_CHARGES_LINES_RESET,
  REQUEST_CHARGES_LINES_SUCCESS,
} from "../../actions/Charges-Actions/getChargesLines";

export const getChargesLinesReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case REQUEST_CHARGES_LINES:
      return { loading: true, data: [] };
    case REQUEST_CHARGES_LINES_SUCCESS:
      return { loading: false, data: action.payload };
    case REQUEST_CHARGES_LINES_FAIL:
      return { loading: false, error: action.payload };
    case REQUEST_CHARGES_LINES_RESET:
      return { loading: false };
    default:
      return state;
  }
};
