import {
  REQUEST_LAB_DETAILS,
  REQUEST_LAB_DETAILS_FAIL,
  REQUEST_LAB_DETAILS_RESET,
  REQUEST_LAB_DETAILS_SUCCESS,
} from '../../actions/Doc-actions/getLabRequestDetails';

export const getLabDetailsReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case REQUEST_LAB_DETAILS:
      return { loading: true, data: [] };
    case REQUEST_LAB_DETAILS_SUCCESS:
      return { loading: false, data: action.payload };
    case REQUEST_LAB_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case REQUEST_LAB_DETAILS_RESET:
      return { loading: false };
    default:
      return state;
  }
};
