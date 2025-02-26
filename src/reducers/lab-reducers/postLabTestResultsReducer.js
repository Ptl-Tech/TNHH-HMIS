import {
  POST_LAB_TEST_RESULTS_FAIL,
  POST_LAB_TEST_RESULTS_REQUEST,
  POST_LAB_TEST_RESULTS_SUCCESS,
} from '../../actions/lab-actions/postLabTestResults';

const initialState = {
  data: null,
  error: null,
  loading: false,
};

export const postLabTestResultsReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_LAB_TEST_RESULTS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case POST_LAB_TEST_RESULTS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case POST_LAB_TEST_RESULTS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
