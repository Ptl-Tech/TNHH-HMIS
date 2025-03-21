import {
  POST_PHARMACY_HEADER_FAIL,
  POST_PHARMACY_HEADER_RESET,
  POST_PHARMACY_HEADER_REQUEST,
  POST_PHARMACY_HEADER_SUCCESS,
} from '../../actions/pharmacy-actions/postPharmacyHeader';

const initialState = {
  data: null,
  error: null,
  loading: false,
};

export const postPharmacyHeaderReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_PHARMACY_HEADER_REQUEST:
      return { ...state, loading: true };
    case POST_PHARMACY_HEADER_SUCCESS:
      return { ...state, data: action.payload, loading: false };
    case POST_PHARMACY_HEADER_FAIL:
      return { ...state, loading: false, error: action.payload };
    case POST_PHARMACY_HEADER_RESET:
      return initialState;
    default:
      return state;
  }
};
