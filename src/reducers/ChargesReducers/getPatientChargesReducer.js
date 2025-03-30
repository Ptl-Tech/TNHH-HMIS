import {
  REQUEST_PATIENT_CHARGES,
  REQUEST_PATIENT_CHARGES_FAIL,
  REQUEST_PATIENT_CHARGES_RESET,
  REQUEST_PATIENT_CHARGES_SUCCESS,
} from "../../actions/Charges-Actions/getPatientCharges";

export const getPatientChargesReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case REQUEST_PATIENT_CHARGES:
      return { loading: true, data: [] };
    case REQUEST_PATIENT_CHARGES_SUCCESS:
      return { loading: false, data: action.payload };
    case REQUEST_PATIENT_CHARGES_FAIL:
      return { loading: false, error: action.payload };
    case REQUEST_PATIENT_CHARGES_RESET:
      return { loading: false };
    default:
      return state;
  }
};
