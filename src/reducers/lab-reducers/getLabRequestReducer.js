import {
  GET_LAB_REQUEST_FAIL,
  GET_LAB_REQUEST_REQUEST,
  GET_LAB_REQUEST_RESET,
  GET_LAB_REQUEST_SUCCESS,
} from '../../actions/lab-actions/getLabRequest';

const initialState = {
  data: null,
  error: null,
  loading: false,
};

export const getLabRequestReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_LAB_REQUEST_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_LAB_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case GET_LAB_REQUEST_RESET:
      return initialState;
    case GET_LAB_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
