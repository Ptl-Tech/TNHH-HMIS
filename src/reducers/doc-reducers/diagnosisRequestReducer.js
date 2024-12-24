

export const POST_DIAGNOSIS_REQUEST = "POST_DIAGNOSIS_REQUEST";
export const POST_DIAGNOSIS_SUCCESS = "POST_DIAGNOSIS_SUCCESS";
export const POST_DIAGNOSIS_FAIL = "POST_DIAGNOSIS_FAIL";
export const POST_DIAGNOSIS_RESET = "POST_DIAGNOSIS_RESET";


export const REQUEST_DIAGNOSIS_TEST = "REQUEST_DIAGNOSIS_TEST";
export const REQUEST_DIAGNOSIS_TEST_SUCCESS = "REQUEST_DIAGNOSIS_TEST_SUCCESS";
export const REQUEST_DIAGNOSIS_TEST_FAIL = "REQUEST_DIAGNOSIS_TEST_FAIL";
export const REQUEST_DIAGNOSIS_TEST_RESET = "REQUEST_DIAGNOSIS_TEST_RESET";

export const postDiagnosisReducer = (state = { loading: false }, action) => {
  switch (action.type) {
    case POST_DIAGNOSIS_REQUEST:
      return { ...state, loading: true };
    case POST_DIAGNOSIS_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case POST_DIAGNOSIS_FAIL:
      return { ...state, loading: false, error: action.payload };
    case POST_DIAGNOSIS_RESET:
      return { loading: false };
    default:
      return state;
  }
};


export const requestDIAGNOSISReducer = (state = { loading: false }, action) => {
  switch (action.type) {
    case REQUEST_DIAGNOSIS_TEST:
      return { ...state, loading: true };
    case REQUEST_DIAGNOSIS_TEST_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case REQUEST_DIAGNOSIS_TEST_FAIL:
      return { ...state, loading: false, error: action.payload };
    case REQUEST_DIAGNOSIS_TEST_RESET:
      return { loading: false };
    default:
      return state;
  }
};
