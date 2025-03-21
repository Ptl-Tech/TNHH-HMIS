import {
  GET_NEW_PHARMACY_REQUESTS,
  GET_NEW_PHARMACY_REQUESTS_SUCCESS,
  GET_NEW_PHARMACY_REQUESTS_FAILURE,
  GET_NEW_PHARMACY_REQUESTS_RESET,
} from '../../actions/pharmacy-actions/getNewPharmacyRequest';

const initialState = {
  data: [],
  loading: false,
  error: null,
};

export const getNewPharmacyRequestsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_NEW_PHARMACY_REQUESTS:
      return { ...state, loading: true };
    case GET_NEW_PHARMACY_REQUESTS_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case GET_NEW_PHARMACY_REQUESTS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case GET_NEW_PHARMACY_REQUESTS_RESET:
      return initialState;
    default:
      return state;
  }
};
