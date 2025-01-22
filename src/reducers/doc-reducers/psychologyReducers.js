import {
    POST_PSYCHOLOGY_REQUEST_REVIEW_REQUEST,
    POST_PSYCHOLOGY_REQUEST_REVIEW_SUCCESS,
    POST_PSYCHOLOGY_REQUEST_REVIEW_FAIL,
    POST_PSYCHOLOGY_REQUEST_REVIEW_RESET
} from "../../actions/Doc-actions/psychologyReducers";


export const postPsychologyRequestReducer = (state = { loading: false }, action) => {
  switch (action.type) {
    case POST_PSYCHOLOGY_REQUEST_REVIEW_REQUEST:
      return { ...state, loading: true };
    case POST_PSYCHOLOGY_REQUEST_REVIEW_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case POST_PSYCHOLOGY_REQUEST_REVIEW_FAIL:
      return { ...state, loading: false, error: action.payload };
    case POST_PSYCHOLOGY_REQUEST_REVIEW_RESET:
      return { loading: false };
    default:
      return state;
  }
};
