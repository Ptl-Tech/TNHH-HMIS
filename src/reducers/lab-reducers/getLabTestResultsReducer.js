import {
  GET_LAB_TEST_RESULTS_FAIL,
  GET_LAB_TEST_RESULTS_REQUEST,
  GET_LAB_TEST_RESULTS_SUCCESS,
} from '../../actions/lab-actions/getLabTestResults';

const initialState = {
  data: [],
  error: null,
  loading: false,
};

export const getLabTestResultsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_LAB_TEST_RESULTS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_LAB_TEST_RESULTS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case GET_LAB_TEST_RESULTS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
