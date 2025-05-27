import { GET_SINGLE_DISCHARGE_REQUEST_FAIL, GET_SINGLE_DISCHARGE_REQUEST_SUCCESS, GET_SINGLE_DISCHARGE_REQUEST_RESET,
    GET_SINGLE_DISCHARGE_REQUEST_REQUEST
 } from "../../actions/reception-actions/getSingleDischargeRequest";


const initialState = {
  loading: false,
  success: false,
  error: false,
  data: {},
};

export const getSingleDischargeRequestReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SINGLE_DISCHARGE_REQUEST_REQUEST:
      return { ...state, loading: true, success: false, error: null };
    case GET_SINGLE_DISCHARGE_REQUEST_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload };
    case GET_SINGLE_DISCHARGE_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload,
      };
    case GET_SINGLE_DISCHARGE_REQUEST_RESET:
      return initialState;
    default:
      return state;
  }
};
