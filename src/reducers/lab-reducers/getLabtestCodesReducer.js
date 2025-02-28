import {
  GET_LAB_TEST_CODES_RESET,
  GET_LAB_TEST_CODES_FAIL,
  GET_LAB_TEST_CODES_REQUEST,
  GET_LAB_TEST_CODES_SUCCESS,
} from '../../actions/lab-actions/getLabTestCodes';

const initialState = {
  data: [],
  error: null,
  loading: false,
};

export const getLabTestCodesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_LAB_TEST_CODES_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_LAB_TEST_CODES_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case GET_LAB_TEST_CODES_RESET:
      return initialState;
    case GET_LAB_TEST_CODES_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
