import {
  REQUEST_RADIOLOGY_LIST,
  REQUEST_RADIOLOGY_LIST_FAIL,
  REQUEST_RADIOLOGY_LIST_RESET,
  REQUEST_RADIOLOGY_LIST_SUCCESS,
} from '../../actions/Doc-actions/getRadiologyList';

export const getRadiologyListReducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case REQUEST_RADIOLOGY_LIST:
      return { loading: true, data: [] };
    case REQUEST_RADIOLOGY_LIST_SUCCESS:
      return { loading: false, data: action.payload };
    case REQUEST_RADIOLOGY_LIST_FAIL:
      return { loading: false, error: action.payload };
    case REQUEST_RADIOLOGY_LIST_RESET:
      return { loading: false };
    default:
      return state;
  }
};
