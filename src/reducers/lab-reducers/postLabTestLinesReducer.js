import {
  POST_LAB_TEST_LINES_FAIL,
  POST_LAB_TEST_LINES_REQUEST,
  POST_LAB_TEST_LINES_RESET,
  POST_LAB_TEST_LINES_SUCCESS,
} from '../../actions/lab-actions/postLabTestLines';

const initialState = {
  data: null,
  error: null,
  loading: false,
};

export const postLabTestLinesReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_LAB_TEST_LINES_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case POST_LAB_TEST_LINES_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case POST_LAB_TEST_LINES_RESET:
      return initialState;
    case POST_LAB_TEST_LINES_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
