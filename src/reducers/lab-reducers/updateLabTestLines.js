import {
  POST_LAB_TEST_LINES_UPDATE_FAIL,
  POST_LAB_TEST_LINES_UPDATE_RESET,
  POST_LAB_TEST_LINES_UPDATE_REQUEST,
  POST_LAB_TEST_LINES_UPDATE_SUCCESS,
} from "../../actions/lab-actions/updateLabTestLines";

const initialState = {
  data: null,
  error: null,
  loading: false,
};

export const updateLabTestLinesReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_LAB_TEST_LINES_UPDATE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case POST_LAB_TEST_LINES_UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case POST_LAB_TEST_LINES_UPDATE_RESET:
      return initialState;
    case POST_LAB_TEST_LINES_UPDATE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
