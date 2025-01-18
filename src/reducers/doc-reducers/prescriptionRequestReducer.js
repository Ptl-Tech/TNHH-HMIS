
export const POST_PRESCRIPTION_REQUEST = "POST_PRESCRIPTION_REQUEST";
export const POST_PRESCRIPTION_SUCCESS = "POST_PRESCRIPTION_SUCCESS";
export const POST_PRESCRIPTION_FAIL = "POST_PRESCRIPTION_FAIL";
export const POST_PRESCRIPTION_RESET = "POST_PRESCRIPTION_RESET";

export const POST_PRESCRIPTION_TO_PHARMACY_REQUEST = "POST_PRESCRIPTION_TO_PHARMACY_REQUEST";
export const POST_PRESCRIPTION_TO_PHARMACY_SUCCESS = "POST_PRESCRIPTION_TO_PHARMACY_SUCCESS";
export const POST_PRESCRIPTION_TO_PHARMACY_FAIL = "POST_PRESCRIPTION_TO_PHARMACY_FAIL";
export const POST_PRESCRIPTION_TO_PHARMACY_RESET = "POST_PRESCRIPTION_TO_PHARMACY_RESET";

export const GET_PATIENT_PRESCRIPTION_LINE_REQUEST = "GET_PATIENT_PRESCRIPTION_LINE_REQUEST";
export const GET_PATIENT_PRESCRIPTION_LINE_SUCCESS = "GET_PATIENT_PRESCRIPTION_LINE_SUCCESS";
export const GET_PATIENT_PRESCRIPTION_LINE_FAIL = "GET_PATIENT_PRESCRIPTION_LINE_FAIL";
export const GET_PATIENT_PRESCRIPTION_LINE_RESET = "GET_PATIENT_PRESCRIPTION_LINE_RESET";


export const getPatientPrescriptionLine = (state = { loading: false }, action) => {
  switch (action.type) {
    case GET_PATIENT_PRESCRIPTION_LINE_REQUEST:
      return { ...state, loading: true };
    case GET_PATIENT_PRESCRIPTION_LINE_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case GET_PATIENT_PRESCRIPTION_LINE_FAIL:
      return { ...state, loading: false, error: action.payload };
    case GET_PATIENT_PRESCRIPTION_LINE_RESET:
      return { loading: false };
    default:
      return state;
  }
};

export const savePrescriptionDetailsReducer = (state = { loading: false }, action) => {
  switch (action.type) {
    case POST_PRESCRIPTION_REQUEST:
      return { ...state, loading: true };
    case POST_PRESCRIPTION_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case POST_PRESCRIPTION_FAIL:
      return { ...state, loading: false, error: action.payload };
    case POST_PRESCRIPTION_RESET:
      return { loading: false };
    default:
      return state;
  }
};


export const sendtoPharmacyReducer = (state = { loading: false }, action) => {
  switch (action.type) {
    case POST_PRESCRIPTION_TO_PHARMACY_REQUEST:
      return { ...state, loading: true };
    case POST_PRESCRIPTION_TO_PHARMACY_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case POST_PRESCRIPTION_TO_PHARMACY_FAIL:
      return { ...state, loading: false, error: action.payload };
    case POST_PRESCRIPTION_TO_PHARMACY_RESET:
      return { loading: false };
    default:
      return state;
  }
};
