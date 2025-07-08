import {
  POST_DISPATCH_TO_LAB_FAIL,
  POST_DISPATCH_TO_LAB_RESET,
  POST_DISPATCH_TO_LAB_REQUEST,
  POST_DISPATCH_TO_LAB_SUCCESS,
} from "../../actions/lab-actions/dispatchToLab";

const initialState = {
  data: null,
  error: null,
  loading: false,
};

export const postDispatchToLabReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_DISPATCH_TO_LAB_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case POST_DISPATCH_TO_LAB_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case POST_DISPATCH_TO_LAB_RESET:
      return initialState;
    case POST_DISPATCH_TO_LAB_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
