import {
  CREATE_PATIENT_VISIT_REQUEST,
  CREATE_PATIENT_VISIT_SUCCESS,
  CREATE_PATIENT_VISIT_FAIL,
  CREATE_PATIENT_VISIT_RESET,
} from "../../../actions/reception-actions/patient-visit-actions/createPatientVisit";

const initialState = {
  loading: false,
  success: false,
  error: false,
  data: null,
};

export const createPatientVisitReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_PATIENT_VISIT_REQUEST:
      return { ...state, loading: true, success: false, error: null };
    case CREATE_PATIENT_VISIT_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case CREATE_PATIENT_VISIT_FAIL:
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload,
      };
    case CREATE_PATIENT_VISIT_RESET:
      return initialState;
    default:
      return state;
  }
};
