import {
  POST_LAB_TEST_REMARKS_FAIL,
  POST_LAB_TEST_REMARKS_RESET,
  POST_LAB_TEST_REMARKS_REQUEST,
  POST_LAB_TEST_REMARKS_SUCCESS,
} from '../../actions/lab-actions/postTestRemarks';

const initialState = {
  data: null,
  error: null,
  loading: false,
};

export const postTestRemarksReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_LAB_TEST_REMARKS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case POST_LAB_TEST_REMARKS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case POST_LAB_TEST_REMARKS_RESET:
      return initialState;
    case POST_LAB_TEST_REMARKS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
