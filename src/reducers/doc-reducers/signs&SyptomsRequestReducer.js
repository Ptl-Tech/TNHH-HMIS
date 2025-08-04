
export const POST_SYMPTOMS_REQUEST = "POST_SYMPTOMS_REQUEST";
export const POST_SYMPTOMS_SUCCESS = "POST_SYMPTOMS_SUCCESS";
export const POST_SYMPTOMS_FAIL = "POST_SYMPTOMS_FAIL";
export const  POST_SYMPTOMS_RESET = " POST_SYMPTOMS_RESET";




export const POST_SIGNS_REQUEST = "POST_SIGNS_REQUEST";
export const POST_SIGNS_SUCCESS = "POST_SIGNS_SUCCESS";
export const POST_SIGNS_FAIL = "POST_SIGNS_FAIL";
export const POST_SIGNS_RESET = "POST_SIGNS_RESET";


export const saveSyptomsReducer = (state = { loading: false }, action) => {
  switch (action.type) {
    case POST_SYMPTOMS_REQUEST:
      return { ...state, loading: true };
    case POST_SYMPTOMS_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case POST_SYMPTOMS_FAIL:
      return { ...state, loading: false, error: action.payload };
    case POST_SYMPTOMS_RESET:
      return { loading: false };
    default:
      return state;
  }
};


export const saveSignsReducer = (state = { loading: false }, action) => {
  switch (action.type) {
    case POST_SIGNS_REQUEST:
      return { ...state, loading: true };
    case POST_SIGNS_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case POST_SIGNS_FAIL:
      return { ...state, loading: false, error: action.payload };
    case POST_SIGNS_RESET:
      return { loading: false };
    default:
      return state;
  }
};
