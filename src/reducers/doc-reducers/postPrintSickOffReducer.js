import {
  POST_PRINT_SICK_OFF_FAIL,
  POST_PRINT_SICK_OFF_REQUEST,
  POST_PRINT_SICK_OFF_RESET,
  POST_PRINT_SICK_OFF_SUCCESS,
} from "../../actions/Doc-actions/postPrintSickOff";

const initialState = {
  data: null,
  error: null,
  loading: false,
};

export const postPrintSickOffReducer = (state = initialState, action) => {
  var returnValue;

  switch (action.type) {
    case POST_PRINT_SICK_OFF_REQUEST:
      returnValue = { ...state, loading: true };
      break;
    case POST_PRINT_SICK_OFF_FAIL:
      returnValue = { ...state, loading: false, error: action.payload };
      break;
    case POST_PRINT_SICK_OFF_SUCCESS:
      returnValue = { ...state, loading: false, data: action.payload };
      break;
    case POST_PRINT_SICK_OFF_RESET:
      returnValue = initialState;
      break;
    default:
      returnValue = initialState;
      break;
  }

  return returnValue;
};
