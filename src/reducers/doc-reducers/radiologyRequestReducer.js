

export const POST_RADIOLOGY_REQUEST = "POST_RADIOLOGY_REQUEST";
export const POST_RADIOLOGY_SUCCESS = "POST_RADIOLOGY_SUCCESS";
export const POST_RADIOLOGY_FAIL = "POST_RADIOLOGY_FAIL";
export const POST_RADIOLOGY_RESET = "POST_RADIOLOGY_RESET";


export const REQUEST_RADIOLOGY_TEST = "REQUEST_RADIOLOGY_TEST";
export const REQUEST_RADIOLOGY_TEST_SUCCESS = "REQUEST_RADIOLOGY_TEST_SUCCESS";
export const REQUEST_RADIOLOGY_TEST_FAIL = "REQUEST_RADIOLOGY_TEST_FAIL";
export const REQUEST_RADIOLOGY_TEST_RESET = "REQUEST_RADIOLOGY_TEST_RESET";


export const VIEW_PATIENT_RADIOLOGY_TEST = "VIEW_PATIENT_RADIOLOGY_TEST";
export const VIEW_PATIENT_RADIOLOGY_TEST_SUCCESS = "VIEW_PATIENT_RADIOLOGY_TEST_SUCCESS";
export const VIEW_PATIENT_RADIOLOGY_TEST_FAIL = "VIEW_PATIENT_RADIOLOGY_TEST_FAIL";
export const VIEW_PATIENT_RADIOLOGY_TEST_RESET = "VIEW_PATIENT_RADIOLOGY_TEST_RESET";

export const postRadiologyReducer = (state = { loading: false }, action) => {
  switch (action.type) {
    case POST_RADIOLOGY_REQUEST:
      return { ...state, loading: true };
    case POST_RADIOLOGY_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case POST_RADIOLOGY_FAIL:
      return { ...state, loading: false, error: action.payload };
    case POST_RADIOLOGY_RESET:
      return { loading: false };
    default:
      return state;
  }
};


export const requestRadiologyReducer = (state = { loading: false }, action) => {
  switch (action.type) {
    case REQUEST_RADIOLOGY_TEST:
      return { ...state, loading: true };
    case REQUEST_RADIOLOGY_TEST_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case REQUEST_RADIOLOGY_TEST_FAIL:
      return { ...state, loading: false, error: action.payload };
    case REQUEST_RADIOLOGY_TEST_RESET:
      return { loading: false };
    default:
      return state;
  }
};


export const viewPatientRadiologyReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case VIEW_PATIENT_RADIOLOGY_TEST:
      return { loading: true, data: [] };
    case VIEW_PATIENT_RADIOLOGY_TEST_SUCCESS:
      return { loading: false, data: action.payload };
    case VIEW_PATIENT_RADIOLOGY_TEST_FAIL:
      return { loading: false, error: action.payload };
    case VIEW_PATIENT_RADIOLOGY_TEST_RESET:
      return { loading: false };
    default:
      return state;
  }
};
