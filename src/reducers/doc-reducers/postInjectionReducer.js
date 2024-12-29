export const POST_DOC_INJECTIONS_REQUEST = "POST_INJECTIONS_REQUEST";
export const POST_DOC_INJECTIONS_SUCCESS = "POST_INJECTIONS_SUCCESS";
export const POST_DOC_INJECTIONS_FAIL = "POST_INJECTIONS_FAIL";
export const POST_DOC_INJECTIONS_RESET = "POST_INJECTIONS_RESET";

export const postDocInjectionsReducer = (state = { loading: false }, action) => {
  switch (action.type) {
    case POST_DOC_INJECTIONS_REQUEST:
      return { ...state, loading: true };
    case POST_DOC_INJECTIONS_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case POST_DOC_INJECTIONS_FAIL:
      return { ...state, loading: false, error: action.payload };
    case POST_DOC_INJECTIONS_RESET:
      return { loading: false };
    default:
      return state;
  }
};