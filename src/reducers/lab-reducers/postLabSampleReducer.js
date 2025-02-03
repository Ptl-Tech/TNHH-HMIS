import {
  POST_LAB_SAMPLE_FAIL,
  POST_LAB_SAMPLE_REQUEST,
  POST_LAB_SAMPLE_SUCCESS,
} from '../../actions/lab-actions/postLabSample';

const initialState = {
  data: null,
  error: null,
  loading: false,
};

export const postLabSampleReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_LAB_SAMPLE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case POST_LAB_SAMPLE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case POST_LAB_SAMPLE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
