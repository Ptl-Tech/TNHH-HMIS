import { POST_REFRESH_PATIENT_CHARGES_REQUEST, POST_REFRESH_PATIENT_CHARGES_SUCCESS, POST_REFRESH_PATIENT_CHARGES_FAIL, POST_REFRESH_PATIENT_CHARGES_RESET } from "../../actions/Charges-Actions/postRefreshCharges";


const initialState = {
  loading: false,
  success: false,
  error: null,
  data: null,
};

export const postRefreshPatientChargesReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_REFRESH_PATIENT_CHARGES_REQUEST:
      return { ...state, loading: true };
    case POST_REFRESH_PATIENT_CHARGES_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case POST_REFRESH_PATIENT_CHARGES_FAIL:
      return { ...state, loading: false, error: action.payload };
    case POST_REFRESH_PATIENT_CHARGES_RESET:
      return { ...initialState }; 
    default:
      return state;
  }
};
