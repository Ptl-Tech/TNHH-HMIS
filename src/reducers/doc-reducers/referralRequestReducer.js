// Action Types for Saving Referral Details
export const SAVE_PATIENT_REFERRAL_REQUEST = "SAVE_PATIENT_REFERRAL_REQUEST";
export const SAVE_PATIENT_REFERRAL_SUCCESS = "SAVE_PATIENT_REFERRAL_SUCCESS";
export const SAVE_PATIENT_REFERRAL_FAIL = "SAVE_PATIENT_REFERRAL_FAIL";
export const SAVE_PATIENT_REFERRAL_RESET = "SAVE_PATIENT_REFERRAL_RESET";

// Action Types for Requesting Referral Details
export const REQUEST_PATIENT_REFERRAL = "REQUEST_PATIENT_REFERRAL";
export const REQUEST_PATIENT_REFERRAL_SUCCESS = "REQUEST_PATIENT_REFERRAL_SUCCESS";
export const REQUEST_PATIENT_REFERRAL_FAIL = "REQUEST_PATIENT_REFERRAL_FAIL";
export const REQUEST_PATIENT_REFERRAL_RESET = "REQUEST_PATIENT_REFERRAL_RESET";

// Reducer for Saving Referral Details
export const saveReferralDetailsReducer = (state = { loading: false, success: false }, action) => {
  switch (action.type) {
    case SAVE_PATIENT_REFERRAL_REQUEST:
      return { ...state, loading: true, success: false };
    case SAVE_PATIENT_REFERRAL_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case SAVE_PATIENT_REFERRAL_FAIL:
      return { ...state, loading: false, error: action.payload };
    case SAVE_PATIENT_REFERRAL_RESET:
      return { loading: false, success: false }; // Reset success status as well
    default:
      return state;
  }
};

// Reducer for Requesting Referral Details
export const requestReferralReducer = (state = { loading: false, success: false }, action) => {
  switch (action.type) {
    case REQUEST_PATIENT_REFERRAL:
      return { ...state, loading: true, success: false };
    case REQUEST_PATIENT_REFERRAL_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case REQUEST_PATIENT_REFERRAL_FAIL:
      return { ...state, loading: false, error: action.payload };
    case REQUEST_PATIENT_REFERRAL_RESET:
      return { loading: false, success: false }; // Reset success status as well
    default:
      return state;
  }
};
