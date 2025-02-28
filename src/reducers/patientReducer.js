import {
  PATIENT_REGISTER_REQUEST,
  PATIENT_REGISTER_SUCCESS,
  PATIENT_REGISTER_FAIL,
  PATIENT_REGISTER_RESET,
  TRIAGE_VISIT_REQUEST,
  TRIAGE_VISIT_SUCCESS,
  TRIAGE_VISIT_FAIL,
  TRIAGE_VISIT_RESET,
  PATIENT_LIST_REQUEST,
  PATIENT_LIST_SUCCESS,
  PATIENT_LIST_FAIL,
  PATIENT_LIST_RESET,
  TRIAGE_VISIT_LIST_REQUEST,
  TRIAGE_VISIT_LIST_SUCCESS,
  TRIAGE_VISIT_LIST_RESET,
  POST_PATIENT_VITALS_REQUEST,
  POST_PATIENT_VITALS_SUCCESS,
  POST_PATIENT_VITALS_FAIL,
  POST_PATIENT_VITALS_RESET,
  POST_DOCTOR_TREATMENT_REQUEST,
  POST_DOCTOR_TREATMENT_SUCCESS,
  POST_DOCTOR_TREATMENT_FAIL,
  POST_DOCTOR_TREATMENT_RESET,
  POST_TRIAGE_VISIT_REQUEST,
  POST_TRIAGE_VISIT_SUCCESS,
  POST_TRIAGE_VISIT_FAIL,
  POST_TRIAGE_VISIT_RESET,
  ACTIVE_lIST_REQUEST,
  ACTIVE_LIST_SUCCESS,
  ACTIVE_LIST_FAIL,
  ACTIVE_LIST_RESET,
  CONVERT_TO_PATIENT_REQUEST,
  CONVERT_TO_PATIENT_SUCCESS,
  CONVERT_TO_PATIENT_FAIL,
  CONVERT_TO_PATIENT_RESET,
  APPMNT_LIST_REQUEST,
  APPMNT_LIST_SUCCESS,
  APPMNT_LIST_FAIL,
  APPMNT_LIST_RESET,
} from '../constants/patientConstants';

import {
  CREATE_WALK_IN_PATIENT_REQUEST,
  CREATE_WALK_IN_PATIENT_SUCCESS,
  CREATE_WALK_IN_PATIENT_FAIL,
  CREATE_WALK_IN_PATIENT_RESET,
  DISPATCH_WALK_IN_PATIENT_LAB_REQUEST,
  DISPATCH_WALK_IN_PATIENT_LAB_SUCCESS,
  DISPATCH_WALK_IN_PATIENT_LAB_FAIL,
  DISPATCH_WALK_IN_PATIENT_LAB_RESET,
  DISPATCH_WALK_IN_PATIENT_PHARMACY_REQUEST,
  DISPATCH_WALK_IN_PATIENT_PHARMACY_SUCCESS,
  DISPATCH_WALK_IN_PATIENT_PHARMACY_FAIL,
  DISPATCH_WALK_IN_PATIENT_PHARMACY_RESET,
} from '../actions/patientActions';
export const patientCreateReducer = (state = { loading: false }, action) => {
  switch (action.type) {
    case PATIENT_REGISTER_REQUEST:
      return { ...state, loading: true };
    case PATIENT_REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        patient: action.payload,
      };
    case PATIENT_REGISTER_FAIL:
      return { ...state, loading: false, error: action.payload };
    case PATIENT_REGISTER_RESET:
      return { loading: false };
    default:
      return state;
  }
};

export const createWalkInPatientReducer = (
  state = { loading: false },
  action,
) => {
  switch (action.type) {
    case CREATE_WALK_IN_PATIENT_REQUEST:
      return { ...state, loading: true };
    case CREATE_WALK_IN_PATIENT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        patient: action.payload,
      };
    case CREATE_WALK_IN_PATIENT_FAIL:
      return { ...state, loading: false, error: action.payload };
    case CREATE_WALK_IN_PATIENT_RESET:
      return { loading: false };
    default:
      return state;
  }
};

export const dispatchWalkInLabReducer = (
  state = { loading: false },
  action,
) => {
  switch (action.type) {
    case DISPATCH_WALK_IN_PATIENT_LAB_REQUEST:
      return { ...state, loading: true };
    case DISPATCH_WALK_IN_PATIENT_LAB_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        patient: action.payload,
      };
    case DISPATCH_WALK_IN_PATIENT_LAB_FAIL:
      return { ...state, loading: false, error: action.payload };
    case DISPATCH_WALK_IN_PATIENT_LAB_RESET:
      return { loading: false };
    default:
      return state;
  }
};

export const dispatchWalkInPharmacyReducer = (
  state = { loading: false },
  action,
) => {
  switch (action.type) {
    case DISPATCH_WALK_IN_PATIENT_PHARMACY_REQUEST:
      return { ...state, loading: true };
    case DISPATCH_WALK_IN_PATIENT_PHARMACY_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        patient: action.payload,
      };
    case DISPATCH_WALK_IN_PATIENT_PHARMACY_FAIL:
      return { ...state, loading: false, error: action.payload };
    case DISPATCH_WALK_IN_PATIENT_PHARMACY_RESET:
      return { loading: false };
    default:
      return state;
  }
};

const initialTriageVisitCreateState = {
  loading: false,
  success: false,
  error: false,
  data: null,
};

  export const patientListReducer = (state = { loading: false, patients: [] }, action) => {
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

export const patientTriageVisitCreateReducer = (
  state = initialTriageVisitCreateState,
  action,
) => {
  switch (action.type) {
    case TRIAGE_VISIT_REQUEST:
      return { ...state, loading: true };
    case TRIAGE_VISIT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        data: action.payload,
      };
    case TRIAGE_VISIT_FAIL:
      return { ...state, loading: false, error: action.payload };
    case TRIAGE_VISIT_RESET:
      return initialTriageVisitCreateState;
    default:
      return state;
  }
};

export const postTriageVisitReducer = (state = {}, action) => {
  switch (action.type) {
    case POST_TRIAGE_VISIT_REQUEST:
      return { loading: true };
    case POST_TRIAGE_VISIT_SUCCESS:
      return { loading: false, success: true, appointmentId: action.payload };
    case POST_TRIAGE_VISIT_FAIL:
      return { loading: false, error: action.payload };
    case POST_TRIAGE_VISIT_RESET:
      return {};
    default:
      return state;
  }
};

export const convertPatientReducer = (state = {}, action) => {
  switch (action.type) {
    case CONVERT_TO_PATIENT_REQUEST:
      return { loading: true };
    case CONVERT_TO_PATIENT_SUCCESS:
      return { loading: false, success: true, visitorNo: action.payload };
    case CONVERT_TO_PATIENT_FAIL:
      return { loading: false, error: action.payload };
    case CONVERT_TO_PATIENT_RESET:
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
};

export const appmntListReducer = (state = { patients: [] }, action) => {
  switch (action.type) {
    case APPMNT_LIST_REQUEST:
      return { loading: true, patients: [] };
    case APPMNT_LIST_SUCCESS:
      return { loading: false, patients: action.payload };
    case APPMNT_LIST_FAIL:
      return { loading: false, error: action.payload };
    case APPMNT_LIST_RESET:
      return { patients: [] };
    default:
      return state;
  }
};

export const activePatientsReducer = (state = { patients: [] }, action) => {
  switch (action.type) {
    case ACTIVE_lIST_REQUEST:
      return { loading: true, patients: [] };
    case ACTIVE_LIST_SUCCESS:
      return { loading: false, patients: action.payload };
    case ACTIVE_LIST_FAIL:
      return { loading: false, error: action.payload };
    case ACTIVE_LIST_RESET:
      return { patients: [] };
    default:
      return state;
  }
};

export const patientByNoReducer = (state = { patient: {} }, action) => {
  switch (action.type) {
    case PATIENT_LIST_REQUEST:
      return { loading: true };
    case PATIENT_LIST_SUCCESS:
      return { loading: false, patient: action.payload };
    case PATIENT_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

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
};

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
};
