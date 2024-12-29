

export const POST_LAB_REQUEST = "POST_LAB_REQUEST";
export const POST_LAB_SUCCESS = "POST_LAB_SUCCESS";
export const POST_LAB_FAIL = "POST_LAB_FAIL";
export const POST_LAB_RESET = "POST_LAB_RESET";

export const REQUEST_LAB_TEST = "REQUEST_LAB_TEST";
export const REQUEST_LAB_TEST_SUCCESS = "REQUEST_LAB_TEST_SUCCESS";
export const REQUEST_LAB_TEST_FAIL = "REQUEST_LAB_TEST_FAIL";
export const REQUEST_LAB_TEST_RESET = "REQUEST_LAB_TEST_RESET";


export const VIEW_PATIENT_LAB_TEST = "VIEW_PATIENT_LAB_TEST";
export const VIEW_PATIENT_LAB_TEST_SUCCESS = "VIEW_PATIENT_LAB_TEST_SUCCESS";
export const VIEW_PATIENT_LAB_TEST_FAIL = "VIEW_PATIENT_LAB_TEST_FAIL";
export const VIEW_PATIENT_LAB_TEST_RESET = "VIEW_PATIENT_LAB_TEST_RESET";

// Action Types
export const REQUEST_LAB_LIST = "REQUEST_LAB_LIST";
export const REQUEST_LAB_LIST_SUCCESS = "REQUEST_LAB_LIST_SUCCESS";
export const REQUEST_LAB_LIST_FAIL = "REQUEST_LAB_LIST_FAIL";
export const REQUEST_LAB_LIST_RESET = "REQUEST_LAB_LIST_RESET";

export const postLabReducer = (state = { loading: false }, action) => {
  switch (action.type) {
    case POST_LAB_REQUEST:
      return { ...state, loading: true };
    case POST_LAB_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case POST_LAB_FAIL:
      return { ...state, loading: false, error: action.payload };
    case POST_LAB_RESET:
      return { loading: false };
    default:
      return state;
  }
};


export const requestLabTestReducer = (state = { loading: false }, action) => {
    switch (action.type) {
      case REQUEST_LAB_TEST:
        return { ...state, loading: true };
      case REQUEST_LAB_TEST_SUCCESS:
        return { ...state, loading: false, success: true, data: action.payload };
      case REQUEST_LAB_TEST_FAIL:
        return { ...state, loading: false, error: action.payload };
      case REQUEST_LAB_TEST_RESET :
        return { loading: false };
      default:
        return state;
    }
  };



export const viewPatientLabTestReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case VIEW_PATIENT_LAB_TEST:
      return { loading: true, data: [] };
    case VIEW_PATIENT_LAB_TEST_SUCCESS:
      return { loading: false, data: action.payload };
    case VIEW_PATIENT_LAB_TEST_FAIL:
      return { loading: false, error: action.payload };
    case VIEW_PATIENT_LAB_TEST_RESET:
      return { loading: false };
    default:
      return state;
  }
};

export const getLabListReducer = (state = { data: [] }, action) => {
  switch (action.type) 
  {
    case REQUEST_LAB_LIST:
      return { loading: true, data: [] };
    case REQUEST_LAB_LIST_SUCCESS:
      return { loading: false, data: action.payload };
    case REQUEST_LAB_LIST_FAIL:
      return { loading: false, error: action.payload };
    case REQUEST_LAB_LIST_RESET:
      return { data: [] };
    default:
      return state;
  }
};

 