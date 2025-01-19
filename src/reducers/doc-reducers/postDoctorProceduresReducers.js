
import {
    POST_PATIENT_ETC_REQUEST_REQUEST,
    POST_PATIENT_ETC_REQUEST_SUCCESS,
    POST_PATIENT_ETC_REQUEST_FAIL,
    POST_PATIENT_ETC_REQUEST_RESET,
    GET_PATIENT_ETC_REQUEST_REQUEST,
    GET_PATIENT_ETC_REQUEST_SUCCESS,
    GET_PATIENT_ETC_REQUEST_FAIL,
    GET_PATIENT_ETC_REQUEST_RESET,
    POST_PATIENT_KETAMINE_REQUEST_REQUEST,
    POST_PATIENT_KETAMINE_REQUEST_SUCCESS,
    POST_PATIENT_KETAMINE_REQUEST_FAIL,
    POST_PATIENT_KETAMINE_REQUEST_RESET,
    GET_PATIENT_KETAMINE_REQUEST_REQUEST,
    GET_PATIENT_KETAMINE_REQUEST_SUCCESS,
    GET_PATIENT_KETAMINE_REQUEST_FAIL,
    GET_PATIENT_KETAMINE_REQUEST_RESET,
    POST_PATIENT_IMPLANT_REQUEST_REQUEST,
    POST_PATIENT_IMPLANT_REQUEST_SUCCESS,
    POST_PATIENT_IMPLANT_REQUEST_FAIL,
    POST_PATIENT_IMPLANT_REQUEST_RESET
} from "../../actions/Doc-actions/postDoctorProcedures"


export const postPatientECTRequest = (state = { loading: false }, action) => {
  switch (action.type) {
    case POST_PATIENT_ETC_REQUEST_REQUEST:
      return { ...state, loading: true };
    case POST_PATIENT_ETC_REQUEST_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case POST_PATIENT_ETC_REQUEST_FAIL:
      return { ...state, loading: false, error: action.payload };
    case POST_PATIENT_ETC_REQUEST_RESET:
      return { loading: false };
    default:
      return state;
  }
};

export const postPatientImplantRequest = (state = { loading: false }, action) => {
    switch (action.type) {
      case POST_PATIENT_IMPLANT_REQUEST_REQUEST:
        return { ...state, loading: true };
      case POST_PATIENT_IMPLANT_REQUEST_SUCCESS:
        return { ...state, loading: false, success: true, data: action.payload };
      case POST_PATIENT_IMPLANT_REQUEST_FAIL:
        return { ...state, loading: false, error: action.payload };
      case POST_PATIENT_IMPLANT_REQUEST_RESET:
        return { loading: false };
      default:
        return state;
    }
  };

export const postPatientRetamineRequest = (state = { loading: false }, action) => {
    switch (action.type) {
      case POST_PATIENT_KETAMINE_REQUEST_REQUEST:
        return { ...state, loading: true };
      case POST_PATIENT_KETAMINE_REQUEST_SUCCESS:
        return { ...state, loading: false, success: true, data: action.payload };
      case POST_PATIENT_KETAMINE_REQUEST_FAIL:
        return { ...state, loading: false, error: action.payload };
      case POST_PATIENT_KETAMINE_REQUEST_RESET:
        return { loading: false };
      default:
        return state;
    }
  };

export const getPatientECTRequest = (state = { loading: false }, action) => {
    switch (action.type) {
      case GET_PATIENT_ETC_REQUEST_REQUEST:
        return { ...state, loading: true };
      case GET_PATIENT_ETC_REQUEST_SUCCESS:
        return { ...state, loading: false, success: true, data: action.payload };
      case GET_PATIENT_ETC_REQUEST_FAIL:
        return { ...state, loading: false, error: action.payload };
      case GET_PATIENT_ETC_REQUEST_RESET:
        return { loading: false };
      default:
        return state;
    }
  };

  export const getPatientKetamineRequest = (state = { loading: false }, action) => {
    switch (action.type) {
      case GET_PATIENT_KETAMINE_REQUEST_REQUEST:
        return { ...state, loading: true };
      case GET_PATIENT_KETAMINE_REQUEST_SUCCESS:
        return { ...state, loading: false, success: true, data: action.payload };
      case GET_PATIENT_KETAMINE_REQUEST_FAIL:
        return { ...state, loading: false, error: action.payload };
      case GET_PATIENT_KETAMINE_REQUEST_RESET:
        return { loading: false };
      default:
        return state;
    }
  };

 