import {
  CREATE_PATIENT_VISIT_REQUEST,
  CREATE_PATIENT_VISIT_SUCCESS,
  CREATE_PATIENT_VISIT_FAIL,
  CREATE_PATIENT_VISIT_RESET,
} from "../../../actions/reception-actions/patient-visit-actions/createPatientVisit";



export const createPatientVisitReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_PATIENT_VISIT_REQUEST:
      return { loading: true };
    case CREATE_PATIENT_VISIT_SUCCESS:
      return { loading: false, success: true, visitInfo: action.payload };
    case CREATE_PATIENT_VISIT_FAIL:
      return { loading: false, error: action.payload };
    case CREATE_PATIENT_VISIT_RESET:
      return {};
    default:
      return state;
  }
}
