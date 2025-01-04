import {
  GET_VERIFIED_ADMITTED_PATIENTS_REQUEST,
  GET_VERIFIED_ADMITTED_PATIENTS_SUCCESS,
  GET_VERIFIED_ADMITTED_PATIENTS_FAIL,
  GET_VERIFIED_ADMITTED_PATIENTS_RESET,
} from "../../../actions/Doc-actions/Admission/getAdmittedPatients";

export const getAdmittedPatientsReducer = (
  state = { admissions: [] },
  action
) => {
  switch (action.type) {
    case GET_VERIFIED_ADMITTED_PATIENTS_REQUEST:
      return { loading: true, admissions: [] };
    case GET_VERIFIED_ADMITTED_PATIENTS_SUCCESS:
      return { loading: false, admissions: action.payload };
    case GET_VERIFIED_ADMITTED_PATIENTS_FAIL:
      return { loading: false, error: action.payload };
    case GET_VERIFIED_ADMITTED_PATIENTS_RESET:
      return { admissions: [] };
    default:
      return state;
  }
};
