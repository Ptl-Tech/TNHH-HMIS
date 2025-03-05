import {
  POST_LAB_HEADER_FAIL,
  POST_LAB_HEADER_REQUEST,
  POST_LAB_HEADER_RESET,
  POST_LAB_HEADER_SUCCESS,
} from '../../actions/lab-actions/createLabTestHeader';

const initialState = {
  data: null,
  error: null,
  loading: false,
};

export const createLabTestHeaderReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_LAB_HEADER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case POST_LAB_HEADER_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case POST_LAB_HEADER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case POST_LAB_HEADER_RESET:
      return initialState;
    default:
      return state;
  }
};
