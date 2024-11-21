import { PATIENT_REGISTER_REQUEST, PATIENT_REGISTER_SUCCESS, PATIENT_REGISTER_FAIL, PATIENT_REGISTER_RESET, TRIAGE_VISIT_REQUEST, TRIAGE_VISIT_SUCCESS, TRIAGE_VISIT_FAIL, TRIAGE_VISIT_RESET, PATIENT_LIST_REQUEST, PATIENT_LIST_SUCCESS, PATIENT_LIST_FAIL, PATIENT_LIST_RESET, TRIAGE_VISIT_LIST_REQUEST, TRIAGE_VISIT_LIST_SUCCESS, TRIAGE_VISIT_LIST_RESET, POST_PATIENT_VITALS_REQUEST, POST_PATIENT_VITALS_SUCCESS, POST_PATIENT_VITALS_FAIL, POST_PATIENT_VITALS_RESET, POST_DOCTOR_TREATMENT_REQUEST, POST_DOCTOR_TREATMENT_SUCCESS, POST_DOCTOR_TREATMENT_FAIL, POST_DOCTOR_TREATMENT_RESET } from "../constants/patientConstants";


export const patientCreateReducer = (state = { loading: false }, action) => {
  switch (action.type) {
    case PATIENT_REGISTER_REQUEST:
      return { ...state, loading: true };
    case PATIENT_REGISTER_SUCCESS:
      return { ...state, loading: false, success: true, patient: action.payload };
    case PATIENT_REGISTER_FAIL:
      return { ...state, loading: false, error: action.payload };
    case PATIENT_REGISTER_RESET:
      return { loading: false };
    default:
      return state;
  }
};


  export const patientTriageVisitCreateReducer = (state = {}, action) => {
    switch (action.type) {
      case TRIAGE_VISIT_REQUEST:
        return { loading: true };
      case TRIAGE_VISIT_SUCCESS:
        return { loading: false, success: true, patientId: action.payload };
      case TRIAGE_VISIT_FAIL:
        return { loading: false, error: action.payload };
      case TRIAGE_VISIT_RESET:
        return {};
      default:
        return state;
    }
  };

  export const patientListReducer = (state = { patients: [] }, action) => {
    switch (action.type) {
      case PATIENT_LIST_REQUEST:
        return { loading: true, patients: [] };
      case PATIENT_LIST_SUCCESS:
        return { loading: false, patients: action.payload };
      case PATIENT_LIST_FAIL:
        return { loading: false, error: action.payload };
      case PATIENT_LIST_RESET:
        return { patients: [] };
      default:
        return state;
    }
  }

  export const triageListReducer = (state = { patients: [] }, action) => {
    switch (action.type) {
      case TRIAGE_VISIT_LIST_REQUEST:
        return { loading: true, patients: [] };
      case TRIAGE_VISIT_LIST_SUCCESS:
        return { loading: false, patients: action.payload };
      case TRIAGE_VISIT_FAIL:
        return { loading: false, error: action.payload };
      case TRIAGE_VISIT_LIST_RESET:
        return { patients: [] };
      default:
        return state;
    }
  }

  export const postPatientVitalsReducer = (state = {}, action) => {
    switch (action.type) {
      case POST_PATIENT_VITALS_REQUEST:
        return { loading: true };
      case POST_PATIENT_VITALS_SUCCESS:
        return { loading: false, patients: [] };
      case POST_PATIENT_VITALS_FAIL:
        return { loading: false, error: action.payload };
      case POST_PATIENT_VITALS_RESET:
        return {};
      default:
        return state;
    }
    
  }

  export const postDoctorTreatmentReducer = (state = {}, action) => {
    switch (action.type) {
      case POST_DOCTOR_TREATMENT_REQUEST:
        return { loading: true };
      case POST_DOCTOR_TREATMENT_SUCCESS:
        return { loading: false, patients: [] };
      case POST_DOCTOR_TREATMENT_FAIL:
        return { loading: false, error: action.payload };
      case POST_DOCTOR_TREATMENT_RESET:
        return {};
      default:
        return state;
    }
    
  }