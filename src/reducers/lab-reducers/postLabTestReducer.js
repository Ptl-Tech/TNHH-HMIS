import {
  POST_LAB_TEST_FAIL,
  POST_LAB_TEST_REQUEST,
  POST_LAB_TEST_RESET,
  POST_LAB_TEST_SUCCESS,
} from '../../actions/lab-actions/postLabTest';

const initialState = {
  data: null,
  error: null,
  loading: false,
};

export const postLabTestReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_LAB_TEST_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case POST_LAB_TEST_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case POST_LAB_TEST_RESET:
      return initialState;
    case POST_LAB_TEST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
