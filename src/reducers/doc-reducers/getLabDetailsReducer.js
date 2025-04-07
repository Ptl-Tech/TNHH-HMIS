import {
  REQUEST_LAB_DETAILS,
  REQUEST_LAB_DETAILS_FAIL,
  REQUEST_LAB_DETAILS_RESET,
  REQUEST_LAB_DETAILS_SUCCESS,
} from '../../actions/Doc-actions/getLabRequestDetails';

const initialState = {
  data: [],
  error: null,
  loading: false,
};

export const getLabDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_LAB_DETAILS:
      return { ...state, loading: true };
    case REQUEST_LAB_DETAILS_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case REQUEST_LAB_DETAILS_FAIL:
      return { ...state, loading: false, error: action.payload };
    case REQUEST_LAB_DETAILS_RESET:
      return initialState;
    default:
      return state;
  }
};
