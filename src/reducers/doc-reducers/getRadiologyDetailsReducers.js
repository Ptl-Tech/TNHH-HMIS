import {
  REQUEST_RADIOLOGY_DETAILS,
  REQUEST_RADIOLOGY_DETAILS_FAIL,
  REQUEST_RADIOLOGY_DETAILS_RESET,
  REQUEST_RADIOLOGY_DETAILS_SUCCESS,
} from '../../actions/Doc-actions/getRadiologyDetails';

export const getRadiologyDetailsReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case REQUEST_RADIOLOGY_DETAILS:
      return { loading: true, data: [] };
    case REQUEST_RADIOLOGY_DETAILS_SUCCESS:
      return { loading: false, data: action.payload };
    case REQUEST_RADIOLOGY_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case REQUEST_RADIOLOGY_DETAILS_RESET:
      return { loading: false };
    default:
      return state;
  }
};
