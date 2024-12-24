

export const SAVE_ADMISSION_DETAILS_REQUEST = "SAVE_ADMISSION_DETAILS_REQUEST";
export const SAVE_ADMISSION_DETAILS_SUCCESS = "SAVE_ADMISSION_DETAILS_SUCCESS";
export const SAVE_ADMISSION_DETAILS_FAIL = "SAVE_ADMISSION_DETAILS_FAIL";
export const SAVE_ADMISSION_DETAILS_RESET = "SAVE_ADMISSION_DETAILS_RESET";



// Action Types
export const REQUEST_PATIENT_ADMISSION = "REQUEST_PATIENT_ADMISSION";
export const REQUEST_PATIENT_ADMISSION_SUCCESS = "REQUEST_PATIENT_ADMISSION_SUCCESS";
export const REQUEST_PATIENT_ADMISSION_FAIL = "REQUEST_PATIENT_ADMISSION_FAIL";
export const REQUEST_PATIENT_ADMISSION_RESET = "REQUEST_PATIENT_ADMISSION_RESET";


export const saveAdmissionDetailsReducer = (state = { loading: false }, action) => {
  switch (action.type) {
    case SAVE_ADMISSION_DETAILS_REQUEST:
      return { ...state, loading: true };
    case SAVE_ADMISSION_DETAILS_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case SAVE_ADMISSION_DETAILS_FAIL:
      return { ...state, loading: false, error: action.payload };
    case SAVE_ADMISSION_DETAILS_RESET:
      return { loading: false };
    default:
      return state;
  }
};


export const requestAdmissionReducer = (state = { loading: false }, action) => {
  switch (action.type) {
    case REQUEST_PATIENT_ADMISSION:
      return { ...state, loading: true };
    case REQUEST_PATIENT_ADMISSION_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case REQUEST_PATIENT_ADMISSION_FAIL:
      return { ...state, loading: false, error: action.payload };
    case REQUEST_PATIENT_ADMISSION_RESET:
      return { loading: false };
    default:
      return state;
  }
};
